import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UsuarioPuedeAccederGuard } from './guards/usuarioPuedeAcceder/usuario-puede-acceder.guard';
import { TiposDeVotacionesComponent } from './components/tiposDeVotaciones/tipos-de-votaciones/tipos-de-votaciones.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule),
  },
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [UsuarioPuedeAccederGuard],
  },
  {
    path: 'mis-votapps',
    loadChildren: () => import('./modules/votapps/misvotapps/misvotapps.module').then(m => m.MisvotappsModule),
    canActivate: [UsuarioPuedeAccederGuard],
  },
  {
    path: 'nueva-votapp',
    loadChildren: () => import('./modules/votapps/nueva-votapp/nueva-votapp.module').then(m => m.NuevaVotappModule),
    canActivate: [UsuarioPuedeAccederGuard],
  },
  {
    path: 'nueva-comunidad',
    loadChildren: () => import('./modules/comunidad/nueva-comunidad/nueva-comunidad.module').then(m => m.NuevaComunidadModule),
    canActivate: [UsuarioPuedeAccederGuard],
  },
  {
    path: 'tipos-de-votaciones',
    component: TiposDeVotacionesComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  /* { path: '**', redirectTo: 'auth/login' }, */
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, enableViewTransitions: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
