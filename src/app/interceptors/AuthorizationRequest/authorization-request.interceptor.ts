import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
  HttpHeaders
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { EventBusService, EventData } from 'src/app/services/eventBus/event-bus.service';

@Injectable()
export class AuthorizationRequestInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private AUTH_HEADER = "Authorization";
  private token = "secrettoken";

  constructor(
    /* private storageService: StorageSer, */
    private authService: AuthenticationService,
    private eventBusService: EventBusService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });

    if (req.url.includes("localhost:8080")) {
      let headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token')
        .set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
        .set('Access-Control-Allow-Origin', 'http://localhost:8100');
      req = req.clone({
        headers: headers
      });
      req = this.addAuthenticationToken(req);
    }
    //console.log(req.headers);

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && !req.url.includes('auth/signin') && error.status === 401
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

      if (false) /*this.storageService.isLoggedIn() */ {
        /* return this.authService.refreshToken("fefe").pipe(
          switchMap(() => {
            this.isRefreshing = false;

            return next.handle(request);
          }),
          catchError((error) => {
            this.isRefreshing = false;

            if (error.status == '403') {
              this.eventBusService.emit(new EventData('logout', null));
            }

            return throwError(() => error);
          })
        ); */
      }
    }

    return next.handle(request);
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.
    this.token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmZWRlcmljb185OUBsaXZlLmNvbS5hciIsImV4cCI6MTY4ODU5NDczNywiaWF0IjoxNjg4NTA4MzM3fQ.LUV24HOZqVKEDYupDhVeNpTlQg66XTtpX9H5bmEFmBCEkXa2RDRHG-o_jncg7v_2VHpaAcuo9FXajt7hhyCt9Q';
    if (!this.token) {
      return request;
    }
    // If you are calling an outside domain then do not add the token.
    if (!request.url.includes("localhost:8080")) {
      return request;
    }
    return request.clone({
      headers: request.headers.set(this.AUTH_HEADER, "Bearer " + this.token)
    });
  }
}