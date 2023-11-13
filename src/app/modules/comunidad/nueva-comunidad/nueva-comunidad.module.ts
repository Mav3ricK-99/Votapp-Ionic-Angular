import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NuevaComunidadRoutingModule } from './nueva-comunidad-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NuevaComunidadComponent } from 'src/app/components/comunidad/nueva-comunidad/nueva-comunidad.component';
import { UtilSharedModule } from '../../shared/util-shared/util-shared.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DetalleIntegranteComponent } from 'src/app/components/comunidad/detalle-integrante/detalle-integrante.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [
    NuevaComunidadComponent,
    DetalleIntegranteComponent
  ],
  imports: [
    CommonModule,
    NuevaComunidadRoutingModule,
    UtilSharedModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule
  ], providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ],
})
export class NuevaComunidadModule { }
