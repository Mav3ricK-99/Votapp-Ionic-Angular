import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Comunidad } from 'src/app/classes/comunidad/comunidad';
import { ComunidadIntegrantes } from 'src/app/classes/comunidadIntegrantes/comunidad-integrantes';
import { TipoVoto } from 'src/app/classes/tipoVoto/tipo-voto';
import { User } from 'src/app/classes/user/user';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { VotacionDecision } from 'src/app/classes/votacionDecision/votacion-decision';
import { VotacionFrecuencia } from 'src/app/classes/votacionFrecuencia/votacion-frecuencia';
import { VotacionIntegrantes } from 'src/app/classes/votacionIntegrantes/votacion-integrantes';
import { VotacionTipo } from 'src/app/classes/votacionTipo/votacion-tipo';
import { ComunidadService } from '../comunidad/comunidad.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USER_API_URL: string = `${environment.BASE_API_URL}/api/user/`;

  public currentUser: User;

  constructor(private httpClient: HttpClient, private comunidadService: ComunidadService) {
    let currentUserStr = localStorage.getItem('current_user');
    if (currentUserStr) {
      let currentUser = JSON.parse(currentUserStr);
      this.currentUser = new User(currentUser.id, currentUser.nombre, currentUser.apellido, currentUser.sub, currentUser.paisResidencia, currentUser.fechaNacimiento)
    } else {
      this.currentUser = new User(-1, '', '', '', '', 0);
    }
  }

  getMisVotos() {
    return this.httpClient.get(this.USER_API_URL + `${this.currentUser.id}/votos`).pipe(map((data: any) => {
      return data.comunidades.map((c: any) => {

        let votacionTipoComunidad: VotacionTipo = new VotacionTipo(c.votacionTipo.nombre, c.votacionTipo.habilitado);

        let comunidadIntegrantes: ComunidadIntegrantes[] = [];
        let comunidad: Comunidad = new Comunidad(c.id, c.nombre, c.descripcion, votacionTipoComunidad, comunidadIntegrantes, new Date(c.created_at));

        this.comunidadService.getLogo(c.id).subscribe({
          next: (data: any) => { comunidad.logo = data.logo },
          error: (error: any) => { }
        });

        c.votaciones.forEach((votacion: any) => {
          let votacionDecision: VotacionDecision = new VotacionDecision(votacion.votacionDecision.nombre, votacion.votacionDecision.habilitado);
          let votacionIntegrantes: VotacionIntegrantes[] = votacion.votacionIntegrantes.map((votacionIntegrante: any) => {
            let tipoVoto: TipoVoto | null = null;
            if (votacionIntegrante.tipoVoto != null) {
              tipoVoto = new TipoVoto(votacionIntegrante.tipoVoto.nombre, votacionIntegrante.tipoVoto.computaQuorum, votacionIntegrante.tipoVoto.computaResultado, votacionIntegrante.tipoVoto.computaAfirmativo, votacionIntegrante.tipoVoto.computaNegativo, votacionIntegrante.tipoVoto.habilitado);
            }
            let usuario: User = new User(0, votacionIntegrante.user.nombre, votacionIntegrante.user.apellido, votacionIntegrante.user.email, votacionIntegrante.user.country, votacionIntegrante.user.fechaNacimiento);
            return new VotacionIntegrantes(votacionIntegrante.miVoto, votacionIntegrante.porcentaje, tipoVoto, usuario);
          });
          let votacionTipo: VotacionTipo = new VotacionTipo(votacion.votacionTipo.nombre, votacion.votacionTipo.habilitado);
          let votacionFrecuencia: VotacionFrecuencia | null = null;
          if (votacion.votacionFrecuencia) {
            votacionFrecuencia = new VotacionFrecuencia(votacion.votacionFrecuencia.nombre, votacion.votacionFrecuencia.dias, votacion.votacionFrecuencia.habilitado);
          }
          let nuevaVotacion: Votacion = new Votacion(votacion.id, votacion.aceptacionRequerida, votacion.detalle, votacion.proximaVotacion, votacion.quorumRequerido, votacion.repetir, votacion.requiereAceptacion, new Date(votacion.vencimiento), votacion.votacionPunto, comunidad, votacionDecision, votacionTipo, votacionFrecuencia);
          nuevaVotacion.votacionIntegrantes = votacionIntegrantes;

          comunidad.votaciones.push(nuevaVotacion);
        });

        return comunidad;
      });
    }));
  }

  getMisComunidades() {
    return this.httpClient.get(this.USER_API_URL + `${this.currentUser.id}/comunidades`).pipe(map((data: any) => {
      return data.comunidades.map((comunidad: any) => {
        let votacionTipoComunidad: VotacionTipo = new VotacionTipo(comunidad.votacionTipo.nombre, comunidad.votacionTipo.habilitado);

        let comunidadIntegrantes: ComunidadIntegrantes[] = [];
        comunidad.comunidadIntegrantes.forEach((comunidadIntegrante: any) => {
          let nuevaComunidadIntegrante: ComunidadIntegrantes = new ComunidadIntegrantes(comunidadIntegrante.id, comunidadIntegrante.votar, comunidadIntegrante.user, comunidadIntegrante.crearVotacion, comunidadIntegrante.porcentaje, comunidadIntegrante.requiereAceptacion, comunidadIntegrante.fEnvioInvitacion, comunidadIntegrante.fDecision, comunidadIntegrante.aceptacion, comunidadIntegrante.habilitado, comunidadIntegrante.created_at);
          comunidadIntegrantes.push(nuevaComunidadIntegrante);
        });

        let nuevaComunidad: Comunidad = new Comunidad(comunidad.id, comunidad.nombre, comunidad.descripcion, votacionTipoComunidad, comunidadIntegrantes, new Date(comunidad.created_at));
        return nuevaComunidad;
      })
    }));
  }

  hayUsuarioIngresado() {
    return this.currentUser.id > -1 ? true : false;
  }
}
