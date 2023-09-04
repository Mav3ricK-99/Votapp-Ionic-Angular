import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
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
export class VotacionService {

  private VOTAPP_API_URL: string = 'http://localhost:8080/api/votapp/';

  constructor(private httpClient: HttpClient) { }

  newVotapp(votapp: Votacion) {
    return this.httpClient.post(this.VOTAPP_API_URL, {
      votacionPunto: votapp.votacionPunto,
      detalle: votapp.detalle,
      comunidad_id: votapp.comunidad.id,
      votacionTipo: votapp.comunidad.votacionTipo.nombre,
      votacionDecision: votapp.votacionDecision.nombre,
      votacionIntegrantes: {}, //Lo obtiene el backend (se pueden elegir prcntes?)
      votacionFrecuencia: votapp.votacionFrecuencia?.nombre ?? '',
      aceptacionRequerida: votapp.aceptacionRequerida,
      quorumRequerido: votapp.quorumRequerido,
      vencimiento: formatDate(votapp.vencimiento, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
      proximaVotacion: votapp.proximaVotacion ? formatDate(votapp.proximaVotacion, 'yyyy-MM-dd HH:mm:ss', 'en-US') : '',
    });
  }

  getVotapp(id: string) {
    return this.httpClient.get(this.VOTAPP_API_URL + `${id}`).pipe(map((data: any) => {
      let votacion = data.votacion;
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
      nuevaVotacion._votacionIntegrantes = votacionIntegrantes;
      return nuevaVotacion;

    }));
  }

  changeVote(votacion_id: number, votacionDecision: string) {
    return this.httpClient.post(this.VOTAPP_API_URL + `${votacion_id}/voto/`, {
      tipoDeVoto: votacionDecision
    });
  }

  getTipoDeVotos() {
    return this.httpClient.get<TipoVoto[]>(this.VOTAPP_API_URL + `tiposVoto/`).pipe(map((data: any) => {
      return data.tipoDeVotos.map((tipoVoto: any) => {
        return new TipoVoto(tipoVoto.nombre, tipoVoto.computaQuorum, tipoVoto.computaResultado, tipoVoto.computaAfirmativo, tipoVoto.computaNegativo, tipoVoto.habilitado);
      })
    }));
  }

  getTipoDecisiones() {
    return this.httpClient.get(this.VOTAPP_API_URL + `decisiones/`).pipe(map((data: any) => {
      return data.tipoDecisiones.map((decision: any) => {
        return new VotacionDecision(decision.nombre, decision.habilitado);
      })
    }));
  }

  getFrecuencias() {
    return this.httpClient.get(this.VOTAPP_API_URL + `frecuencias/`).pipe(map((data: any) => {
      return data.frecuenciaVotaciones.map((frecuencia: any) => {
        return new VotacionFrecuencia(frecuencia.nombre, frecuencia.dias, frecuencia.habilitado);
      })
    }));
  }
}
