import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Device } from '@capacitor/device';
import { JWT } from 'src/app/interfaces/jwt/jwt';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  public hidePassword: boolean = true;
  public loginForm: FormGroup;
  constructor(formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router) {
    this.loginForm = formBuilder.group({
      email: new FormControl('federico1999g@gmail.com', { validators: [Validators.required, Validators.email, Validators.max(60)], updateOn: 'blur' }),
      password: new FormControl('federico99', { validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur' }),
    });
  }

  submitLoginForm() {
    if (!this.loginForm.valid) return;

    let email = this.loginForm.get('email')?.value;
    let password = this.loginForm.get('password')?.value;
    this.authService.authenticate(email, password).subscribe({
      next: (obj: any) => {
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
        if (err.status === 401 || err.error?.message?.includes('Bad credentials')) {
          this.loginForm.get('password')?.setErrors({
            badCredentials: true,
          });
          this.loginForm.markAllAsTouched();
        }
      }
    });
  }
}