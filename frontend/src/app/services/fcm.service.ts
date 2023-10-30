import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
} from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@angular/cdk/platform';
import { Router } from '@angular/router';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root',
})
export class FcmService {
  isPushNotificationsAvailable =
    Capacitor.isPluginAvailable('PushNotifications');
  currentMessage = new BehaviorSubject(null);
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    public router: Router,
    public platform: Platform,
    public _userService: UserService
  ) {
    this.angularFireMessaging.messages.subscribe((messaging) => {
      console.log('messaging: ', messaging);
    });
  }
  initPush() {
    // if (!this.platform.isBrowser) {
    this.registerPush();
    // }
  }

  private registerPush() {
    console.log('registerPush');

    if (this.isPushNotificationsAvailable) {
      PushNotifications.requestPermissions().then((result) => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });

      PushNotifications.addListener('registration', (token) => {
        // console.log(token);
        console.log('Push registration success, token: ' + token.value);
        //  set to storage
        localStorage.setItem('fcm_token', token.value);
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener(
        'pushNotificationReceived',
        async (notification: PushNotificationSchema) => {
          //   console.log('Push received: ' + JSON.stringify(notification));
        }
      );

      // PushNotifications.addListener(
      //   'pushNotificationActionPerformed',
      //   async (notification: ActionPerformed) => {
      //     const data = notification.notification.data;
      //     console.log(
      //       'Push action performed: ' +
      //         JSON.stringify(notification.notification.data)
      //     );
      //     console.log('data: ', data);
      //     if (data.go_url) {
      //       console.log('go_url: ', data.go_url);
      //       setTimeout(() => {
      //         this.router.navigate([data.go_url]);
      //         setTimeout(() => {
      //           window.location.reload();
      //         }, 200);
      //       }, 1000);
      //     }
      //   }
      // );
    }
  }

  requestPermission() {
    console.log('requestPermission');

    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log('token: ', token);
        if (token) localStorage.setItem('fcm_token', token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  getToken() {
    console.log('getToken');
    return localStorage.getItem('fcm_token');
  }

  listen() {
    this.angularFireMessaging.messages.subscribe((payload) => {
      console.log('new message received. ', payload);
      // if (payload.data.go_url) {
      //   this.router.navigateByUrl(payload.data.go_url);
      // }
      // this.currentMessage.next(payload);
    });
  }
}
