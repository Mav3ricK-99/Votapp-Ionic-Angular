import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonImg, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { InfoDialogComponent } from 'src/app/components/util/info-dialog/info-dialog.component';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonContent, IonRow, IonCol, IonGrid, IonFooter, IonImg, IonTitle, MatInputModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, TranslateModule, MatIconModule, UpperCasePipe, TitleCasePipe]
})
export class ResetPasswordComponent {

  private authService: AuthenticationService = inject(AuthenticationService);
  private dialog: MatDialog = inject(MatDialog);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  public hidePassword: boolean = true;
  public hideRepeatPassword: boolean = true;

  private email: string;
  public passwordResetForm: FormGroup;

  public disabledButton: boolean;

  constructor() {
    this.passwordResetForm = this.formBuilder.group({
      token: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
      password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur' }),
      repeatPassword: new FormControl('', { validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur' }),
    }, { validators: [this.validarContraseñas()] });

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { email: string };
    this.email = state.email;
  }

  submitResetPassword() {
    this.passwordResetForm.markAllAsTouched();
    if (!this.passwordResetForm.valid) return;

    let token = this.passwordResetForm.get('token')?.value;
    let password = this.passwordResetForm.get('password')?.value;

    this.disabledButton = true;
    this.authService.resetPassword(this.email, token, password).subscribe({
      next: (obj: any) => {
        this.dialog.closeAll();
        this.dialog.open(InfoDialogComponent, {
          maxWidth: '90vw', data: {
            titulo: 'Contraseña modificada',
            mensaje: 'Tu contraseña fue modificada, ahora te redireccionaremos a la pantalla de inicio para que puedas ingresar a Votapp.',
          }
        }).afterClosed().subscribe(() => {
          this.router.navigate([`/auth/login`]);
        });
      },
      error: err => {
        switch (err.error.codigoError) {
          case 404: {
            this.passwordResetForm.get('token')?.setErrors({
              invalidToken: true,
            });
          }; break;
          case 498: {
            this.passwordResetForm.get('token')?.setErrors({
              expiredToken: true,
            });
          }; break;
        }
        this.passwordResetForm.markAllAsTouched();
      },
    }).add(() => {
      this.disabledButton = false;
    });
  }

  validarContraseñas(): ValidatorFn {
    return (passwordResetForm: AbstractControl): ValidationErrors | null => {
      let password = passwordResetForm.get('password');
      let repeatPassword = passwordResetForm.get('repeatPassword');

      if (password?.value) {
        if (password.value !== repeatPassword?.value) {
          this.passwordResetForm.get('repeatPassword')?.setErrors({
            passwordsMustMatch: true,
          });
        }
      }

      return null;
    }
  }
}
