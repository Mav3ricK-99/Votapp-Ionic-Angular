import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonMenuButton, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButtons, IonContent, IonGrid, IonRow, IonCol, MatIconModule, MatButtonModule, MatCardModule, MatMenu, MatMenuTrigger, MatMenuItem, MatExpansionModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSliderModule, RouterLink]
})
export class ListadoComponent implements OnInit {

  private router: Router = inject(Router);

  constructor() { }

  ngOnInit() { }

  formatLabel(value: number): string {
    return `${value}km`;
  }

  irAlDetalle() {
    this.router.navigateByUrl('dashboard/gobierno/detalle');
  }
}
