import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map, of, startWith } from 'rxjs';
import { User } from 'src/app/classes/user/user';
import { passwordsMustMatch } from 'src/app/customValidators/PasswordsMustMatch/passwords-must-match';
import { Country } from 'src/app/interfaces/country/country';
import { JWT } from 'src/app/interfaces/jwt/jwt';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

  public hidePassword: boolean = true;
  public hideRepeatPassword: boolean = true;

  langsArray: string[] = [];
  langs: Observable<string[]>;;
  countries: Observable<Country[]>;

  public signUpForm: FormGroup;
  constructor(formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router, private _translate: TranslateService) {
    this.signUpForm = formBuilder.group({
      email: new FormControl('federico_99@live.com.ar', { validators: [Validators.required, Validators.email, Validators.maxLength(60)] }),
      name: new FormControl('Federico', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(45)] }),
      surname: new FormControl('Gutierrez', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(45)] }),
      residenceCountry: new FormControl('Argentina', { validators: [Validators.required] }),
      language: new FormControl('Español', { validators: [Validators.required] }),
      yearBirth: new FormControl('1999', { validators: [Validators.required] }),
      password: new FormControl('votapp9090..', { validators: [Validators.required, Validators.minLength(6)] }),
      repeatPassword: new FormControl('votapp9090..', { validators: [Validators.required, Validators.minLength(6)] }),
    }, { validators: [passwordsMustMatch, this.languageIsValid()] });

    this.countries = this._translate.get('countries');
    this.countries.forEach((countries: Country[]) => {
      countries.forEach((c: Country) => {
        if (c.language && this.langsArray.filter((lang) => c.language == lang).length < 1)
          this.langsArray.push(c.language);
      })
    })
    this.langs = of(this.langsArray);
  }

  submitSignUpForm() {
    if (!this.signUpForm.valid) return;

    let email = this.signUpForm.get('email')?.value;
    let name = this.signUpForm.get('name')?.value;
    let surname = this.signUpForm.get('surname')?.value;
    let residenceCountry = this.signUpForm.get('residenceCountry')?.value;
    let yearBirth = this.signUpForm.get('yearBirth')?.value;
    let password = this.signUpForm.get('password')?.value;

    let newUser = new User(0, name, surname, email, residenceCountry, yearBirth)

    this.authService.signUpUser(newUser, password).subscribe({
      next: (obj: any) => {
        const helper = new JwtHelperService();

        let jwt: JWT = {
          access_token: obj.access_token,
          refresh_token: obj.refresh_token,
        }
        /* console.log(helper.decodeToken(jwt.access_token)); */
        localStorage.setItem('jwt', JSON.stringify(jwt));
        this.router.navigateByUrl('/mis-votapps');
      },
      error: err => {
        if (err.error.detalleError.includes('email_unique')) {
          this.signUpForm.get('email')?.setErrors({
            duplicateEmail: true,
          });
          this.signUpForm.markAllAsTouched();
        }
      }
    })
  }

  languageIsValid(): ValidatorFn {
    return (signUpForm: AbstractControl): ValidationErrors | null => {
      let languageInput = signUpForm.get('language');
      if (languageInput?.value && this.langsArray.filter((lang) => languageInput?.value == lang).length < 1) {
        return {
          invalidLanguage: true
        }
      }
      return null;
    }
  }

  /* getEmailErrorMessage() {
    let emailInput = this.signUpForm.get('email');
    if (!emailInput || !emailInput?.errors) return;
  
    let firstError = Object.keys(emailInput.errors)[0]
    let errorMsg = '';
    switch (firstError) {
      case 'required': errorMsg = 'El correo electronico es requerido.'; break;
      case 'email': errorMsg = 'El correo electronico debe ser valido.'; break;
      case 'maxlength': errorMsg = 'El correo electronico debe tener como maximo 60 caracteres.'; break;
      case 'duplicateEmail': errorMsg = 'Correo electronico ya en uso.'; break;
    }
    return errorMsg;
  } */

  getNameErrorMessage() {
    let nameInput = this.signUpForm.get('name');
    if (!nameInput || !nameInput?.errors) return;

    let firstError = Object.keys(nameInput.errors)[0]
    let errorMsg = '';
    switch (firstError) {
      case 'required': errorMsg = 'El nombre es requerido.'; break;
      case 'minlength': errorMsg = 'El nombre debe tener al menos 6 caracteres.'; break;
      case 'maxlength': errorMsg = 'El nombre debe tener como maximo 45 caracteres.'; break;
    }
    return errorMsg;
  }

  getSurnameErrorMessage() {
    let surnameInput = this.signUpForm.get('surname');
    if (!surnameInput || !surnameInput?.errors) return;

    let firstError = Object.keys(surnameInput.errors)[0]
    let errorMsg = '';
    switch (firstError) {
      case 'required': errorMsg = 'El apellido es requerido.'; break;
      case 'minlength': errorMsg = 'El apellido debe tener al menos 6 caracteres.'; break;
      case 'maxlength': errorMsg = 'El apellido debe tener como maximo 45 caracteres.'; break;
    }
    return errorMsg;
  }

  getResidenceCountryErrorMessage() {
    let residenceInput = this.signUpForm.get('residenceCountry');
    if (!residenceInput || !residenceInput?.errors) return;

    let firstError = Object.keys(residenceInput.errors)[0]
    let errorMsg = '';
    switch (firstError) {
      case 'required': errorMsg = 'El pais de residencia es requerido.'; break;
    }
    return errorMsg;
  }

  getLanguageErrorMessage() {
    let languageInput = this.signUpForm.get('language');
    if (!languageInput) return;

    let errorMsg = '';
    if (languageInput?.errors) {

      let firstError = Object.keys(languageInput.errors)[0]
      switch (firstError) {
        case 'required': errorMsg = 'El idioma es requerido.'; break;
      }
    } else if (this.signUpForm.errors?.['invalidLanguage']) {
      errorMsg = 'Idioma no valido.';
    }
    return errorMsg;
  }

  getYearBirthErrorMessage() {
    let birthYearInput = this.signUpForm.get('yearBirth');
    if (!birthYearInput || !birthYearInput?.errors) return;

    let firstError = Object.keys(birthYearInput.errors)[0]
    let errorMsg = '';
    switch (firstError) {
      case 'required': errorMsg = 'El campo año de nacimiento es requerido.'; break;
    }
    return errorMsg;
  }

  getPasswordErrorMessage() {
    let passwordInput = this.signUpForm.get('password');
    if (!passwordInput) return;

    let errorMsg = '';
    if (passwordInput.errors) {
      let firstError = Object.keys(passwordInput.errors)[0]
      switch (firstError) {
        case 'required': errorMsg = 'El campo contraseña es requerido.'; break;
        case 'minlength': errorMsg = 'El campo contraseña debe ser de al menos 6 caracteres.'; break;
      }
    } else if (this.signUpForm.errors?.['passwordsMustMatch']) {
      errorMsg = 'Las contraseñas deben coincidir.';
    }
    return errorMsg;
  }

  getRepeatPasswordErrorMessage() {
    let repeatPasswordInput = this.signUpForm.get('repeatPassword');
    if (!repeatPasswordInput || !repeatPasswordInput?.errors) return;

    let firstError = Object.keys(repeatPasswordInput.errors)[0]
    let errorMsg = '';
    switch (firstError) {
      case 'required': errorMsg = 'El campo repetir contraseña es requerido.'; break;
      case 'minlength': errorMsg = 'El campo repetir contraseña debe ser de al menos 6 caracteres.'; break;
    }

    return errorMsg;
  }
}
