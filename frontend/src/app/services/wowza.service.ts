import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { WowzaWebRTCPlayer } from 'wowza-webrtc-player';
export interface WowzaCreateConfig {
  name: string;
  aspect_ratio_height?: string;
  aspect_ratio_width?: string;
  billing_mode?: string;
  broadcast_location?: string;
  encoder?: string;
  transcoder_type?: string;
}
@Injectable({
  providedIn: 'root',
})
export class WowzaService {
  constructor(private http: HttpClient) {}

  createLiveStream(data: WowzaCreateConfig) {
    let config = {
      live_stream: {
        name: data.name,
        aspect_ratio_height: data.aspect_ratio_height || '480',
        aspect_ratio_width: data.aspect_ratio_width || '720',
        billing_mode: data.billing_mode || 'pay_as_you_go',
        broadcast_location: data.broadcast_location || 'asia_pacific_japan',
        encoder: data.encoder || 'other_webrtc',
        transcoder_type: data.transcoder_type || 'transcoded',
      },
    };
    return this.http.post(`${environment.wowzaApi}/live_streams`, config);
  }

  async publishStream(
    element_id: string,
    sdUrl: string,
    applicationName: string,
    streamName: string
  ) {
    const videoElement = document.getElementById(
      element_id
    ) as HTMLVideoElement;
    const player = new WowzaWebRTCPlayer(videoElement, {
      sdpUrl: sdUrl,
      applicationName: applicationName,
      streamName: streamName,
    });
    await player.playLocal();
    await player.publish();
  }

  async subscribeStream(
    element_id: string,
    sdUrl: string,
    applicationName: string,
    streamName: string
  ) {
    const videoElement = document.getElementById(
      element_id
    ) as HTMLVideoElement;
    const player = new WowzaWebRTCPlayer(videoElement, {
      sdpUrl: sdUrl,
      applicationName: applicationName,
      streamName: streamName,
    });
    await player.playRemote();
  }
  startStreaming(id: string) {
    return this.http.put(
      `${environment.wowzaApi}/live_streams/${id}/start`,
      {}
    );
  }

  stopStreaming(id: string) {
    return this.http.put(`${environment.wowzaApi}/live_streams/${id}/stop`, {});
  }
}
