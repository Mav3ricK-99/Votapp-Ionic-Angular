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
import { InicioComponent } from './components/inicio/inicio.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListadoComponent } from './components/gobiernos/listado/listado.component';
import { DetalleComponent } from './components/gobiernos/detalle/detalle.component';

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

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => authRoutes
  },
  {
    path: 'inicio',
    loadComponent: () => InicioComponent,
    canActivate: [UsuarioPuedeAccederGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [UsuarioPuedeAccederGuard],
    children: [
      {
        path: 'mis-votapps',
        loadComponent: () => MisVotappsComponent,
      },
      {
        path: 'mis-votapps/:id',
        loadComponent: () => VotappDetailComponent,
      },
      {
        path: 'tipos-de-votaciones',
        loadComponent: () => TiposDeVotacionesComponent,
      },
      {
        path: 'nueva-votapp',
        loadComponent: () => NuevaVotappComponent,
        canActivate: [UsuarioPuedeAccederGuard],
      },
      {
        path: 'nueva-comunidad',
        loadComponent: () => NuevaComunidadComponent,
        canActivate: [UsuarioPuedeAccederGuard],
      },
      {
        path: 'gobierno',
        loadComponent: () => ListadoComponent,
        canActivate: [UsuarioPuedeAccederGuard],
      },
      {
        path: 'gobierno/detalle',
        loadComponent: () => DetalleComponent,
        canActivate: [UsuarioPuedeAccederGuard],
      },
      {
        path: '**',
        redirectTo: '/dashboard/mis-votapps',
        pathMatch: 'full'
      }
    ],
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'inicio'
  },
];