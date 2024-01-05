import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TipoVoto } from 'src/app/classes/tipoVoto/tipo-voto';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { VotacionIntegrantes } from 'src/app/classes/votacionIntegrantes/votacion-integrantes';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { VotacionService } from 'src/app/services/votacion/votacion.service';
import { UserService } from 'src/app/services/user/user.service';
import { Preferences } from '@capacitor/preferences';
import { MatIcon } from '@angular/material/icon';
import { RegistroEventosService } from 'src/app/services/registroEventos/registro-eventos.service';
@Component({
  selector: 'app-votapp-detail',
  templateUrl: './votapp-detail.component.html',
  styleUrls: ['./votapp-detail.component.scss'],
})
export class VotappDetailComponent implements OnInit, AfterViewInit {

  @ViewChild('detalleVotacion', { read: ElementRef, static: false }) detalleVotacion: ElementRef;
  @ViewChild('mostrarMas') mostrarMas: MatIcon;

  public votapp: Votacion;
  public availableResults: string[] = [];

  public mostrarOtrosVotos: boolean = false;
  public viendoVotosTipo: string;

  public votosFiltrados: VotacionIntegrantes[];

  public tipoDeVotos: TipoVoto[];
  public opcionesTipoDeVotos: TipoVoto[];

  public pocosDiasRestantes: number;
  public altoPantalla: any;
  public mostrarIconoDetalle: boolean;

  public votacionLista: boolean;

  constructor(private router: ActivatedRoute, public dialog: MatDialog, public userService: UserService, private votacionService: VotacionService, private registroEventosService: RegistroEventosService) {
    this.mostrarIconoDetalle = false;
    this.votacionLista = false;
    this.tipoDeVotos = [];
    this.opcionesTipoDeVotos = [];
    this.viendoVotosTipo = '';
    this.pocosDiasRestantes = 999;

    this.llamarGetVotapp();
  }

  ngOnInit(): void {
    this.altoPantalla = window.innerHeight;
    Preferences.get({ key: 'parametros' }).then((data: any) => {
      if (data.value) {
        let paramDiasRestantes = JSON.parse(data.value).parametros.filter((parametro: any) => {
          return parametro.codigo == 'PARAM003' ? parametro : null;
        });
        this.pocosDiasRestantes = paramDiasRestantes[0].valor;
      }
    });
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      let cincoPorcientoAltoPantalla = (this.altoPantalla * 5) / 100;
      if (this.detalleVotacion.nativeElement.offsetHeight > cincoPorcientoAltoPantalla) {
        this.mostrarIconoDetalle = true;
      }
    }, 250);
  }

  public toggleMostrarDetalle() {
    let detalleVotacion: any = this.detalleVotacion.nativeElement;
    if (detalleVotacion.classList.contains('detalleVotacionCerrado')) {
      detalleVotacion.classList.remove('detalleVotacionCerrado');
      detalleVotacion.classList.add('detalleVotacionAbierto');
      this.mostrarMas._elementRef.nativeElement.classList.add('rotate-90');
    } else {
      this.mostrarMas._elementRef.nativeElement.classList.remove('rotate-90');
      detalleVotacion.classList.remove('detalleVotacionAbierto');
      detalleVotacion.classList.add('detalleVotacionCerrado');
    }
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
      this.llamarGetVotapp();
      event.target.complete();
    }, 500);
  }

  public abrirDialog(voto: TipoVoto) {
    this.dialog.open(ConfirmarCambioVotoDialog, { maxWidth: '90vw', panelClass: 'cambiarVotoDialog' })
      .afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.votacionService.changeVote(this.votapp.id, voto.nombre).subscribe({
            next: () => {
              this.cambiarVoto(voto);
            },
            error: err => {
              console.error(err);
            }
          });
        } else {
          this.registroEventosService.registroConfirmacionVoto(this.votapp.id, voto, false).subscribe();
        }
      });
  }

  private llamarGetVotapp() {
    const id = this.router.snapshot.paramMap.get('id') ?? '-1';

    this.votacionService.getVotapp(id).subscribe({
      next: (obj: any) => {
        this.votapp = obj;
        this.votacionLista = true;
        if (!this.votapp.estaFinalizada()) {
          this.votacionService.getTipoDeVotos().subscribe({
            next: (obj: any) => {
              this.tipoDeVotos = obj;
              this.getOtrasOpciones();
            }
          });
        }
        return obj;
      },
      error: err => {
        //error al recuperar votapp
      }
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