import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
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
  private USER_API_URL: string = `${environment.BASE_API_URL}/user`;

  public currentUser: User;

  constructor(private httpClient: HttpClient, private comunidadService: ComunidadService) {
    this.getLocalUser();
  }

  getMisVotos(pagina: number): Observable<any> {
    return this.httpClient.get(this.USER_API_URL + `/${this.currentUser.id}/votos/${pagina}`).pipe(map((data: any) => {
      let votaciones: Votacion[] = [];
      let comunidades: Comunidad[] = [];

      comunidades = data.comunidades.map((c: any) => {
        let comunidadIntegrantes: ComunidadIntegrantes[] = [];
        let votacionTipoComunidad: VotacionTipo = new VotacionTipo(c.votacionTipo.id, c.votacionTipo.nombre, c.votacionTipo.habilitado);
        var comunidad: Comunidad = new Comunidad(c.id, c.nombre, c.descripcion, votacionTipoComunidad, comunidadIntegrantes, new Date(c.created_at));
        this.comunidadService.getLogo(c.id).subscribe({
          next: (data: any) => { comunidad.logo = data.logo; },
          error: (error: any) => { }
        });

        return comunidad;
      });

      votaciones = data.votaciones.map((v: any) => {
        let votacionDecision: VotacionDecision = new VotacionDecision(v.votacionDecision.nombre, v.votacionDecision.habilitado);
        let votacionIntegrantes: VotacionIntegrantes[] = v.votacionIntegrantes.map((votacionIntegrante: any) => {
          let tipoVoto: TipoVoto | null = null;
          if (votacionIntegrante.tipoVoto != null) {
            tipoVoto = new TipoVoto(votacionIntegrante.tipoVoto.nombre, votacionIntegrante.tipoVoto.computaQuorum, votacionIntegrante.tipoVoto.computaResultado, votacionIntegrante.tipoVoto.computaAfirmativo, votacionIntegrante.tipoVoto.computaNegativo, votacionIntegrante.tipoVoto.habilitado);
          }
          let usuario: User = new User(0, votacionIntegrante.user.nombre, votacionIntegrante.user.apellido, votacionIntegrante.user.email, votacionIntegrante.user.country, votacionIntegrante.user.fechaNacimiento);
          return new VotacionIntegrantes(votacionIntegrante.miVoto, votacionIntegrante.porcentaje, tipoVoto, usuario);
        });
        let votacionTipo: VotacionTipo = new VotacionTipo(v.votacionTipo.id, v.votacionTipo.nombre, v.votacionTipo.habilitado);
        let votacionFrecuencia: VotacionFrecuencia | null = null;
        if (v.votacionFrecuencia) {
          votacionFrecuencia = new VotacionFrecuencia(v.votacionFrecuencia.id, v.votacionFrecuencia.nombre, v.votacionFrecuencia.dias, v.votacionFrecuencia.habilitado);
        }
        let comunidad: Comunidad = comunidades.filter((comunidad: Comunidad) => {
          return comunidad.id === v.comunidad_id ? comunidad : null;
        })[0];
        let nuevaVotacion: Votacion = new Votacion(v.id, v.aceptacionRequerida, v.detalle, v.proximaVotacion, v.quorumRequerido, v.repetir, v.requiereAceptacion, new Date(v.vencimiento), v.votacionPunto, comunidad, votacionDecision, votacionTipo, votacionFrecuencia);
        nuevaVotacion.votacionIntegrantes = votacionIntegrantes;

        return nuevaVotacion;
      })

      return votaciones;
    }));
  }

  getMisComunidades() {
    return this.httpClient.get(this.USER_API_URL + `/${this.currentUser.id}/comunidades`).pipe(map((data: any) => {
      return data.comunidades.map((comunidad: any) => {
        let votacionTipoComunidad: VotacionTipo = new VotacionTipo(comunidad.votacionTipo.id, comunidad.votacionTipo.nombre, comunidad.votacionTipo.habilitado);

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

  getMisComunidadesPorTipoVotacion(tipoVotacion: string) {
    return this.httpClient.get(this.USER_API_URL + `/${this.currentUser.id}/comunidades/${tipoVotacion}`).pipe(map((data: any) => {
      return data.comunidades.map((comunidad: any) => {
        let votacionTipoComunidad: VotacionTipo = new VotacionTipo(comunidad.votacionTipo.id, comunidad.votacionTipo.nombre, comunidad.votacionTipo.habilitado);

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

  getLocalUser() {
    let currentUserStr = localStorage.getItem('current_user');
    if (currentUserStr) {
      let currentUser = JSON.parse(currentUserStr);
      this.currentUser = new User(currentUser.id, currentUser.nombre, currentUser.apellido, currentUser.sub, currentUser.paisResidencia, currentUser.fechaNacimiento)
    } else {
      this.currentUser = new User(-1, '', '', '', '', 0);
    }
  }

  hayUsuarioIngresado() {
    this.getLocalUser();
    return this.currentUser.id > -1 ? true : false;
  }

  cerrarSesion() {
    //revokar token
    localStorage.removeItem('jwt');
    localStorage.removeItem('current_user');
  }
}
