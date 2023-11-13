import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevaComunidadComponent } from 'src/app/components/comunidad/nueva-comunidad/nueva-comunidad.component';

const routes: Routes = [{
  path: '',
  component: NuevaComunidadComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NuevaComunidadRoutingModule { }
