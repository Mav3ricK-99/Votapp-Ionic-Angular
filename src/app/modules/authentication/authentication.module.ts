import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { IonicModule } from '@ionic/angular';
import { LoginComponent } from 'src/app/components/authentication/login/login.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtHelperService, JwtModule } from "@auth0/angular-jwt";

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    AuthenticationRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule
  ], providers: [JwtHelperService]
})
export class AuthenticationModule { }
