import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'mis-votapps',
    loadChildren: () => import('./modules/votapps/misvotapps/misvotapps.module').then(m => m.MisvotappsModule)
  },
  {
    path: 'nueva-votapp',
    loadChildren: () => import('./modules/votapps/nueva-votapp/nueva-votapp.module').then(m => m.NuevaVotappModule)
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
