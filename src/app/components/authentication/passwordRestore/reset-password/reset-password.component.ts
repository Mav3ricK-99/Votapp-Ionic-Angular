import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordsMustMatch } from 'src/app/customValidators/PasswordsMustMatch/passwords-must-match';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  public hidePassword: boolean = true;
  public hideRepeatPassword: boolean = true;

  email: string;
  public passwordResetForm: FormGroup;

  constructor(formBuilder: FormBuilder, private authService: AuthenticationService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.passwordResetForm = formBuilder.group({
      token: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
      password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur' }),
      repeatPassword: new FormControl('', { validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur' }),
    }, { validators: [passwordsMustMatch] });

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }

  submitResetPassword() {
    if (!this.passwordResetForm.valid) return;

    let token = this.passwordResetForm.get('token')?.value;
    let password = this.passwordResetForm.get('password')?.value;

    this.authService.resetPassword(this.email, token, password).subscribe({
      next: (obj: any) => {
        this.router.navigateByUrl('/auth/login');
      },
      error: err => {
        console.log(err)
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
      }
    });
  }
}
