import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs';
import { User } from 'src/app/classes/user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private AUTH_API_URL: string = 'http://localhost:8080/api/v1/auth/';

  constructor(private httpClient: HttpClient) { }

  authenticate(email: string, password: string) {
    return this.httpClient.post(this.AUTH_API_URL + 'login', {
      email: email,
      password: password
    });
  }

  signUpUser(newUser: User, password: string) {
    return this.httpClient.post(this.AUTH_API_URL + 'register', {
      email: newUser.getEmail,
      nombre: newUser.getName,
      apellido: newUser.getSurname,
      password: password,
      paisResidencia: newUser.getResidenceCountry,
      fechaNacimiento: newUser.getYearOfBirth
    });
  }

  refreshToken() {
    return this.httpClient.post(this.AUTH_API_URL + 'refresh-token', {});
  }

  retrievePasswordResetToken(email: string) {
    return this.httpClient.post(this.AUTH_API_URL + 'retrive-password-reset-token', {
      email: email,
    });
  }

  resetPassword(email: string, token: string, password: string) {
    return this.httpClient.post(this.AUTH_API_URL + 'reset-password', {
      email: email,
      password: password,
      token: token
    });
  }

}
