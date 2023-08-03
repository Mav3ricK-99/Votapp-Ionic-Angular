import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Comunidad } from 'src/app/classes/comunidad/comunidad';
import { TipoVoto } from 'src/app/classes/tipoVoto/tipo-voto';
import { User } from 'src/app/classes/user/user';
import { Votacion } from 'src/app/classes/votacion/votacion';
import { VotacionDecision } from 'src/app/classes/votacionDecision/votacion-decision';
import { VotacionIntegrantes } from 'src/app/classes/votacionIntegrantes/votacion-integrantes';
import { JWT } from 'src/app/interfaces/jwt/jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private USER_API_URL: string = 'http://localhost:8080/api/user/';

  private currentUser: User;

  constructor(private httpClient: HttpClient) {
    let currentUserStr = localStorage.getItem('current_user');
    if (currentUserStr) {
      let currentUser = JSON.parse(currentUserStr);
      this.currentUser = new User(currentUser.id, currentUser.nombre, currentUser.apellido, currentUser.sub, currentUser.paisResidencia, currentUser.fechaNacimiento)
    }
  }

  getMyVotes() {
    return this.httpClient.get(this.USER_API_URL + `${this.currentUser.getId}/votes`).pipe(map((data: any) => {
      return data.votaciones.map((votacion: any) => {
        let comunidad: Comunidad = new Comunidad(votacion.comunidad.nombre, votacion.comunidad.descripcion, votacion.comunidad.comunidadLogo, new Date(votacion.comunidad.created_at));
        let votacionDecision: VotacionDecision = new VotacionDecision(votacion.votacionDecision.nombre, votacion.votacionDecision.habilitado);
        let votacionIntegrantes: VotacionIntegrantes[] = votacion.votacionIntegrantes.map((votacionIntegrante: any) => {
          let tipoVoto: TipoVoto = new TipoVoto(votacionIntegrante.tipoVoto.nombre, votacionIntegrante.tipoVoto.computaQuorum, votacionIntegrante.tipoVoto.computaResultado, votacionIntegrante.tipoVoto.computaAfirmativo, votacionIntegrante.tipoVoto.computaNegativo, votacionIntegrante.tipoVoto.habilitado);
          return new VotacionIntegrantes(votacionIntegrante.miVoto, votacionIntegrante.porcentaje, tipoVoto);
        })
        let nuevaVotacion: Votacion = new Votacion(votacion.id, votacion.aceptacionRequerida, votacion.detalle, votacion.proximaVotacion, votacion.quorumRequerido, votacion.repetir, votacion.requiereAceptacion, new Date(votacion.vencimiento), votacion.votacionPunto, comunidad, votacionDecision);
        nuevaVotacion._votacionIntegrantes = votacionIntegrantes;
        return nuevaVotacion;
      })
    }));
  }
}
