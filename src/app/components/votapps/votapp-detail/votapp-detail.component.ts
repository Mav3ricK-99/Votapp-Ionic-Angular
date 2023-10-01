import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TipoVoto } from 'src/app/classes/tipoVoto/tipo-voto';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { VotacionIntegrantes } from 'src/app/classes/votacionIntegrantes/votacion-integrantes';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { VotacionService } from 'src/app/services/votacion/votacion.service';
import { UserService } from 'src/app/services/user/user.service';
import { Preferences } from '@capacitor/preferences';
@Component({
  selector: 'app-votapp-detail',
  templateUrl: './votapp-detail.component.html',
  styleUrls: ['./votapp-detail.component.scss'],
})
export class VotappDetailComponent implements OnInit {

  public votapp: Votacion;
  public mostrarVista: boolean = false;
  public availableResults: string[] = [];

  public mostrarOtrosVotos: boolean = false;
  public viendoVotosTipo: string;

  public votosFiltrados: VotacionIntegrantes[];

  public tipoDeVotos: TipoVoto[];
  public opcionesTipoDeVotos: TipoVoto[];

  public pocosDiasRestantes: number;

  constructor(private router: ActivatedRoute, public dialog: MatDialog, public userService: UserService, private votacionService: VotacionService) {
    this.tipoDeVotos = [];
    this.opcionesTipoDeVotos = [];
    this.viendoVotosTipo = '';
    this.pocosDiasRestantes = 999;

    this.llamarGetVotapp();

    this.votacionService.getTipoDeVotos().subscribe({
      next: (obj: any) => {
        this.tipoDeVotos = obj;
        setTimeout(() => {
          this.getOtrasOpciones();
        }, 150);
      },
      error: err => {
        //error
      }
    });
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

  public mostrarVotos(nombreTipoVoto: string) {
    let tipoVoto: TipoVoto | null = null;
    this.viendoVotosTipo = 'pendiente';
    if (nombreTipoVoto !== 'pendiente') {
      tipoVoto = TipoVoto.getVoteType(nombreTipoVoto);
      this.viendoVotosTipo = nombreTipoVoto;
    }
    this.votosFiltrados = this.votapp.obtenerVotosPorTipoVoto(tipoVoto);
    this.mostrarOtrosVotos = true;
  }

  public cambiarVoto(voto: TipoVoto) {
    this.votapp.cambiarVotoParticipante(this.userService.currentUser, voto);
    this.getOtrasOpciones();
    this.mostrarOtrosVotos = true;
    this.viendoVotosTipo = voto.nombre;
    this.votosFiltrados = this.votapp.obtenerVotosPorTipoVoto(voto);
  }

  public getOtrasOpciones() {
    this.opcionesTipoDeVotos = [];

    this.tipoDeVotos.forEach((tipoVoto: TipoVoto) => {
      let votoUsuario: boolean | TipoVoto = this.votapp.votoParticipante(this.userService.currentUser);
      if (votoUsuario instanceof TipoVoto) {
        if (tipoVoto.nombre != votoUsuario.nombre) {
          this.opcionesTipoDeVotos.push(tipoVoto);
        }
      } else {
        this.opcionesTipoDeVotos.push(tipoVoto);
      }
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.mostrarVista = false;
      this.llamarGetVotapp();
      event.target.complete();
    }, 500);
  }

  public abrirDialog(voto: TipoVoto) {
    this.dialog.open(ConfirmarCambioVotoDialog, { maxWidth: '90vw', panelClass: 'cambiarVotoDialog' })
      .afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.votacionService.changeVote(this.votapp.id, voto.nombre).subscribe({
            next: (obj: any) => {
              this.cambiarVoto(voto);
            },
            error: err => {
              console.error(err);
            }
          });
        }
      });
  }

  private llamarGetVotapp() {
    const id = this.router.snapshot.paramMap.get('id') ?? '-1';

    this.votacionService.getVotapp(id).subscribe({
      next: (obj: any) => {
        this.votapp = obj;
        this.mostrarVista = true;
        return obj;
      },
      error: err => {
      },
    });
  }

}

@Component({
  selector: 'confirmar-cambio-voto-dialog',
  templateUrl: 'confirmar-cambio-voto-dialog.html',
  styleUrls: ['./confirmar-cambio-voto-dialog.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmarCambioVotoDialog {

  constructor(public dialogRef: MatDialogRef<ConfirmarCambioVotoDialog>) { }

  public confirm(): void {
    this.dialogRef.close(true);
  };

  public cancel(): void {
    this.dialogRef.close(false);
  };
}