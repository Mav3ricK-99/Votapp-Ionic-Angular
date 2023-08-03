import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisVotappsComponent } from 'src/app/components/mis-votapps/mis-votapps.component';
import { VotappDetailComponent } from 'src/app/components/votapps/votapp-detail/votapp-detail.component';
const routes: Routes = [
  {
    path: '',
    component: MisVotappsComponent,
  }, {
    path: ':id',
    component: VotappDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisvotappsRoutingModule { }
