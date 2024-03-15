import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { appConfig } from './app/app.config';

if (environment.production) {
  enableProdMode();
}

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);

platformBrowserDynamic().bootstrapModule(AppModule, appConfig)
  .catch(err => console.log(err));
