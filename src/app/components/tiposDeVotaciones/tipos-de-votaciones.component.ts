import { Component } from '@angular/core';
import { bounceInLeftAnimation, bounceInRightAnimation } from 'angular-animations';
import { RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonMenuButton, IonRefresher, IonRefresherContent, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { NgClass, UpperCasePipe } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tipos-de-votaciones',
  templateUrl: './tipos-de-votaciones.component.html',
  styleUrls: ['./tipos-de-votaciones.component.scss'],
  animations: [
    bounceInLeftAnimation(),
    bounceInRightAnimation(),
  ],
  standalone: true,
  imports: [IonHeader, IonContent, IonToolbar, IonButtons, IonTitle, IonRefresher, IonRefresherContent, NgClass, MatIconModule, IonMenuButton, MatRippleModule, IonGrid, IonButton, MatCardModule, IonRow, IonCol, RouterLink, UpperCasePipe, MatButtonModule, TranslateModule]
})
export class TiposDeVotacionesComponent {

  estadoAnimacion: boolean = false;

  constructor() { }

  ionViewDidEnter() {
    this.estadoAnimacion = true;
  }
}
