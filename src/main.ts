import { LOCALE_ID, Provider, enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthorizationRequestInterceptor } from './app/interceptors/AuthorizationRequest/authorization-request.interceptor';
import { DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
if (environment.production) {
  enableProdMode();
}

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export function provideLocaleConfig(): Provider[] {
  return [
    {
      provide: LOCALE_ID,
      useValue: 'es-ES',
    },
    {
      provide: DateAdapter,
      useClass: NativeDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
  ];
}

bootstrapApplication(AppComponent, {
  providers: [
  {
    provide: RouteReuseStrategy, useClass: IonicRouteStrategy
  },
  {
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { showError: true },
  },
  provideLocaleConfig(), provideIonicAngular(), provideRouter(routes, withComponentInputBinding()),
  provideHttpClient(withInterceptorsFromDi()),
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthorizationRequestInterceptor,
    multi: true
  },
  importProvidersFrom(
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    TranslateModule,
    BrowserAnimationsModule
  ),]
});