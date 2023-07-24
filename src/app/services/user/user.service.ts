import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private USER_API_URL: string = 'http://localhost:8080/api/user/';

  constructor(private httpClient: HttpClient) { }

  getMyVotes() {
    return this.httpClient.get(this.USER_API_URL + 'my-votes').pipe(map((data: any) => {
      return data.votaciones
    }));
  }
}
