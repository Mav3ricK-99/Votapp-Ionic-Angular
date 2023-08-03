import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisvotappsRoutingModule } from './misvotapps-routing.module';
import { MisVotappsComponent } from 'src/app/components/mis-votapps/mis-votapps.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { VotappCardComponent } from 'src/app/components/votapps/votapp-card/votapp-card.component';
import { MatCardModule } from '@angular/material/card';
import { VotappDetailComponent } from 'src/app/components/votapps/votapp-detail/votapp-detail.component';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    MisVotappsComponent,
    VotappCardComponent,
    VotappDetailComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    MisvotappsRoutingModule,
    TranslateModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule
  ]
})
export class MisvotappsModule { }
