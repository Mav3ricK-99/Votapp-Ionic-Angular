import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
import { ParametrosService } from './services/parametros/parametros.service';
import { UserService } from './services/user/user.service';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
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
      this.parametrosService.getParametros().subscribe((params: any) => {
        Preferences.set({
          key: 'parametros',
          value: JSON.stringify(params),
        });
      });
    });

    const pushNotificationsDisponible: boolean = Capacitor.isPluginAvailable('PushNotifications');

    if (pushNotificationsDisponible) {
      this.pedirPermisosNotificaciones();
    }
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

  async pedirPermisosNotificaciones() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive === 'granted') {
      await PushNotifications.addListener('registration', token => {
        this.userService.guardarFMCToken(token.value);
        PushNotifications.createChannel({
          id: 'nueva votacion',
          name: 'nueva votacion',
          description: 'Notificacion de aviso al crearse una nueva votacion en una comunidad.',
          vibration: true,
          importance: 4
        });
      });
    }
  }
}
