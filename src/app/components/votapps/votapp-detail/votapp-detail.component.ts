import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comunidad } from 'src/app/classes/comunidad/comunidad';
import { TipoVoto } from 'src/app/classes/tipoVoto/tipo-voto';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { VotacionDecision } from 'src/app/classes/votacionDecision/votacion-decision';
import { VotacionIntegrantes } from 'src/app/classes/votacionIntegrantes/votacion-integrantes';
import { Decisiones } from 'src/app/interfaces/decisiones/decisiones';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { VotacionService } from 'src/app/services/votacion/votacion.service';
import { VotacionTipo } from 'src/app/classes/votacionTipo/votacion-tipo';
import { VotacionFrecuencia } from 'src/app/classes/votacionFrecuencia/votacion-frecuencia';
@Component({
  selector: 'app-votapp-detail',
  templateUrl: './votapp-detail.component.html',
  styleUrls: ['./votapp-detail.component.scss'],
})
export class VotappDetailComponent implements OnInit {

  public votapp: Votacion;
  public availableResults: string[];

  public showOtherVotes: boolean = false;

  public Decision = Decisiones;

  public filteredVotes: VotacionIntegrantes[];

  constructor(private router: Router, public dialog: MatDialog, private votacionService: VotacionService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { votapp: Votacion };
    let votacionTipoComunidad: VotacionTipo = new VotacionTipo(state.votapp.comunidad.votacionTipo.nombre, state.votapp.comunidad.votacionTipo.habilitado);
    let comunidad: Comunidad = new Comunidad(state.votapp.comunidad.id, state.votapp.comunidad.nombre, state.votapp.comunidad.descripcion, state.votapp.comunidad.comunidadLogo, votacionTipoComunidad, new Date(state.votapp.comunidad.created_at ?? ''));

    let votacionDecision: VotacionDecision = new VotacionDecision(state.votapp.votacionDecision.nombre, state.votapp.votacionDecision.habilitado);
    let votacionIntegrantes: VotacionIntegrantes[] = state.votapp.votacionIntegrantes.map((votacionIntegrante: any) => {
      let tipoVoto: TipoVoto | null = null;
      if (votacionIntegrante.tipoVoto != null) {
        tipoVoto = new TipoVoto(votacionIntegrante.tipoVoto.nombre, votacionIntegrante.tipoVoto.computaQuorum, votacionIntegrante.tipoVoto.computaResultado, votacionIntegrante.tipoVoto.computaAfirmativo, votacionIntegrante.tipoVoto.computaNegativo, votacionIntegrante.tipoVoto.habilitado);
      }
      return new VotacionIntegrantes(votacionIntegrante.miVoto, votacionIntegrante.porcentaje, tipoVoto);
    });
    let votacionFrecuencia: VotacionFrecuencia | null = null;
    if (state.votapp.votacionFrecuencia) {
      votacionFrecuencia = new VotacionFrecuencia(state.votapp.votacionFrecuencia.nombre, state.votapp.votacionFrecuencia.dias, state.votapp.votacionFrecuencia.habilitado);
    }
    let votacionTipo: VotacionTipo = new VotacionTipo(state.votapp.votacionTipo.nombre, state.votapp.votacionTipo.habilitado);
    this.votapp = new Votacion(state.votapp.id, state.votapp.aceptacionRequerida, state.votapp.detalle, state.votapp.proximaVotacion, state.votapp.quorumRequerido, state.votapp.repetir, state.votapp.requiereAceptacion, new Date(state.votapp.vencimiento), state.votapp.votacionPunto, comunidad, votacionDecision, votacionTipo, votacionFrecuencia);
    this.votapp._votacionIntegrantes = votacionIntegrantes;
  }

  ngOnInit() {
    this.getOtherDecision();
  }

  public openDialog(result: string) {
    let voteType: Decisiones = Decisiones[result as keyof typeof Decisiones];
    this.dialog.open(ConfirmVoteChangeDialog, { maxWidth: '90vw' })
      .afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.votacionService.changeVote(this.votapp.id, voteType).subscribe({
            next: (obj: any) => {
              console.log(voteType);
              this.changeVote(voteType);
            },
            error: err => {
              console.error(err);
            }
          });
        }
      });
  }

  public showVotes(type: string) {
    this.showOtherVotes = true;
    this.filteredVotes = this.votapp.getVotesByType(type);
  }

  public changeVote(result: string) {
    this.votapp.changeMyVote(result);
    this.getOtherDecision();
  }

  public getOtherDecision() {
    let voteState: string = this.votapp.myVoteStatePretty();
    let availableResults = Object.keys(Decisiones).filter((result: any) => {
      if (typeof result == 'number') {
        return false;
      }
      if (voteState != "pendiente") {
        return result.toLocaleLowerCase() != voteState.toLocaleLowerCase();
      } else {
        return true;
      }
    });

    this.availableResults = <string[]>availableResults;
  }

}

@Component({
  selector: 'confirm-vote-change-dialog',
  templateUrl: 'confirm-vote-change-dialog.html',
  styleUrls: ['./confirm-vote-change-dialog.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmVoteChangeDialog {

  constructor(public dialogRef: MatDialogRef<ConfirmVoteChangeDialog>) { }

  public confirm(): void {
    this.dialogRef.close(true);
  };

  public cancel(): void {
    this.dialogRef.close(false);
  };
}