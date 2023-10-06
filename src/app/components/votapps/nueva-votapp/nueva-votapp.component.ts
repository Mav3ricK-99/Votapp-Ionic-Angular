import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Comunidad } from 'src/app/classes/comunidad/comunidad';
import { User } from 'src/app/classes/user/user';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { VotacionDecision } from 'src/app/classes/votacionDecision/votacion-decision';
import { VotacionFrecuencia } from 'src/app/classes/votacionFrecuencia/votacion-frecuencia';
import { UserService } from 'src/app/services/user/user.service';
import { VotacionService } from 'src/app/services/votacion/votacion.service';

@Component({
  selector: 'app-nueva-votapp',
  templateUrl: './nueva-votapp.component.html',
  styleUrls: ['./nueva-votapp.component.scss'],
})
export class NuevaVotappComponent {

  comunidadForm: FormGroup;
  puntoAVotarForm: FormGroup;
  duracionForm: FormGroup;

  public colorPrimerContinuar: string;
  public colorSegundoContinuar: string;
  public colorCrearVotacion: string;

  public comunidades$: Observable<any>;
  public comunidadesFiltradas$: Observable<any>;
  public tipoDecisiones$: Observable<any>;
  public frecuenciasVotacion$: Observable<any>;

  public crearVotacionDeshabilitado: boolean;

  public horas: Array<string> = [];
  public minutos: Array<string> = [];

  public fechaHoy: Date;

  constructor(formBuilder: FormBuilder, private userService: UserService, private votacionService: VotacionService, public dialog: MatDialog, public router: Router) {
    for (let i = 0; i < 60; i++) {
      if (i < 24) {
        this.horas.push(i.toString().padStart(2, '0'));
      }
      this.minutos.push(i.toString().padStart(2, '0'));
    }
    this.fechaHoy = new Date();
    this.comunidades$ = this.userService.getMisComunidades();
    this.comunidadesFiltradas$ = this.comunidades$;
    this.tipoDecisiones$ = this.votacionService.getTipoDecisiones();
    this.frecuenciasVotacion$ = this.votacionService.getFrecuencias();

    this.colorPrimerContinuar = 'white-g';
    this.colorSegundoContinuar = 'white-g';
    this.colorCrearVotacion = 'white-g';

    this.crearVotacionDeshabilitado = false;

    this.comunidadForm = formBuilder.group({
      buscarComunidad: new FormControl<string>(''),
      comunidad: new FormControl<Comunidad | null>(null, { validators: [Validators.required] }),
    });

    this.puntoAVotarForm = formBuilder.group({
      tipoDecision: new FormControl<VotacionDecision | null>(null, { validators: [Validators.required], updateOn: 'blur' }),
      titulo: new FormControl('', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(255)], updateOn: 'blur' }),
      detalle: new FormControl('', { validators: [Validators.minLength(3), Validators.maxLength(255)] }),
      aceptacionRequerida: new FormControl('50', { validators: [Validators.required, Validators.min(0), Validators.max(100)], updateOn: 'blur' }),
      quorumRequerido: new FormControl('50', { validators: [Validators.required, Validators.min(0), Validators.max(100)], updateOn: 'blur' }),
    });

    this.duracionForm = formBuilder.group({
      fechaVencimiento: new FormControl<Date | null>(null, { validators: [Validators.required], updateOn: 'blur' }),
      frecuenciaVotacion: new FormControl<VotacionFrecuencia | null>(null, { updateOn: 'blur' }),
      nuevaVotacion: new FormControl<Date | null>(null, { updateOn: 'blur' }),
      horaVencimiento: new FormControl('', { validators: [Validators.required, Validators.min(0), Validators.max(24)], updateOn: 'blur' }),
      minutoVencimiento: new FormControl('', { validators: [Validators.required, Validators.min(0), Validators.max(59)], updateOn: 'blur' }),
    }, { validators: [this.validarFechas()] });

    //Relleno botones si el form esta validado!
    this.comunidadForm.statusChanges.subscribe((valid: string) => {
      valid == 'VALID' ? this.colorPrimerContinuar = 'green' : this.colorPrimerContinuar = 'white-g';;
    });

    this.puntoAVotarForm.statusChanges.subscribe((valid: string) => {
      valid == 'VALID' ? this.colorSegundoContinuar = 'green' : this.colorSegundoContinuar = 'white-g';
    });

    this.duracionForm.statusChanges.subscribe((valid: string) => {
      valid == 'VALID' ? this.colorCrearVotacion = 'green' : this.colorCrearVotacion = 'white-g';
    });

    this.duracionForm.get('horaVencimiento')?.setValue(this.fechaHoy.getHours());
    this.duracionForm.get('minutoVencimiento')?.setValue(this.fechaHoy.getMinutes());

    this.duracionForm.get('frecuenciaVotacion')?.valueChanges.subscribe((idFrecuencia: any) => {
      let fechaNuevaVotacion = new Date();
      switch (idFrecuencia) {
        case 1: { fechaNuevaVotacion.setDate(fechaNuevaVotacion.getDate() + 7); }; break;
        case 2: { fechaNuevaVotacion.setMonth(fechaNuevaVotacion.getMonth() + 1); }; break;
        case 3: { fechaNuevaVotacion.setFullYear(fechaNuevaVotacion.getFullYear() + 1); }; break;
      };

      if (idFrecuencia == 4) {
        this.duracionForm.get('nuevaVotacion')?.setValue('');
        this.duracionForm.get('nuevaVotacion')?.disable();
      } else {
        this.duracionForm.get('nuevaVotacion')?.enable();
        this.duracionForm.get('nuevaVotacion')?.setValue(fechaNuevaVotacion);
      }
    });

    this.frecuenciasVotacion$.subscribe({
      next: (obj: any) => {
        let porUnicaVez = obj.filter((frecuencia: any) => {
          return frecuencia.id == 4 ? frecuencia : null;
        });
        this.duracionForm.get('frecuenciaVotacion')?.setValue(porUnicaVez[0].id);
      }
    });

    this.comunidadForm.get('buscarComunidad')?.valueChanges.subscribe(comunidad => {
      if (comunidad != '') {
        this.comunidadesFiltradas$ = this.comunidades$.pipe(
          map((data: any) => {
            return data.filter((c: any) => {
              if (c.nombre.toLowerCase().includes(comunidad.toLowerCase())) {
                return c;
              }
            })
          })
        )
      } else {
        this.comunidadesFiltradas$ = this.comunidades$;
      }
    });
  }

  elejirComunidad(comunidad: Comunidad) {
    let usuarioIngresado: User = this.userService.currentUser;
    if (!comunidad.usuarioPuedeCrearVotacion(usuarioIngresado)) {
      this.dialog.open(NuevaVotappNoPuedeCrearVotacionDialog);
    } else {
      this.comunidadForm.get('comunidad')?.setValue(comunidad);
    }
  }

  /**
   * Valida las fechas del formulario 'duracionForm'
   *  > La fecha de nueva Votacion debe ser posterior a la del vencimiento
   *  > La fecha del vencimiento debe ser posterior al dia de hoy
   * @returns ValidatorFn
   */
  validarFechas(): ValidatorFn {
    return (duracionForm: AbstractControl): ValidationErrors | null => {
      let fechaVencimiento = duracionForm.get('fechaVencimiento');
      let fechaNuevaVotacion = duracionForm.get('nuevaVotacion');
      let errores: any = {};
      if (fechaVencimiento?.value) {
        if (fechaVencimiento.value < this.fechaHoy) {
          this.duracionForm.get('fechaVencimiento')?.setErrors({
            invalidFechaVencimiento: true,
          });
          errores.invalidFechaVencimiento = true;
        }

        if (fechaNuevaVotacion?.value && (fechaNuevaVotacion.value < fechaVencimiento.value)) {
          this.duracionForm.get('nuevaVotacion')?.setErrors({
            invalidNuevaFecha: true,
          });
          errores.invalidFechaVencimiento = true;
        }
      }

      return errores;
    }
  }

  crearNuevaVotacion() {
    if (!this.comunidadForm.valid || !this.duracionForm.valid || !this.puntoAVotarForm.valid) return;

    this.dialog.open(CreandoVotappDialog, { maxWidth: '90vw' });

    let comunidad: Comunidad = this.comunidadForm.get('comunidad')?.value;

    let tipoDecision: VotacionDecision = new VotacionDecision(this.puntoAVotarForm.get('tipoDecision')?.value, true);
    let titulo = this.puntoAVotarForm.get('titulo')?.value;
    let detalle = this.puntoAVotarForm.get('detalle')?.value;
    let aceptacionRequerida = this.puntoAVotarForm.get('aceptacionRequerida')?.value;
    let quorumRequerido = this.puntoAVotarForm.get('quorumRequerido')?.value;

    let horaVencimiento: string = this.duracionForm.get('horaVencimiento')?.value;
    let minutoVencimiento: string = this.duracionForm.get('minutoVencimiento')?.value;
    let fechaVencimiento: Date = this.duracionForm.get('fechaVencimiento')?.value;
    fechaVencimiento.setHours(parseInt(horaVencimiento));
    fechaVencimiento.setMinutes(parseInt(minutoVencimiento));
    console.log(fechaVencimiento);
    let frecuenciaVotacion: VotacionFrecuencia | null = null;
    let frecuenciaControl = this.duracionForm.get('frecuenciaVotacion');
    if (frecuenciaControl?.value != null) {
      frecuenciaVotacion = new VotacionFrecuencia(0, frecuenciaControl.value, 7, true);
    }
    let nuevaVotacion = this.duracionForm.get('nuevaVotacion')?.value;

    let repetir: boolean = nuevaVotacion != null ? true : false;
    let requiereAceptacion: boolean = aceptacionRequerida > 0 ? true : false;

    let nuevaVotapp: Votacion = new Votacion(0, aceptacionRequerida, detalle, nuevaVotacion, quorumRequerido, repetir, requiereAceptacion, fechaVencimiento, titulo, comunidad, tipoDecision, comunidad.votacionTipo, frecuenciaVotacion);

    this.crearVotacionDeshabilitado = true;
    this.votacionService.newVotapp(nuevaVotapp).subscribe({
      next: (obj: any) => {
        this.dialog.closeAll();
        this.dialog.open(NuevaVotappConfirmarDialog, { maxWidth: '90vw' }).afterClosed().subscribe(() => {
          this.router.navigate([`/mis-votapps`], {
            state: { refresh: true },
          });
        });
      },
      error: err => {
        this.dialog.closeAll();
        console.log(err);
      }, complete: () => {
        this.crearVotacionDeshabilitado = false;
      }
    });
  }

  continuarPrimerPaso() {
    this.comunidadForm.markAllAsTouched();
  }

  continuarSegundoPaso() {
    this.puntoAVotarForm.markAllAsTouched();
  }
}

@Component({
  selector: 'creando-votapp-dialog-component',
  templateUrl: './creando-votapp-dialog.component.html',
  styleUrls: ['./creando-votapp-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressBarModule],
})
export class CreandoVotappDialog {

  constructor(public dialogRef: MatDialogRef<NuevaVotappConfirmarDialog>) { }

}

@Component({
  selector: 'app-nueva-votapp-confirmar-dialog-component',
  templateUrl: './nueva-votapp-confirmar-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressBarModule],
})
export class NuevaVotappConfirmarDialog {

  constructor(public dialogRef: MatDialogRef<NuevaVotappConfirmarDialog>) { }

}

@Component({
  selector: 'app-nueva-votapp-no-puede-crear-votacion-dialog-component',
  templateUrl: './nueva-votapp-no-puede-crear-votacion-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class NuevaVotappNoPuedeCrearVotacionDialog {

  constructor(public dialogRef: MatDialogRef<NuevaVotappNoPuedeCrearVotacionDialog>) { }

}