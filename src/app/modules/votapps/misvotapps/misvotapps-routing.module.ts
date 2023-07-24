import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisVotappsComponent } from 'src/app/components/mis-votapps/mis-votapps.component';

const routes: Routes = [
  {
    path: '',
    component: MisVotappsComponent,
    pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisvotappsRoutingModule { }
