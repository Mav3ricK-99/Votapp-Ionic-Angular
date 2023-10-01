import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/classes/user/user';
import { Country } from 'src/app/interfaces/country/country';
import { JWT } from 'src/app/interfaces/jwt/jwt';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { InfoDialogComponent } from '../../util/info-dialog/info-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

  public hidePassword: boolean = true;
  public hideRepeatPassword: boolean = true;

  langs: Observable<any>;
  countries: Observable<Country[]>;

  public signUpForm: FormGroup;
  constructor(formBuilder: FormBuilder, private authService: AuthenticationService, private router: Router, public dialog: MatDialog, private _translate: TranslateService) {
    this.signUpForm = formBuilder.group({
      email: new FormControl('', { validators: [Validators.required, Validators.email, Validators.maxLength(60)], updateOn: 'blur' }),
      name: new FormControl('', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(45)], updateOn: 'blur' }),
      surname: new FormControl('', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(45)], updateOn: 'blur' }),
      residenceCountry: new FormControl('Argentina', { validators: [Validators.required], updateOn: 'blur' }),
      language: new FormControl('', { validators: [Validators.required] }),
      yearBirth: new FormControl('', { validators: [Validators.required, Validators.max(2023)], updateOn: 'blur' }),
      password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur' }),
      repeatPassword: new FormControl('', { validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur' }),
    }, { validators: [this.validarContraseñas(), this.validarIdioma()] });

    this.countries = this._translate.get('countries');
    this.langs = this._translate.get('languages');

    this.signUpForm.get('language')?.valueChanges.subscribe(langValue => {
      this.langs.forEach((lenguajes: any) => {
        lenguajes.forEach((lenguaje: any) => {
          if (lenguaje.language.toLowerCase() == langValue.toLowerCase()) {
            this._translate.use(lenguaje.shortLanguage);
            this.countries = this._translate.get('countries');
            this.langs = this._translate.get('languages');
          }
        })
      })
    });
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
        let currentUser = helper.decodeToken(jwt.access_token);

        localStorage.setItem('jwt', JSON.stringify(jwt));
        localStorage.setItem('current_user', JSON.stringify(currentUser));

        this.dialog.open(InfoDialogComponent, {
          maxWidth: '90vw', data: {
            titulo: 'Tu registro en Votapp se realizo con éxito!',
            mensaje: 'Lo importante es tu voto, que nadie decida por vos.',
          }
        }).afterClosed().subscribe(() => {
          this.router.navigate([`/mis-votapps`]);
        });
      },
      error: err => {
        if (err.error?.detalleError.includes('email_unique')) {
          this.signUpForm.get('email')?.setErrors({
            duplicateEmail: true,
          });
          this.signUpForm.markAllAsTouched();
        }
      }
    })
  }

  validarIdioma(): ValidatorFn {
    return (signUpForm: AbstractControl): ValidationErrors | null => {
      let idioma = signUpForm.get('language');
      if (idioma?.value) {
        let idiomaIngresado: string = idioma.value.toLowerCase();
        let idiomaInvalido: boolean = false;
        if (idiomaIngresado != 'español' && idiomaIngresado != 'english') {
          idiomaInvalido = true;
        }

        if (idiomaInvalido) {
          this.signUpForm.get('language')?.setErrors({
            idiomaInvalido: true,
          });
        }
      }

      return null;
    }
  }

  validarContraseñas(): ValidatorFn {
    return (signUpForm: AbstractControl): ValidationErrors | null => {
      let password = signUpForm.get('password');
      let repeatPassword = signUpForm.get('repeatPassword');

      if (password?.value) {
        if (password.value !== repeatPassword?.value) {
          this.signUpForm.get('repeatPassword')?.setErrors({
            passwordsMustMatch: true,
          });
        }
      }

      return null;
    }
  }
}
