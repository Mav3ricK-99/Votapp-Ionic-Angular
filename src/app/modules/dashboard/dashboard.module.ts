import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MisVotappsComponent } from 'src/app/components/mis-votapps/mis-votapps.component';


@NgModule({
  declarations: [
    MisVotappsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
