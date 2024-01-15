import { Component } from '@angular/core';
import { bounceInLeftAnimation, bounceInRightAnimation } from 'angular-animations';

@Component({
  selector: 'app-tipos-de-votaciones',
  templateUrl: './tipos-de-votaciones.component.html',
  styleUrls: ['./tipos-de-votaciones.component.scss'],
  animations: [
    bounceInLeftAnimation(),
    bounceInRightAnimation(),
  ]
})
export class TiposDeVotacionesComponent {

  estadoAnimacion: boolean = false;

  constructor() { }

  ionViewDidEnter() {
    this.estadoAnimacion = true;
  }
}
