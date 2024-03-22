import { Component, OnInit, Optional, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonRouterOutlet, IonicModule, Platform } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JWT } from 'src/app/interfaces/jwt/jwt';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { NgClass, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonImg, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonRow, IonHeader, IonCol, IonToolbar, IonTitle, IonContent, NgClass, IonImg, UpperCasePipe, TitleCasePipe, IonFooter, IonGrid, MatFormFieldModule, MatInputModule, ReactiveFormsModule, TranslateModule, RouterLink, MatIconModule, MatButtonModule]
})
export class LoginComponent implements OnInit {

  private authService: AuthenticationService = inject(AuthenticationService);
  private platform: Platform = inject(Platform);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  public hidePassword: boolean = true;
  public loginForm: FormGroup;
  public appVersion: string;
  constructor(@Optional() private routerOutlet?: IonRouterOutlet) {
    this.appVersion = '';
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.routerOutlet && !this.routerOutlet.canGoBack()) {
        App.minimizeApp();
      }
    });
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', { validators: [Validators.required, Validators.email, Validators.max(60)], updateOn: 'blur' }),
      password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)] }),
    });

    Preferences.get({ key: 'parametros' }).then((data: any) => {
      if (data.value) {
        let paramAppVersion = JSON.parse(data.value).parametros.filter((parametro: any) => {
          return parametro.codigo == 'PARAM000' ? parametro : null;
        });
        this.appVersion = paramAppVersion[0].literal;
      }
    });
  }

  submitLoginForm() {
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid) return;

    let email = this.loginForm.get('email')?.value;
    let password = this.loginForm.get('password')?.value;
    this.authService.authenticate(email, password).subscribe({
      next: (obj: any) => {
        this.loginForm.reset();

        const pushNotificationsDisponible: boolean = Capacitor.isPluginAvailable('PushNotifications');
        if (pushNotificationsDisponible) {
          this.registrarseParaNotificaciones();
          this.getNotificaciones();
        }

        const helper = new JwtHelperService();
        let jwt: JWT = {
          access_token: obj.access_token,
          refresh_token: obj.refresh_token,
        }
        let currentUser = helper.decodeToken(jwt.access_token); //Este en realidad es el payload
        localStorage.setItem('jwt', JSON.stringify(jwt));
        localStorage.setItem('current_user', JSON.stringify(currentUser));
        this.router.navigateByUrl('/mis-votapps');
      },
      error: err => {
        console.log(err);
        switch (err.status) {
          case 400: {
            this.router.navigate([`/completar-perfil`], {
              state: { email: email },
            });
          }; break;
          case 401: {
            let mensajeError: string = err.error?.message ?? err.error?.mensajeError ?? '';

            if (mensajeError.includes('Bad credentials')) {
              this.loginForm.get('password')?.setErrors({
                badCredentials: true,
              });
              this.loginForm.markAllAsTouched();
            }
            if (mensajeError.includes('Cambiar contraseña')) {
              this.router.navigateByUrl(`/password-reset-token`);
            }
          }; break;
          case 429: {
            this.loginForm.get('password')?.setErrors({
              tooManyAttempts: true,
            });
          }
        }
      }
    });
  }

  registrarseParaNotificaciones = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'granted') {
      await PushNotifications.register();
    }
  }

  getNotificaciones = async () => {
    await PushNotifications.getDeliveredNotifications();
  }
}