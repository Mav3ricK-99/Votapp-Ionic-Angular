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
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { RegisterComponent } from 'src/app/components/authentication/register/register.component';
import { PasswordResetTokenBottomSheet, PasswordResetTokenComponent } from 'src/app/components/authentication/passwordRestore/password-reset-token/password-reset-token.component';
import { ResetPasswordComponent } from 'src/app/components/authentication/passwordRestore/reset-password/reset-password.component';
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    PasswordResetTokenComponent,
    PasswordResetTokenBottomSheet,
    ResetPasswordComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    AuthenticationRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatListModule
  ], providers: [JwtHelperService]
})
export class AuthenticationModule { }
