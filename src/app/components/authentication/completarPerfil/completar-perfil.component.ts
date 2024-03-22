import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/classes/user/user';
import { Country } from 'src/app/interfaces/country/country';
import { JWT } from 'src/app/interfaces/jwt/jwt';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { InfoDialogComponent } from '../../util/info-dialog/info-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonImg, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AsyncPipe, LowerCasePipe, NgClass, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-completar-perfil',
  templateUrl: './completar-perfil.component.html',
  styleUrls: ['./completar-perfil.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonGrid, IonTitle, IonContent, IonImg, IonFooter, UpperCasePipe, IonCol, IonRow, TitleCasePipe, NgClass, ReactiveFormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, TranslateModule, MatIconModule, MatAutocompleteModule, LowerCasePipe, AsyncPipe]
})
export class CompletarPerfilComponent {

  private authService: AuthenticationService = inject(AuthenticationService);
  private dialog: MatDialog = inject(MatDialog);
  private _translate: TranslateService = inject(TranslateService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  public hidePassword: boolean = true;
  public hideRepeatPassword: boolean = true;

  langs: Observable<any>;
  countries: Observable<Country[]>;

  public perfilForm: FormGroup;
  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { email: string };
    this.perfilForm = this.formBuilder.group({
      email: new FormControl(state.email, { validators: [Validators.required, Validators.email, Validators.maxLength(60)], updateOn: 'blur' },),
      name: new FormControl('', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(45)], updateOn: 'blur' }),
      surname: new FormControl('', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(45)], updateOn: 'blur' }),
      residenceCountry: new FormControl('Argentina', { validators: [Validators.required], updateOn: 'blur' }),
      language: new FormControl('', { validators: [Validators.required] }),
      yearBirth: new FormControl('', { validators: [Validators.required, Validators.max(2023)], updateOn: 'blur' }),
      password: new FormControl('', { validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur' }),
      repeatPassword: new FormControl('', { validators: [Validators.required, Validators.minLength(6)] }),
    }, { validators: [this.validarContraseñas(), this.validarIdioma()] });

    this.countries = this._translate.get('countries');
    this.langs = this._translate.get('languages');

    this.perfilForm.get('language')?.valueChanges.subscribe(langValue => {
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

  completarDatosPerfil() {
    this.perfilForm.markAllAsTouched();
    if (!this.perfilForm.valid) return;

    let email = this.perfilForm.get('email')?.value;
    let name = this.perfilForm.get('name')?.value;
    let surname = this.perfilForm.get('surname')?.value;
    let residenceCountry = this.perfilForm.get('residenceCountry')?.value;
    let yearBirth = this.perfilForm.get('yearBirth')?.value;
    let password = this.perfilForm.get('password')?.value;

    let newUser = new User(0, name, surname, email, residenceCountry, yearBirth)

    this.authService.completarDatos(newUser, password).subscribe({
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
        console.log(err);
      }
    });
  }

  validarIdioma(): ValidatorFn {
    return (perfilForm: AbstractControl): ValidationErrors | null => {
      let idioma = perfilForm.get('language');
      if (idioma?.value) {
        let idiomaIngresado: string = idioma.value.toLowerCase();
        let idiomaInvalido: boolean = false;
        if (idiomaIngresado != 'español' && idiomaIngresado != 'english') {
          idiomaInvalido = true;
        }

        if (idiomaInvalido) {
          this.perfilForm.get('language')?.setErrors({
            idiomaInvalido: true,
          });
        }
      }

      return null;
    }
  }

  validarContraseñas(): ValidatorFn {
    return (perfilForm: AbstractControl): ValidationErrors | null => {
      let password = perfilForm.get('password');
      let repeatPassword = perfilForm.get('repeatPassword');

      if (password?.value) {
        if (password.value !== repeatPassword?.value) {
          this.perfilForm.get('repeatPassword')?.setErrors({
            passwordsMustMatch: true,
          });
        }
      }

      return null;
    }
  }

}
