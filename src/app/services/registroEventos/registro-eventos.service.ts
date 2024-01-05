import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoVoto } from 'src/app/classes/tipoVoto/tipo-voto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroEventosService {

  private REGISTRO_EVENTOS_API_URL: string = `${environment.BASE_API_URL}/eventos`;

  constructor(private httpClient: HttpClient) { }

  registroConfirmacionVoto(votacion_id: number, tipoVoto: TipoVoto, confirmado: boolean) {
    return this.httpClient.post(this.REGISTRO_EVENTOS_API_URL + `/confirmacionVoto`, {
      votacion_id: votacion_id,
      tipoVoto: tipoVoto.nombre,
      confirmado: confirmado,
    });
  };
}