import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompletarPerfilComponent } from 'src/app/components/authentication/completarPerfil/completar-perfil.component';
import { LoginComponent } from 'src/app/components/authentication/login/login.component';
import { PasswordResetTokenComponent } from 'src/app/components/authentication/passwordRestore/password-reset-token/password-reset-token.component';
import { ResetPasswordComponent } from 'src/app/components/authentication/passwordRestore/reset-password/reset-password.component';
import { RegisterComponent } from 'src/app/components/authentication/register/register.component';
import { UsuarioYaIngresadoGuard } from 'src/app/guards/usuarioYaIngresado/usuario-ya-ingresado.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UsuarioYaIngresadoGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [UsuarioYaIngresadoGuard],
  },
  {
    path: 'password-reset-token',
    component: PasswordResetTokenComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'completar-perfil',
    component: CompletarPerfilComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
