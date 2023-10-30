import { Injectable } from '@angular/core';
import {
  RTCPublisher,
  RTCSubscriber,
  PublisherEventTypes,
  SubscriberEventTypes,
} from 'red5pro-webrtc-sdk';
import { LoadingService } from './loading.service';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { StageService } from './stage.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
export interface Red5StreamConfig {
  protocol?: string;
  port?: number;
  host?: string;
  app?: string;
  streamName?: string;
  streamMode?: string;
  mediaElementId?: string;
  bandwidth?: {
    audio?: number;
    video?: number;
  };
  playsinline?: boolean;
  rtcConfiguration?: RTCConfiguration;
  mediaConstraints?: MediaStreamConstraints;
  subscriptionId?: string;
  maintainConnectionOnSubscribeErrors?: boolean;
  muteOnAutoplayRestriction?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class Red5Service {
  protocol = environment.red5.protocol == 'ws' ? 'http' : 'https';
  port = environment.red5.port ? `:${environment.red5.port}` : '';
  api = `${this.protocol}://${environment.red5.host}${this.port}/api/v1/applications/${environment.red5.app}`;
  iceServers = [
    {
      urls: 'stun:stun2.l.google.com:19302',
    },
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
    {
      urls: 'stun:stun3.l.google.com:19302',
    },
    {
      urls: 'stun:stun4.l.google.com:19302',
    },
  ];
  constructor(
    public _loadingService: LoadingService,
    public _http: HttpClient,
    private _toastrService: ToastrService,
    public _stageService: StageService,
    public _translateService: TranslateService
  ) {}

  async initPublisher(
    config: Red5StreamConfig,
    rtcPublisher: RTCPublisher,
    stream?: MediaStream
  ) {
    config.protocol = config?.protocol || environment.red5?.protocol || 'ws';
    config.port = config?.port || environment.red5?.port;
    if (!config.port) {
      // remove property
      (config.port as any) = '';
    }
    config.host = config?.host || environment.red5?.host || 'localhost';
    config.app = config?.app || environment.red5?.app || 'live';
    config.streamName = config?.streamName || `stream-${Date.now()}`;
    config.streamMode = config?.streamMode || 'live';
    config.mediaElementId = config?.mediaElementId || 'red5pro-publisher';
    config.bandwidth = config?.bandwidth || {
      audio: 56,
      video: 512,
    };
    config.rtcConfiguration = config?.rtcConfiguration || {
      iceServers: this.iceServers,
      iceCandidatePoolSize: 2,
      bundlePolicy: 'max-bundle',
    };
    config.mediaConstraints = config?.mediaConstraints || {
      audio: true,
      video: {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
      },
    };

    rtcPublisher.on('*', this.handlePublisherEvent);
    try {
      console.log('config', config);
      if (stream) {
        console.log('init with stream', stream);
        await rtcPublisher.initWithStream(config, stream);
      } else {
        await rtcPublisher.init(config);
      }
      return rtcPublisher;
    } catch (error) {
      console.error(error);
      return { error: error };
    }
  }
  // Publisher
  async startPublish(
    match_id: any,
    config: Red5StreamConfig,
    rtcPublisher: RTCPublisher
  ) {
    try {
      this._loadingService.show();
      return rtcPublisher.publish().then(
        (result) => {
          console.log('publishing');
          this._loadingService.dismiss();
          this._stageService
            .updateBroadcastId(match_id, config.streamName, 'in_progress')
            .subscribe(
              (res) => {
                console.log('res', res);
              },
              (err) => {}
            );
          let videoElement = document.getElementById(
            'red5pro-publisher'
          ) as HTMLVideoElement;
          videoElement.muted = true;

          return rtcPublisher;
        },
        (error) => {
          console.log('error publishing', error);
          // this._stageService.updateBroadcastId(match_id, '', '');
          this._loadingService.dismiss();
          return { error: error };
        }
      );
    } catch (error) {
      console.error(error);
      this._loadingService.dismiss();
    }
  }

  async stopPublish(
    match_id: any,
    config: Red5StreamConfig,
    rtcPublisher: RTCPublisher
  ) {
    try {
      this._loadingService.show();
      await rtcPublisher.unpublish();
      this._stageService
        .updateBroadcastId(match_id, config.streamName, 'finished')
        .subscribe(
          (res) => {
            console.log('res', res);
          },
          (err) => {}
        );
      console.log('unpublishing');
      this._loadingService.dismiss();
    } catch (error) {
      console.error(error);
      this._loadingService.dismiss();
    }
  }

  handlePublisherEvent(event) {
    // The name of the event:
    const { type } = event;
    // The dispatching publisher instance:
    const { publisher } = event;
    // Optional data releated to the event (not available on all events):
    const { data } = event;

    // console.log('Publisher Event: ' + type, event);
  }

  // Subscriber
  async startSubscribe(config: Red5StreamConfig, rtcSubscriber: RTCSubscriber) {
    config.protocol = config?.protocol || environment.red5?.protocol || 'ws';
    config.port = config?.port || environment.red5?.port;
    if (!config.port) {
      // remove property
      delete config.port;
    }
    config.host = config?.host || environment.red5?.host || 'localhost';
    config.app = config?.app || environment.red5?.app || 'live';
    config.streamName = config?.streamName || `stream-${Date.now()}`;
    config.mediaElementId = config?.mediaElementId || 'red5pro-subscriber';
    config.bandwidth = config?.bandwidth || {
      audio: 56,
      video: 512,
    };
    config.rtcConfiguration = config?.rtcConfiguration || {
      iceServers: this.iceServers,
      iceCandidatePoolSize: 2,
      bundlePolicy: 'max-bundle',
    };

    config.mediaConstraints = config?.mediaConstraints || {
      audio: true,
      video: true,
    };

    config.subscriptionId =
      config?.subscriptionId || `user-${Math.floor(Math.random() * 0x10000)}`;

    config.maintainConnectionOnSubscribeErrors = true;
    config.muteOnAutoplayRestriction = false;
    rtcSubscriber.on('*', this.handleSubscriberEvent);
    try {
      console.log('config', config);
      // this._loadingService.show();
      await rtcSubscriber.init(config);
      rtcSubscriber.on('Subscribe.Metadata', (metadata) => {
        console.log('metadata', metadata);
        if (metadata && metadata._data.data) {
          this._toastrService.success('Goal!', '👋 ' + metadata.data.data, {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
          });
        }
      });
      await rtcSubscriber.subscribe();
      let videoElement = document.getElementById(
        config.mediaElementId
      ) as HTMLVideoElement;
      console.log('subscribing');
      this._loadingService.dismiss();
      return rtcSubscriber;
    } catch (error) {
      console.error(error);
      // Swal.fire({
      //   icon: 'error',
      //   title: this._translateService.instant('Stream not found'),
      //   confirmButtonText: 'Ok',
      // });
      this._loadingService.dismiss();
    }
  }

  handleSubscriberEvent(event) {
    // The name of the event:
    const { type } = event;
    // The dispatching publisher instance:
    const { subscriber } = event;
    // Optional data releated to the event (not available on all events):
    const { data } = event;
    // switch (type) {
    //   case 'Subscribe.Metadata':
    //     // console.log('metadata', data);
    //     break;
    //   case 'Subscribe.Play.Unpublish':
    //     Swal.fire({
    //       icon: 'info',
    //       title: this._translateService.instant('Stream ended'),
    //       confirmButtonText: 'Ok',
    //     });
    //     break;
    // }
    // console.log('Subscriber Event: ' + type, event);
  }

  sendMessageStream(rtcPublisher: any, data) {
    rtcPublisher.send('onMetaData', data);
  }

  getStreams() {
    let header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    header.append('Access-Control-Allow-Origin', '*');
    return this._http.get(`${this.api}/streams`, { headers: header }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  getStream(streamName) {
    let header = new HttpHeaders();
    header.append('Content-Type', 'application/json');
    header.append('Access-Control-Allow-Origin', '*');
    return this._http
      .get(`${this.api}/streams/${streamName}`, { headers: header })
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }
}
