import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NuevaVotappRoutingModule } from './nueva-votapp-routing.module';
import { NuevaVotappComponent } from 'src/app/components/votapps/nueva-votapp/nueva-votapp.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    NuevaVotappComponent,
  ],
  imports: [
    CommonModule,
    NuevaVotappRoutingModule,
    IonicModule,
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ], providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'}
  ],
})
export class NuevaVotappModule { }
