import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TipoVoto } from 'src/app/classes/tipoVoto/tipo-voto';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { VotacionIntegrantes } from 'src/app/classes/votacionIntegrantes/votacion-integrantes';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { VotacionService } from 'src/app/services/votacion/votacion.service';
import { UserService } from 'src/app/services/user/user.service';
@Component({
  selector: 'app-votapp-detail',
  templateUrl: './votapp-detail.component.html',
  styleUrls: ['./votapp-detail.component.scss'],
})
export class VotappDetailComponent {

  public votapp: Votacion;
  public mostrarVista: boolean = false;
  public availableResults: string[] = [];

  public mostrarOtrosVotos: boolean = false;

  public votosFiltrados: VotacionIntegrantes[];

  public tipoDeVotos: TipoVoto[];
  public opcionesTipoDeVotos: TipoVoto[];

  constructor(private router: ActivatedRoute, public dialog: MatDialog, public userService: UserService, private votacionService: VotacionService) {
    this.tipoDeVotos = [];
    this.opcionesTipoDeVotos = [];

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

  public mostrarVotos(nombreVoto: string | null) {
    let tipoVoto: TipoVoto | null = null;
    if (nombreVoto != null) {
      tipoVoto = this.tipoDeVotos.filter((tipoVoto: TipoVoto) => {
        return tipoVoto.nombre.includes(nombreVoto) ? true : false;
      })[0];
    }
    this.mostrarOtrosVotos = true;
    this.votosFiltrados = this.votapp.obtenerVotosPorTipoVoto(tipoVoto);
  }

  public cambiarVoto(voto: TipoVoto) {
    this.votapp.cambiarVotoParticipante(this.userService.currentUser, voto);
    this.getOtrasOpciones();
    this.mostrarOtrosVotos = true;
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
              console.log(voto);
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