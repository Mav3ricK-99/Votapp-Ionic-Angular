import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comunidad } from 'src/app/classes/comunidad/comunidad';
import { TipoVoto } from 'src/app/classes/tipoVoto/tipo-voto';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { VotacionDecision } from 'src/app/classes/votacionDecision/votacion-decision';
import { VotacionIntegrantes } from 'src/app/classes/votacionIntegrantes/votacion-integrantes';
import { Resultados } from 'src/app/enums/resultados/resultados';

@Component({
  selector: 'app-votapp-detail',
  templateUrl: './votapp-detail.component.html',
  styleUrls: ['./votapp-detail.component.scss'],
})
export class VotappDetailComponent implements OnInit {

  public votapp: Votacion;
  public availableResults: string[];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { votapp: Votacion };
    let comunidad: Comunidad = new Comunidad(state.votapp.comunidad.nombre, state.votapp.comunidad.descripcion, state.votapp.comunidad.comunidadLogo, new Date(state.votapp.comunidad.created_at ?? ''));
    let votacionDecision: VotacionDecision = new VotacionDecision(state.votapp.votacionDecision.nombre, state.votapp.votacionDecision.habilitado);
    let votacionIntegrantes: VotacionIntegrantes[] = state.votapp.votacionIntegrantes.map((votacionIntegrante: any) => {
      let tipoVoto: TipoVoto = new TipoVoto(votacionIntegrante.tipoVoto.nombre, votacionIntegrante.tipoVoto.computaQuorum, votacionIntegrante.tipoVoto.computaResultado, votacionIntegrante.tipoVoto.computaAfirmativo, votacionIntegrante.tipoVoto.computaNegativo, votacionIntegrante.tipoVoto.habilitado);
      return new VotacionIntegrantes(votacionIntegrante.miVoto, votacionIntegrante.porcentaje, tipoVoto);
    })
    this.votapp = new Votacion(state.votapp.id, state.votapp.aceptacionRequerida, state.votapp.detalle, state.votapp.proximaVotacion, state.votapp.quorumRequerido, state.votapp.repetir, state.votapp.requiereAceptacion, new Date(state.votapp.vencimiento), state.votapp.votacionPunto, comunidad, votacionDecision);
    this.votapp._votacionIntegrantes = votacionIntegrantes;
  }

  ngOnInit() {
    this.getOtherResults();
  }

  public changeVote(result: string) {
    this.votapp.changeMyVote(result);
    this.getOtherResults();
  }

  public getOtherResults() {
    let voteState: string = this.votapp.myVoteState();

    let availableResults = Object.values(Resultados).filter((result: any) => {
      if (typeof result == 'number') {
        return false;
      }
      if (voteState != "pending") {
        return result.toLocaleLowerCase() != voteState.toLocaleLowerCase();
      } else {
        return true;
      }
    });

    this.availableResults = <string[]>availableResults;
  }

}
