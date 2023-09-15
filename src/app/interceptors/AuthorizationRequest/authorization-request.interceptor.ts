import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { EventBusService, EventData } from 'src/app/services/eventBus/event-bus.service';
import { JWT } from 'src/app/interfaces/jwt/jwt';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthorizationRequestInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private AUTH_HEADER = "Authorization";

  constructor(private authService: AuthenticationService, private eventBusService: EventBusService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });

    if (req.url.includes(environment.BASE_API_URL)) {
      let headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
        .set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
        .set('Access-Control-Allow-Origin', '*');
      req = req.clone({
        headers: headers
      });
    }
    /* this.storageService.clearAll(); */


    let jwtStr = localStorage.getItem('jwt');
    if (jwtStr) {
      let jwt: JWT = JSON.parse(jwtStr);
      req = this.addAuthenticationToken(req, jwt);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && !req.url.includes('auth/login') && error.status === 401
        ) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      }),
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      //Aca tambien se manda el authorization bearer
      if (localStorage.getItem('jwt')) {
        return this.authService.refreshToken().pipe(
          switchMap(() => {
            this.isRefreshing = false;

            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;
            //Error al refreshear token
            if (error.status == '403') {
              this.eventBusService.emit(new EventData('logout', null));
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }

  private addAuthenticationToken(request: HttpRequest<any>, jwt: JWT): HttpRequest<any> {
    // If you are calling an outside domain then do not add the token.
    if (!request.url.includes(environment.BASE_API_URL)) {
      return request;
    }

    return request = request.clone({
      headers: request.headers.set(this.AUTH_HEADER, "Bearer " + jwt.refresh_token)
    });
  }
}