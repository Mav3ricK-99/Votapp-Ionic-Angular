import { Routes } from '@angular/router';
import { UsuarioPuedeAccederGuard } from './guards/usuarioPuedeAcceder/usuario-puede-acceder.guard';
import { LoginComponent } from './components/authentication/login/login.component';
import { CompletarPerfilComponent } from './components/authentication/completarPerfil/completar-perfil.component';
import { ResetPasswordComponent } from './components/authentication/passwordRestore/reset-password/reset-password.component';
import { PasswordResetTokenComponent } from './components/authentication/passwordRestore/password-reset-token/password-reset-token.component';
import { UsuarioYaIngresadoGuard } from './guards/usuarioYaIngresado/usuario-ya-ingresado.guard';
import { RegisterComponent } from './components/authentication/register/register.component';
import { MisVotappsComponent } from './components/mis-votapps/mis-votapps.component';
import { VotappDetailComponent } from './components/votapps/votapp-detail/votapp-detail.component';
import { NuevaComunidadComponent } from './components/comunidad/nueva-comunidad/nueva-comunidad.component';
import { NuevaVotappComponent } from './components/votapps/nueva-votapp/nueva-votapp.component';
import { TiposDeVotacionesComponent } from './components/tiposDeVotaciones/tipos-de-votaciones.component';

const authRoutes: Routes = [
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
]

const misVotapps: Routes = [
  {
    path: '',
    component: MisVotappsComponent,
  }, {
    path: ':id',
    component: VotappDetailComponent,
  }
];

const nuevaVotapp: Routes = [{
  path: '',
  component: NuevaVotappComponent,
}];

const nuevaComunidad: Routes = [{
  path: '',
  component: NuevaComunidadComponent,
}];

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => authRoutes
  },
  {
    path: 'mis-votapps',
    loadChildren: () => misVotapps
  },
  {
    path: 'nueva-votapp',
    loadChildren: () => nuevaVotapp
  },
  {
    path: 'nueva-comunidad',
    loadChildren: () => nuevaComunidad
  },
  {
    path: 'tipos-de-votaciones',
    loadComponent: () => TiposDeVotacionesComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  /* { path: '**', redirectTo: 'auth/login' }, */
];