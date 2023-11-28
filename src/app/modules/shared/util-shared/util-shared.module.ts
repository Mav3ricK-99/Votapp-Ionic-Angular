import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotonesInicioComponent } from 'src/app/components/util/botones-inicio/botones-inicio.component';
import { IonicModule } from '@ionic/angular';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { InfoDialogComponent } from 'src/app/components/util/info-dialog/info-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { ProcesandoDialogComponent } from 'src/app/components/util/procesando-dialog/procesando-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@NgModule({
  declarations: [
    BotonesInicioComponent,
    InfoDialogComponent,
    ProcesandoDialogComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    MatButtonModule,
    TranslateModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    RouterModule
  ], exports: [
    BotonesInicioComponent,
  ]
})
export class UtilSharedModule { }
