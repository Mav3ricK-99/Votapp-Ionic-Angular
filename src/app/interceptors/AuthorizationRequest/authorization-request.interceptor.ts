import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { EventBusService, EventData } from 'src/app/services/eventBus/event-bus.service';
import { JWT } from 'src/app/interfaces/jwt/jwt';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from 'src/app/components/util/info-dialog/info-dialog.component';

@Injectable()
export class AuthorizationRequestInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private AUTH_HEADER = "Authorization";

  constructor(private authService: AuthenticationService, private eventBusService: EventBusService, private router: Router, public dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });

    let jwtStr = localStorage.getItem('jwt');
    if (jwtStr) {
      let jwt: JWT = JSON.parse(jwtStr);
      req = this.addAuthenticationToken(req, jwt);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && !req.url.includes('auth/login') && error.status === 401) {
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
              this.dialog.closeAll();
              this.dialog.open(InfoDialogComponent, {
                maxWidth: '90vw', data: {
                  titulo: 'Se cerrara la sesion',
                  mensaje: 'Por tu seguridad se cerrara la sesion, a continuacion vas a ser redirijido al ingreso.',
                }
              }).afterClosed().subscribe(() => {
                localStorage.removeItem('jwt');
                localStorage.removeItem('current_user');
                this.router.navigateByUrl('auth/login');
              });
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(request);
  }

  private addAuthenticationToken(request: HttpRequest<any>, jwt: JWT): HttpRequest<any> {
    if (!request.url.includes(environment.BASE_API_URL)) {
      return request;
    }

    return request = request.clone({
      headers: request.headers.set(this.AUTH_HEADER, "Bearer " + jwt.refresh_token)
    });
  }
}