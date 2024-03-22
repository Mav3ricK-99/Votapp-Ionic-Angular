import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { UserService } from 'src/app/services/user/user.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { IonButton, IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { NgClass, UpperCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-votapp-card',
  templateUrl: './votapp-card.component.html',
  styleUrls: ['./votapp-card.component.scss'],
  standalone: true,
  imports: [IonGrid, IonButton, MatCardModule, IonRow, IonCol, RouterLink, UpperCasePipe, MatIconModule, MatButtonModule, TranslateModule, NgClass]
})
export class VotappCardComponent implements OnInit {

  public userService: UserService = inject(UserService);

  @Input('votapp') votapp: Votacion;

  public pocosDiasRestantes: number;

  constructor() {
    this.pocosDiasRestantes = 999;
  }

  ngOnInit(): void {
    Preferences.get({ key: 'parametros' }).then((data: any) => {
      if (data.value) {
        let paramDiasRestantes = JSON.parse(data.value).parametros.filter((parametro: any) => {
          return parametro.codigo == 'PARAM003' ? parametro : null;
        });
        this.pocosDiasRestantes = paramDiasRestantes[0].valor;
      }
    });
  }

}
