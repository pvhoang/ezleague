import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { environment } from 'environments/environment';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
} from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  // Public
  public apiData = [];
  public onApiDataChange: BehaviorSubject<any>;
  isPushNotificationsAvailable =
    Capacitor.isPluginAvailable('PushNotifications');
  /**
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    public router: Router,
    private _httpClient: HttpClient,
    private _authService: AuthService
  ) {
    this.onApiDataChange = new BehaviorSubject('');
    if (this._authService.currentUserValue) {
      this.getNotificationsData();
      if (this.isPushNotificationsAvailable) {
        PushNotifications.addListener(
          'pushNotificationReceived',
          async (notification: PushNotificationSchema) => {
            this.getNotificationsData();
          }
        );

        PushNotifications.addListener(
          'pushNotificationActionPerformed',
          async (notification: ActionPerformed) => {
            this.getNotificationsData();
            const data = notification.notification.data;
            console.log(
              'Push action performed: ' +
                JSON.stringify(notification.notification.data)
            );
            console.log('data: ', data);
            if (data.hasOwnProperty('go_url')) {
              console.log('go_url: ', data.go_url);
              setTimeout(() => {
                this.router.navigate([data.go_url]);
                setTimeout(() => {
                  window.location.reload();
                }, 200);
              }, 1000);
            }
          }
        );
      }
    }
  }

  /**
   * Get Notifications Data
   */
  getNotificationsData(): Promise<any[]> {
    let userId = this._authService.currentUserValue.id;
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(`${environment.apiUrl}/user-messages/${userId}`)
        .subscribe((response: any) => {
          this.apiData = response;
          this.onApiDataChange.next(this.apiData);
          resolve(this.apiData);
        }, reject);
    });
  }

  markAsRead(message) {
    if (message.read) {
      return;
    }
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(`${environment.apiUrl}/user-messages/mark-as-read`, {
          user_message_id: message.id,
        })
        .subscribe((response: any) => {
          this.getNotificationsData();
          resolve(response);
        }, reject);
    });
  }

  maskAllAsRead() {
    // apiUrl/user-messages/mark-all-as-read/{user_id}
    let userId = this._authService.currentUserValue.id;
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(`${environment.apiUrl}/user-messages/mark-all-as-read/${userId}`)
        .subscribe((response: any) => {
          this.getNotificationsData();
          resolve(response);
        }, reject);
    });
  }

  listen() {
    this.angularFireMessaging.messages.subscribe((payload) => {
      console.log('new message received. ', payload);
      this.getNotificationsData();
      let data = payload.data;
      if (data.hasOwnProperty('go_url')) {
        console.log('go_url: ', data.go_url);
        setTimeout(() => {
          this.router.navigate([data.go_url]);
          setTimeout(() => {
            window.location.reload();
          }, 200);
        }, 1000);
      }
    });
  }

  getAllNotifications() {
    let userId = this._authService.currentUserValue.id;
    return this._httpClient.get(
      `${environment.apiUrl}/user-messages/${userId}`,
      {
        params: {
          take: 'all',
        },
      }
    );
  }
}
