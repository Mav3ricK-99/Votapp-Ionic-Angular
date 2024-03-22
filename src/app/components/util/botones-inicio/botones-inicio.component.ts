import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { IonCol, IonRow } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-botones-inicio',
  templateUrl: './botones-inicio.component.html',
  styleUrls: ['./botones-inicio.component.scss'],
  standalone: true,
  imports: [IonRow, IonCol, RouterLink, UpperCasePipe, MatButtonModule, TranslateModule]
})
export class BotonesInicioComponent implements OnInit {

  @Input('botonPresionado') botonPresionado: string;

  public colorMisVotapps: string;
  public colorNuevaVotapp: string;
  constructor() { }

  ngOnInit() {
    if (this.botonPresionado.includes('misVotapps')) {
      this.colorMisVotapps = 'darkPrimary';
      this.colorNuevaVotapp = 'white';
    } else {
      this.colorMisVotapps = 'white';
      this.colorNuevaVotapp = 'darkPrimary';
    }
  }
}
