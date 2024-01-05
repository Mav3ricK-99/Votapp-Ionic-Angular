import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-botones-inicio',
  templateUrl: './botones-inicio.component.html',
  styleUrls: ['./botones-inicio.component.scss'],
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
