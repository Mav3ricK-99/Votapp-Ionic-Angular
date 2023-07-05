import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs';

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
    }).pipe(retry(2));
  }

  refreshToken() {
    return this.httpClient.post(this.AUTH_API_URL + 'refresh-token', {});
  }

}
