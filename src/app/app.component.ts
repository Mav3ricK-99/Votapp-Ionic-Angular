import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  public language: string = '';

  constructor(private _translate: TranslateService) {
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
