import { Injectable, inject } from '@angular/core';
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
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthorizationRequestInterceptor implements HttpInterceptor {
  
  private authService: AuthenticationService = inject(AuthenticationService);
  private router: Router = inject(Router);
  private eventBusService: EventBusService = inject(EventBusService);
  
  private isRefreshing = false;
  private AUTH_HEADER = "Authorization";

  constructor(public dialog: MatDialog) { }

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
          switchMap((obj: any) => {
            this.isRefreshing = false;
            const helper = new JwtHelperService();
            let jwt: JWT = {
              access_token: obj.access_token,
              refresh_token: obj.refresh_token,
            }
            let currentUser = helper.decodeToken(jwt.access_token);
            localStorage.setItem('jwt', JSON.stringify(jwt));
            localStorage.setItem('current_user', JSON.stringify(currentUser));
            request = this.addAuthenticationToken(request, jwt);

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
                  mensaje: 'Por tu seguridad se cerrara la sesion, a continuacion vas a ser redirigido al ingreso.',
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
    if (!request.url.includes(environment.BASE_API_URL) || request.url.includes('refresh-token')) {
      return request;
    }

    return request = request.clone({
      headers: request.headers.set(this.AUTH_HEADER, "Bearer " + jwt.access_token)
    });
  }
}