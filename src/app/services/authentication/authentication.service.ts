import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private AUTH_API_URL: string = 'http://localhost:8080/api/v1/auth/';

  private headers: HttpHeaders

  constructor(private httpClient: HttpClient) {
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
      .set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
      .set('Access-Control-Allow-Origin', 'http://localhost:8080');
  }

  authenticate(email: string, password: string) {

    return this.httpClient.post(this.AUTH_API_URL + 'login', {
      email: email,
      password: password
    }).pipe(retry(2));
  }

}
