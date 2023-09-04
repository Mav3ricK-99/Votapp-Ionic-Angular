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

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private USER_API_URL: string = 'http://localhost:8080/api/user/';

  public currentUser: User;

  constructor(private httpClient: HttpClient) {
    let currentUserStr = localStorage.getItem('current_user');
    if (currentUserStr) {
      let currentUser = JSON.parse(currentUserStr);
      this.currentUser = new User(currentUser.id, currentUser.nombre, currentUser.apellido, currentUser.sub, currentUser.paisResidencia, currentUser.fechaNacimiento)
    } else {
      this.currentUser = new User(0, '', '', '', '', 0);
    }
  }

  getMyVotes() {
    return this.httpClient.get(this.USER_API_URL + `${this.currentUser.id}/votes`).pipe(map((data: any) => {
      return data.votaciones.map((votacion: any) => {
        let votacionTipoComunidad: VotacionTipo = new VotacionTipo(votacion.comunidad.votacionTipo.nombre, votacion.comunidad.votacionTipo.habilitado);
        let comunidadIntegrantes: ComunidadIntegrantes[] = [];
        votacion.comunidad.comunidadIntegrantes.forEach((comunidadIntegrante: any) => {
          let nuevaComunidadIntegrante: ComunidadIntegrantes = new ComunidadIntegrantes(comunidadIntegrante.id, comunidadIntegrante.votar, comunidadIntegrante.user, comunidadIntegrante.crearVotacion, comunidadIntegrante.porcentaje, comunidadIntegrante.requiereAceptacion, comunidadIntegrante.fEnvioInvitacion, comunidadIntegrante.fDecision, comunidadIntegrante.aceptacion, comunidadIntegrante.habilitado, comunidadIntegrante.created_at);
          comunidadIntegrantes.push(nuevaComunidadIntegrante);
        });
        let comunidad: Comunidad = new Comunidad(votacion.comunidad.id, votacion.comunidad.nombre, votacion.comunidad.descripcion, votacion.comunidad.comunidadLogo, votacionTipoComunidad, comunidadIntegrantes, new Date(votacion.comunidad.created_at));
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
        return nuevaVotacion;
      })
    }));
  }

  getMyComunities() {
    return this.httpClient.get(this.USER_API_URL + `${this.currentUser.id}/comunities`).pipe(map((data: any) => {
      return data.comunidades.map((comunidad: any) => {
        let votacionTipoComunidad: VotacionTipo = new VotacionTipo(comunidad.votacionTipo.nombre, comunidad.votacionTipo.habilitado);

        let comunidadIntegrantes: ComunidadIntegrantes[] = [];
        comunidad.comunidadIntegrantes.forEach((comunidadIntegrante: any) => {
          let nuevaComunidadIntegrante: ComunidadIntegrantes = new ComunidadIntegrantes(comunidadIntegrante.id, comunidadIntegrante.votar, comunidadIntegrante.user, comunidadIntegrante.crearVotacion, comunidadIntegrante.porcentaje, comunidadIntegrante.requiereAceptacion, comunidadIntegrante.fEnvioInvitacion, comunidadIntegrante.fDecision, comunidadIntegrante.aceptacion, comunidadIntegrante.habilitado, comunidadIntegrante.created_at);
          comunidadIntegrantes.push(nuevaComunidadIntegrante);
        });

        let nuevaComunidad: Comunidad = new Comunidad(comunidad.id, comunidad.nombre, comunidad.descripcion, comunidad.comunidadLogo, votacionTipoComunidad, comunidadIntegrantes, new Date(comunidad.created_at));
        return nuevaComunidad;
      })
    }));
  }
}
