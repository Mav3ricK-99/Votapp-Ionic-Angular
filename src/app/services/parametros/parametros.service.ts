import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  private httpClient: HttpClient = inject(HttpClient);

  private PARAMETROS_API_URL: string = `${environment.BASE_API_URL}/parametros/`;

  constructor() { }

  getParametros() {
    return this.httpClient.get(this.PARAMETROS_API_URL);
  }
}
