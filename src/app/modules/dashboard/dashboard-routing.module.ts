import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisVotappsComponent } from 'src/app/components/mis-votapps/mis-votapps.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/misVottaps',
    pathMatch: 'full'
  },
  {
    path: 'misVottaps',
    component: MisVotappsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
