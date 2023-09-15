import { Component, OnInit, Optional } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  public language: string = '';

  constructor(private _translate: TranslateService, private platform: Platform, @Optional() private routerOutlet?: IonRouterOutlet) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.routerOutlet && !this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
  }

  ngOnInit(): void {
    this.getDeviceLanguage()
  }

  public changeLanguage(): void {
    this._translateLanguage();
  }

  _translateLanguage(): void {
    this._translate.use(this.language);
  }

  _initTranslate(language: any) {
    this._translate.setDefaultLang('es');
    if (language) {
      this.language = language;
    }
    else {
      this.language = 'es';
    }
    this._translateLanguage();
  }

  getDeviceLanguage() {
    if (window.Intl && typeof window.Intl === 'object') {
      this._initTranslate(navigator.language.split('-')[0])
    }
    else {
      Device.getLanguageCode().then(res => {
        this._initTranslate(res)
      }).catch(e => { console.log(e); });
    }
  }
}
