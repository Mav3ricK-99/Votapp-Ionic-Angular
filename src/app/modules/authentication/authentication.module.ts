import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from 'src/app/components/authentication/login/login.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtHelperService } from "@auth0/angular-jwt";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RegisterComponent } from 'src/app/components/authentication/register/register.component';
import { PasswordResetTokenComponent } from 'src/app/components/authentication/passwordRestore/password-reset-token/password-reset-token.component';
import { ResetPasswordComponent } from 'src/app/components/authentication/passwordRestore/reset-password/reset-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UtilSharedModule } from '../shared/util-shared/util-shared.module';
import { CompletarPerfilComponent } from 'src/app/components/authentication/completarPerfil/completar-perfil.component';
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    PasswordResetTokenComponent,
    ResetPasswordComponent,
    CompletarPerfilComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    AuthenticationRoutingModule,
    TranslateModule,
    FormsModule,
    UtilSharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatDialogModule,
  ], providers: [JwtHelperService]
})
export class AuthenticationModule { }
