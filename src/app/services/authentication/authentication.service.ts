import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from 'src/app/classes/user/user';
import { JWT } from 'src/app/interfaces/jwt/jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private AUTH_API_URL: string = `${environment.BASE_API_URL}/auth`;

  private httpClient: HttpClient = inject(HttpClient);

  constructor() { }

  authenticate(email: string, password: string) {
    return this.httpClient.post(this.AUTH_API_URL + '/login', {
      email: email,
      password: password
    });
  }

  signUpUser(newUser: User, password: string) {
    return this.httpClient.post(this.AUTH_API_URL + '/register', {
      email: newUser.email,
      nombre: newUser.name,
      apellido: newUser.surname,
      password: password,
      paisResidencia: newUser.country,
      fechaNacimiento: newUser.yearOfBirth
    });
  }

  completarDatos(newUser: User, password: string) {
    return this.httpClient.post(this.AUTH_API_URL + '/completar-datos', {
      email: newUser.email,
      nombre: newUser.name,
      apellido: newUser.surname,
      password: password,
      paisResidencia: newUser.country,
      fechaNacimiento: newUser.yearOfBirth
    });
  }

  refreshToken() {
    let jwtStr = localStorage.getItem('jwt');
    let jwt: JWT | null = null;
    if (jwtStr) {
      jwt = JSON.parse(jwtStr);
    }

    return this.httpClient.post(this.AUTH_API_URL + '/refresh-token', {}, {
      headers: {
        Authorization: "Bearer " + jwt?.refresh_token
      }
    });
  }

  solicitarTokenRecuperoContrasenia(email: string) {
    return this.httpClient.post(this.AUTH_API_URL + '/retrive-password-reset-token', {
      email: email,
    });
  }

  resetPassword(email: string, token: string, password: string) {
    return this.httpClient.post(this.AUTH_API_URL + '/reset-password', {
      email: email,
      password: password,
      token: token
    });
  }

}
