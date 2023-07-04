import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  public loginForm: FormGroup;
  constructor(formBuilder: FormBuilder, private authService: AuthenticationService, private storage: StorageService) {
    this.loginForm = formBuilder.group({
      email: new FormControl('', { validators: [Validators.required, Validators.email], updateOn: 'blur' }),
      password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur' }),
    });

  }

  submitLoginForm() {
    console.log(this.loginForm.valid);
    if (!this.loginForm.valid) return;

    let email = this.loginForm.get('email')?.value;
    let password = this.loginForm.get('password')?.value;
    //this.storage.get('jwt')?.then(v => console.log(v));
    this.authService.authenticate(email, password).subscribe({
      next: (jwt: any) => {
        console.log(jwt.access_token);
        const helper = new JwtHelperService();

        console.log(helper.decodeToken(jwt.access_token));
        this.storage.set('jwt', jwt.access_token);
      },
      error: err => {
        console.log(err);
      }
    }
    );
  }
}