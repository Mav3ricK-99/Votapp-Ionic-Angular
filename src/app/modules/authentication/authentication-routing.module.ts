import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/app/components/authentication/login/login.component';
import { PasswordResetTokenComponent } from 'src/app/components/authentication/passwordRestore/password-reset-token/password-reset-token.component';
import { ResetPasswordComponent } from 'src/app/components/authentication/passwordRestore/reset-password/reset-password.component';
import { RegisterComponent } from 'src/app/components/authentication/register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'password-reset-token',
    component: PasswordResetTokenComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
