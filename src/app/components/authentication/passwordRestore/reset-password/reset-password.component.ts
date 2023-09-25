import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {

  public hidePassword: boolean = true;
  public hideRepeatPassword: boolean = true;

  private email: string;
  public passwordResetForm: FormGroup;

  public disabledButton: boolean;

  constructor(formBuilder: FormBuilder, private authService: AuthenticationService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.passwordResetForm = formBuilder.group({
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
        this.router.navigateByUrl('/auth/login');
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
