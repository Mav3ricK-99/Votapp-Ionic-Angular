import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule, TranslateStore } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthorizationRequestInterceptor } from './interceptors/AuthorizationRequest/authorization-request.interceptor';
import { IonicStorageModule } from '@ionic/storage-angular';
import { JwtModule } from '@auth0/angular-jwt';
import { UserService } from './services/user/user.service';
import { VotacionService } from './services/votacion/votacion.service';
import { ParametrosService } from './services/parametros/parametros.service';
import { MenuComponent } from './components/util/menu/menu/menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RegistroEventosService } from './services/registroEventos/registro-eventos.service';
import { TiposDeVotacionesComponent } from './components/tiposDeVotaciones/tipos-de-votaciones/tipos-de-votaciones.component';
import { MatRippleModule } from '@angular/material/core';
import { customAnimation } from './animations/custom.animation';
import { HomeComponent } from './components/home/home.component';
import { VotappCardComponent } from './components/votapps/votapp-card/votapp-card.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
  declarations: [AppComponent, MenuComponent, TiposDeVotacionesComponent, HomeComponent],
  imports: [
    AuthenticationModule,
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot({
      navAnimation: customAnimation
    }),
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    JwtModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatRippleModule,
    MatIconModule
  ],
  providers: [TranslateStore, AuthenticationService, UserService, VotacionService, ParametrosService, RegistroEventosService, { provide: HTTP_INTERCEPTORS, useClass: AuthorizationRequestInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
