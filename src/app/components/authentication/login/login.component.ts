import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JWT } from 'src/app/interfaces/jwt/jwt';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  public loginForm: FormGroup;
  constructor(formBuilder: FormBuilder, private authService: AuthenticationService, private storage: StorageService, private router: Router) {
    this.loginForm = formBuilder.group({
      email: new FormControl('federico_99@live.com.ar', { validators: [Validators.required, Validators.email], updateOn: 'blur' }),
      password: new FormControl('votapp9090..', { validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur' }),
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
        /* console.log(helper.decodeToken(jwt.access_token)); */
        localStorage.setItem('jwt', JSON.stringify(jwt));
        this.router.navigateByUrl('/dashboard/misVottaps');
      },
      error: err => {
        console.log(err);
      }
    });
  }
}