import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotonesInicioComponent } from 'src/app/components/util/botones-inicio/botones-inicio.component';
import { IonicModule } from '@ionic/angular';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    BotonesInicioComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    MatButtonModule,
    TranslateModule,
    RouterModule
  ], exports: [
    BotonesInicioComponent
  ]
})
export class UtilSharedModule { }
