import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {

  private COMUNIDAD_API_URL: string = `${environment.BASE_API_URL}/comunidad`;

  constructor(private httpClient: HttpClient) { }

  getLogo(id_comunidad: number) {
    return this.httpClient.get(this.COMUNIDAD_API_URL + `/${id_comunidad}/logo`);
  }
}
