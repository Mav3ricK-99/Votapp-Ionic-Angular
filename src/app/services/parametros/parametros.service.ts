import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  private PARAMETROS_API_URL: string = `${environment.BASE_API_URL}/api/parametros/`;

  constructor(private httpClient: HttpClient) { }

  getParametros() {
    return this.httpClient.get(this.PARAMETROS_API_URL);
  }
}
