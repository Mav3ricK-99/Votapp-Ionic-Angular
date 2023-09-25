import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
import { ParametrosService } from './services/parametros/parametros.service';
import { UserService } from './services/user/user.service';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  public language: string = '';

  constructor(private _translate: TranslateService, private parametrosService: ParametrosService, private userService: UserService, public platform: Platform) { }

  ngOnInit(): void {
    this.getDeviceLanguage();

    this.platform.ready().then(() => {
      if (this.userService.hayUsuarioIngresado()) {
        this.parametrosService.getParametros().subscribe((params: any) => {
          Preferences.set({
            key: 'parametros',
            value: JSON.stringify(params),
          });
        });
      }
    })
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
