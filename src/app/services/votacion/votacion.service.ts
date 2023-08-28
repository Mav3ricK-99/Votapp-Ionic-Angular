import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { map } from 'rxjs';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { VotacionDecision } from 'src/app/classes/votacionDecision/votacion-decision';
import { VotacionFrecuencia } from 'src/app/classes/votacionFrecuencia/votacion-frecuencia';

@Injectable({
  providedIn: 'root'
})
export class VotacionService {

  private VOTAPP_API_URL: string = 'http://localhost:8080/api/votapp/';

  constructor(private httpClient: HttpClient) {
    Device.getInfo().then((res: any) => {
      console.log(res.platform)
      if (res.platform == 'android') {
        this.VOTAPP_API_URL = 'http://10.0.2.2:8080/api/votapp/';
      }
    }).catch(e => { console.log(e); });
  }

  newVotapp(votapp: Votacion) {
    return this.httpClient.post(this.VOTAPP_API_URL, {
      votacionPunto: votapp.votacionPunto,
      detalle: votapp.detalle,
      comunidad_id: votapp.comunidad.id,
      votacionTipo: votapp.comunidad.votacionTipo.nombre,
      votacionDecision: votapp.votacionDecision.nombre,
      votacionIntegrantes: { }, //Lo obtiene el backend (se pueden elegir prcntes?)
      votacionFrecuencia: votapp.votacionFrecuencia?.nombre ?? '',
      aceptacionRequerida: votapp.aceptacionRequerida,
      quorumRequerido: votapp.quorumRequerido,
      vencimiento: formatDate(votapp.vencimiento, 'yyyy-MM-dd HH:mm:ss', 'en-US'),
      proximaVotacion: votapp.proximaVotacion ? formatDate(votapp.proximaVotacion, 'yyyy-MM-dd HH:mm:ss', 'en-US') : '',
    });
  }

  changeVote(votacion_id: number, votacionDecision: string) {
    return this.httpClient.post(this.VOTAPP_API_URL + `${votacion_id}/voto/`, {
      tipoDeVoto: votacionDecision
    });
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
