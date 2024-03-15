import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-votapp-card',
  templateUrl: './votapp-card.component.html',
  styleUrls: ['./votapp-card.component.scss'],
})
export class VotappCardComponent implements OnInit {

  @Input('votapp') votapp: Votacion;

  public pocosDiasRestantes: number;

  constructor(public userService: UserService) {
    this.pocosDiasRestantes = 999;
  }

  ngOnInit(): void {
    Preferences.get({ key: 'parametros' }).then((data: any) => {
      if (data.value) { //Aca obtengo por cada card (optimizar(?))
        let paramDiasRestantes = JSON.parse(data.value).parametros.filter((parametro: any) => {
          return parametro.codigo == 'PARAM003' ? parametro : null;
        });
        this.pocosDiasRestantes = paramDiasRestantes[0].valor;
      }
    });
  }

  xd() {
    console.log("XD");
  }
}
