import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisvotappsRoutingModule } from './misvotapps-routing.module';
import { MisVotappsComponent } from 'src/app/components/mis-votapps/mis-votapps.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { VotappCardComponent } from 'src/app/components/votapps/votappCard/votapp-card/votapp-card.component';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [
    MisVotappsComponent,
    VotappCardComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    MisvotappsRoutingModule,
    TranslateModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class MisvotappsModule { }
