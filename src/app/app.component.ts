import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
import { ParametrosService } from './services/parametros/parametros.service';
import { UserService } from './services/user/user.service';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { Channel, PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { FCM } from "@capacitor-community/fcm";
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

    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');

    if (isPushNotificationsAvailable) {
      this.registerNotifications().then(() => {
        FCM.subscribeTo({ topic: "userLoggedIn" });
        PushNotifications.createChannel({
          id: 'userLoggedIn',
          name: 'userLoggedIn',
          description: 'eso',
          importance: 4,
          visibility: -1,
          lights: true,
          lightColor: "green",
          vibration: true,
        });
      });
      this.getDeliveredNotifications();
      this.addListeners();
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
  //Mandar todo al 'dashboard'
  addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  }

  registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }

  getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }
}
