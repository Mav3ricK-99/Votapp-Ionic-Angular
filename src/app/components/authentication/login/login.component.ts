import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JWT } from 'src/app/interfaces/jwt/jwt';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  public hidePassword: boolean = true;
  public loginForm: FormGroup;
  public appVersion: string;
  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router, private platform: Platform, @Optional() private routerOutlet?: IonRouterOutlet) {
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
        this.loginForm.reset();
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
}