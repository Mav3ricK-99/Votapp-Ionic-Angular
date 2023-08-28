import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevaVotappComponent } from 'src/app/components/votapps/nueva-votapp/nueva-votapp.component';

const routes: Routes = [{
  path: '',
  component: NuevaVotappComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NuevaVotappRoutingModule { }
