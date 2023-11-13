import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Comunidad } from 'src/app/classes/comunidad/comunidad';
import { ComunidadIntegrantes } from 'src/app/classes/comunidadIntegrantes/comunidad-integrantes';
import { VotacionTipo } from 'src/app/classes/votacionTipo/votacion-tipo';
import { EmailParticipacion } from 'src/app/components/comunidad/nueva-comunidad/nueva-comunidad.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {

  private COMUNIDAD_API_URL: string = `${environment.BASE_API_URL}/comunidad`;

  constructor(private httpClient: HttpClient) { }

  crearComunidad(nombre: string, detalle: string, votacionTipo: VotacionTipo, participantes: Array<EmailParticipacion>) {
    console.log(votacionTipo.id);
    return this.httpClient.post<Comunidad>(this.COMUNIDAD_API_URL + `/`, {
      nombre: nombre,
      descripcion: detalle,
      votacionTipo: votacionTipo.id,
      emailParticipacion: participantes
    }).pipe(map((data: any) => {
      let c: any = data.comunidad;
      let comunidadIntegrantes: ComunidadIntegrantes[] = [];
      let votacionTipoComunidad: VotacionTipo = new VotacionTipo(c.votacionTipo.id, c.votacionTipo.nombre, c.votacionTipo.habilitado);
      var comunidad: Comunidad = new Comunidad(c.id, c.nombre, c.descripcion, votacionTipoComunidad, comunidadIntegrantes, new Date(c.created_at));
      return comunidad;
    }));
  };

  getLogo(id_comunidad: number) {
    return this.httpClient.get(this.COMUNIDAD_API_URL + `/${id_comunidad}/logo`);
  }

  getTipoVotaciones() {
    return this.httpClient.get<VotacionTipo[]>(this.COMUNIDAD_API_URL + `/tiposVotacion`).pipe(map((data: any) => {
      return data.tiposVotaciones.map((votacionTipo: any) => {
        return new VotacionTipo(votacionTipo.id, votacionTipo.nombre, votacionTipo.habilitado);
      })
    }));
  }
}
