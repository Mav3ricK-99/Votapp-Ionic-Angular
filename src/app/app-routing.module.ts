import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UsuarioPuedeAccederGuard } from './guards/usuarioPuedeAcceder/usuario-puede-acceder.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule),
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
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  /* { path: '**', redirectTo: 'auth/login' }, */
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
