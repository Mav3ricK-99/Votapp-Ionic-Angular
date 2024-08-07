import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VotacionTipo } from 'src/app/classes/votacionTipo/votacion-tipo';
import { ComunidadService } from 'src/app/services/comunidad/comunidad.service';
import { UserService } from 'src/app/services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { InfoDialogComponent } from '../../util/info-dialog/info-dialog.component';
import { ProcesandoDialogComponent } from '../../util/procesando-dialog/procesando-dialog.component';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Device, DeviceInfo } from '@capacitor/device';
import { IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonMenuButton, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MatIconModule } from '@angular/material/icon';
import { BotonesInicioComponent } from '../../util/botones-inicio/botones-inicio.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DetalleIntegranteComponent } from '../detalle-integrante/detalle-integrante.component';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-nueva-comunidad',
  templateUrl: './nueva-comunidad.component.html',
  styleUrls: ['./nueva-comunidad.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonContent, IonRow, IonCol, IonGrid, IonTitle, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatIconModule, BotonesInicioComponent, MatStepperModule, MatInputModule, DetalleIntegranteComponent, MatButtonModule, NgClass]
})
export class NuevaComunidadComponent {

  private userService: UserService = inject(UserService);
  private dialog: MatDialog = inject(MatDialog);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  private comunidadService: ComunidadService = inject(ComunidadService);

  public comunidadForm: FormGroup;
  public participantesForm: FormGroup;

  public colorPrimerContinuar: string;
  public colorCrearComunidad: string;

  public votacionesTipo: VotacionTipo[];

  public agregandoParticipante: boolean = true;
  public editandoParticipante: EmailParticipacion | null;

  public crearComunidadDeshabilitado: boolean;

  public participantes: EmailParticipacion[] = [];

  public votacionTipo: string;
  public votacionesTipoListas: boolean;

  constructor() {

    this.colorPrimerContinuar = 'white-g';
    this.colorCrearComunidad = 'green';
    this.crearComunidadDeshabilitado = true;
    this.votacionesTipoListas = false;

    const navigation = this.router.getCurrentNavigation();
    const queryParams = navigation?.finalUrl?.queryParams as { votacionTipo: string };
    this.votacionTipo = queryParams.votacionTipo;

    this.comunidadForm = this.formBuilder.group({
      nombre: new FormControl<string>('', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(40)], updateOn: 'blur' }),
      detalle: new FormControl<string | null>(null, { validators: [Validators.minLength(3), Validators.maxLength(255)] }),
      logoBase64: new FormControl<string | null>(null, {}),
      tipoVotacion: new FormControl<VotacionTipo | null>(null, { validators: [Validators.required] }),
    });

    this.participantesForm = this.formBuilder.group({
      email: new FormControl<string>(this.userService.currentUser.email, { validators: [Validators.required, Validators.email], updateOn: 'change' }),
      participacion: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0), Validators.max(100)], updateOn: 'blur' }),
      crearVotacion: new FormControl<boolean>(true, { validators: [Validators.required], updateOn: 'change' }),
    }, { validators: [this.validarParticipacion(), this.validarSiYaParticipa()] });

    if (this.votacionTipo == 'persona') {
      this.participantesForm.get('participacion')?.disable();
    } else {
      this.participantesForm.get('participacion')?.enable();
    }

    this.comunidadForm.statusChanges.subscribe((valid: string) => {
      valid == 'VALID' ? this.colorPrimerContinuar = 'green' : this.colorPrimerContinuar = 'white-g';
    });

    this.comunidadService.getTipoVotaciones().subscribe((votacionesTipo: VotacionTipo[]) => {
      this.votacionesTipo = votacionesTipo;
      this.votacionesTipoListas = true;
      votacionesTipo.forEach((votacionTipo: VotacionTipo) => {
        if (votacionTipo.nombre == this.votacionTipo) {
          this.comunidadForm.get('tipoVotacion')?.setValue(votacionTipo);
        }
      });
    });
  }

  public agregarIntegrante(formDirective: FormGroupDirective) {
    if (this.comunidadForm.get('tipoVotacion')?.value.nombre == 'porcentaje') {
      this.participantesForm.markAllAsTouched();
    } else {
      this.participantesForm.get('email')?.markAllAsTouched();
    }

    if (!this.participantesForm.valid) return;
    let email: string = this.participantesForm.get('email')?.value;
    let participacion = this.participantesForm.get('participacion')?.value;
    let crearVotacion = this.participantesForm.get('crearVotacion')?.value;

    email = email.toLocaleLowerCase();
    this.participantes.push({
      email: email,
      participacion: participacion,
      crearVotacion: crearVotacion,
    });
    this.crearComunidadDeshabilitado = false;

    let votacionTipoComunidad = this.comunidadForm.get('tipoVotacion')?.value;
    if (votacionTipoComunidad instanceof VotacionTipo && votacionTipoComunidad.nombre == 'persona') {
      this.participantes = this.participantes.map((participante: EmailParticipacion) => {
        participante.participacion = Math.floor(100 / this.participantes.length);
        return participante;
      });
    }

    this.participantesForm.reset();
    formDirective.resetForm();
    this.participantesForm.get('crearVotacion')?.setValue(true);

    this._snackBar.open('Participante agregado', 'OK!', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: ['mat-toolbar', 'mat-primary']
    });
  }

  public editarIntegrante(formDirective: FormGroupDirective) {
    if (!this.participantesForm.valid) return;
    let email = this.participantesForm.get('email')?.value;
    let participacion = this.participantesForm.get('participacion')?.value;
    let crearVotacion = this.participantesForm.get('crearVotacion')?.value;

    this.participantes = this.participantes.map((participante: EmailParticipacion) => {
      return participante.email != this.editandoParticipante?.email ? participante : {
        email: email,
        participacion: participacion,
        crearVotacion: crearVotacion
      };
    });

    this.participantesForm.reset();
    formDirective.resetForm();
    this.participantesForm.get('crearVotacion')?.setValue(true);
    this.agregandoParticipante = true;
    this.editandoParticipante = null;

    this._snackBar.open('Participante editado', 'OK!', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000
    });
  }

  public mostrarIntegrante(participante: EmailParticipacion) {
    this.agregandoParticipante = false;
    this.editandoParticipante = participante;
    this.participantesForm.get('email')?.setValue(participante.email);
    this.participantesForm.get('participacion')?.setValue(participante.participacion);
    this.participantesForm.get('crearVotacion')?.setValue(participante.crearVotacion);
  }

  public eliminarIntegrante(participanteEliminado: EmailParticipacion) {

    let votacionTipoComunidad = this.comunidadForm.get('tipoVotacion')?.value;
    this.participantes = this.participantes.filter((participante: EmailParticipacion) => {
      if (votacionTipoComunidad instanceof VotacionTipo && votacionTipoComunidad.nombre == 'persona') {
        this.participantes = this.participantes.map((participante: EmailParticipacion) => {
          participante.participacion = Math.floor(100 / (this.participantes.length - 1));
          return participante;
        });
      }
      return participante.email != participanteEliminado.email ? participante : null;
    });

    if (!this.participantes.length) {
      this.crearComunidadDeshabilitado = true;
    }

    this.agregandoParticipante = true;
  }

  public continuarPrimerPaso() {
    this.comunidadForm.markAllAsTouched();

    let votacionTipo: VotacionTipo = this.comunidadForm.get('tipoVotacion')?.value;
    if (votacionTipo.nombre.includes('persona') && !this.participantes.length) {
      this.participantes.push({
        email: this.userService.currentUser.email,
        participacion: 100,
        crearVotacion: true,
      });
      this.crearComunidadDeshabilitado = false;
      this.participantesForm.get('email')?.setValue('');
    }
  }

  public crearNuevaComunidad() {
    this.participantesForm.get('email')?.setErrors(null);
    this.participantesForm.get('participacion')?.setErrors(null);
    if (!this.comunidadForm.valid || !this.participantes.length) return;

    this.crearComunidadDeshabilitado = true;
    let participacionTotal = 0;
    this.participantes.forEach((participante: EmailParticipacion) => {
      participacionTotal += participante.participacion;
    });
    if (participacionTotal != 100) {
      this.crearComunidadDeshabilitado = false;
      this.participantesForm.enable();
      this.participantesForm.markAsPristine();
      this.participantesForm.markAsUntouched();
      this.participantesForm.get('participacion')?.setErrors({
        participacionInvalida: true,
      });
      return;
    }

    this.dialog.open(ProcesandoDialogComponent, {
      maxWidth: '90vw', data: {
        titulo: 'Creando nueva comunidad',
        mensaje: 'Enviando notificaciones a los participantes...',
      }
    })

    let nombre: string = this.comunidadForm.get('nombre')?.value;
    let detalle: string = this.comunidadForm.get('detalle')?.value;
    let logoBase64: string = this.comunidadForm.get('logoBase64')?.value;
    let tipoVotacion: VotacionTipo = this.comunidadForm.get('tipoVotacion')?.value;

    this.comunidadService.crearComunidad(nombre, detalle, logoBase64, tipoVotacion, this.participantes).subscribe({
      next: (obj: any) => {

        this.dialog.closeAll();
        this.dialog.open(InfoDialogComponent, {
          maxWidth: '90vw', data: {
            titulo: 'Nueva comunidad creada',
            mensaje: 'Se ha registrado la nueva comunidad, las invitaciones ya fueron enviadas.',
          }
        }).afterClosed().subscribe(() => {
          this.router.navigate([`/dashboard/nueva-votapp`], {
            queryParams: { votacionTipo: this.votacionTipo },
            state: { refresh: true },
          });
        });
      },
      error: err => {
        this.dialog.closeAll();
        this.participantesForm.enable();
        this.crearComunidadDeshabilitado = false;
        console.log(err);
      }, complete: () => {
        this.participantesForm.enable();
        this.crearComunidadDeshabilitado = false;
      }
    });
  }

  public seleccionarLogoComunidad() {

    let web: boolean = false;
    const maxFileSize = 5 * 1000 * 1000;

    Device.getInfo().then((deviceInfo: DeviceInfo) => {
      web = deviceInfo.platform.toLocaleLowerCase() == 'web' ? true : false;

      Camera.getPhoto({ resultType: CameraResultType.Base64, webUseInput: web }).then((logo: any) => {

        var photoSize = (4 * Math.ceil((logo.base64String.length / 3)) * 0.5624896334383812);

        if (photoSize > maxFileSize) {
          this.comunidadForm.get('logoBase64')?.setErrors({
            maxFileSizeExceeded: true,
          });
        } else {
          this.comunidadForm.get('logoBase64')?.reset();
          this.comunidadForm.get('logoBase64')?.setValue(logo.base64String);
        }
      });
    });

  }

  private validarParticipacion(): ValidatorFn {
    return (participantesForm: AbstractControl): ValidationErrors | null => {
      if (this.participantes.length != 0) {
        let participacion = <number>participantesForm.get('participacion')?.value;
        let email = participantesForm.get('email')?.value;
        let participacionTotal = 0;
        this.participantes.forEach((participante: EmailParticipacion) => {
          if (this.agregandoParticipante && this.editandoParticipante?.email !== email) {
            participacionTotal += participante.participacion;
          }
        });

        if ((participacionTotal + participacion) > 100) {
          participantesForm.get('participacion')?.setErrors({
            participacionExcedida: true,
          });
        }
      }
      return null;
    }
  }

  private validarSiYaParticipa(): ValidatorFn {
    return (participantesForm: AbstractControl): ValidationErrors | null => {
      if (this.participantes.length != 0) {
        let email = participantesForm.get('email')?.value;
        let yaExisteParticipante = this.participantes.filter((participante: EmailParticipacion) => {
          if (participante.email.toLocaleLowerCase() == email?.toLocaleLowerCase()) {
            if (!this.agregandoParticipante && this.editandoParticipante?.email == email) {
              return null;
            }
            return participante;
          } else {
            return null
          }
        }).length;

        if (yaExisteParticipante) {
          participantesForm.get('email')?.setErrors({
            yaSeEncuentraIngresado: true,
          });
        }
      }
      return null;
    }
  }

}

export interface EmailParticipacion {
  email: string,
  participacion: number,
  crearVotacion: boolean
}
