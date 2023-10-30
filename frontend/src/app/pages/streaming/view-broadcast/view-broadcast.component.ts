import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { Red5Service } from 'app/services/red5.service';
import { WowzaService } from 'app/services/wowza.service';
import { environment } from 'environments/environment';
import { LoadingService } from 'app/services/loading.service';
import { TournamentService } from 'app/services/tournament.service';
import { CoreConfigService } from '@core/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig, coreConfig } from 'app/app-config';
import {
  RTCPublisher,
  RTCSubscriber,
  PublisherEventTypes,
  SubscriberEventTypes,
} from 'red5pro-webrtc-sdk';

import Swal from 'sweetalert2';
import moment from 'moment';
import { Capacitor } from '@capacitor/core';
import { set } from 'lodash';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamService } from 'app/services/team.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-view-broadcast',
  templateUrl: './view-broadcast.component.html',
  styleUrls: ['./view-broadcast.component.scss'],
})
export class ViewBroadcastComponent implements OnInit {
  constructor(
    public _authService: AuthService,
    public _red5Service: Red5Service,
    public _coreConfigService: CoreConfigService,
    public _wowzaService: WowzaService,
    public route: ActivatedRoute,
    public _loadingService: LoadingService,
    public _tournamentService: TournamentService,
    public _translateService: TranslateService,
    public _teamService: TeamService,
    private location: Location
  ) {
    this.broadcast_id = this.route.snapshot.paramMap.get('id');
    this.match_id = this.route.snapshot.paramMap.get('match_id');
    let protocol = environment.red5.protocol == 'wss' ? 'https' : 'http';
    let host = environment.red5.host;
    let port = environment.red5.port ? ':' + environment.red5.port : '';
    let app = environment.red5.app;
    this.vod_url = `${protocol}://${host}${port}/${app}/${this.broadcast_id}.m3u8`;
    console.log(this.vod_url);

    this.getMatchById(this.match_id);
  }
  home_players = [];
  away_players = [];
  match_details: any;
  video: HTMLVideoElement;
  video_id = 'red5pro-subscriber';
  count_up = null;
  useHLS = false;
  match_id: any;
  match_info;
  current_user = this._authService.currentUserValue;
  broadcast_id: any;
  stream_list = [];
  vod_url = null;
  subscriber = null;
  public match = {
    isGoal: false,
    isRedCard: false,
    isYellowCard: false,
    team: '',
    starting: null,
    homeGoal: 0,
    awayGoal: 0,
    homeRedCard: 0,
    awayRedCard: 0,
    homeYellowCard: 0,
    awayYellowCard: 0,
    period: {
      name: 0,
      start: '00:00',
      end: '00:00',
    },
    countTime: 0,
    time: '00:00',
  };
  ngOnInit(): void {
    this.getMatchById(this.match_id);

    if (Capacitor.isNativePlatform()) {
      window.screen.orientation.unlock();
    }
  }

  getPlayersByTeamId(id) {
    this._loadingService.show();
    return this._teamService.getPlayersByTeamId(id).toPromise();
  }

  getMatchById(id) {
    this._loadingService.show();
    this._tournamentService.getMatchById(id).subscribe((res) => {
      this.match_info = res;
      this.match.awayGoal = res.away_score || 0;
      this.match.homeGoal = res.home_score || 0;
      this.useHLS = this.match_info.broadcast_status == 'finished';
      this.getPlayersByTeamId(this.match_info.home_team_id).then((res) => {
        this.home_players = res.data;
      });
      this.getPlayersByTeamId(this.match_info.away_team_id).then((res) => {
        this.away_players = res.data;
      });
      this.playStream(this.broadcast_id);
      this.getMatchDetails(id);
    });
  }

  async playStream(stream) {
    if (this.match_info && this.match_info.broadcast_status == 'finished')
      return;
    this.subscriber = new RTCSubscriber();
    this.subscriber.on('*', (event) => {
      this.handleSubscriberEvent(event, this.match);
    });
    console.log(stream);
    this.subscriber = await this._red5Service.startSubscribe(
      {
        streamName: stream,
        mediaElementId: this.video_id,
        playsinline: true,
        bandwidth: {
          video: 2500,
          audio: 128,
        },
        // subscriptionId: this.current_user.id.toString(),
      },
      this.subscriber
    );
    if (this.subscriber) {
      this.video = document.getElementById(this.video_id) as HTMLVideoElement;
      this.video.play();
    }
  }

  handleSubscriberEvent(event, match) {
    // The name of the event:
    const { type } = event;
    // The dispatching publisher instance:
    const { subscriber } = event;
    // Optional data releated to the event (not available on all events):
    const { data } = event;
    switch (type) {
      case 'Subscribe.InvalidName':
        if (!this.useHLS) {
          this.useHLS = true;
          this.playStream(this.broadcast_id);
        }
        break;
      case 'Subscribe.Metadata':
        console.log('metadata', data);

        switch (data.type) {
          case 'goal':
            match.homeGoal = data.home_score;
            match.awayGoal = data.away_score;
            this.match.isGoal = true;
            this.match.team = data.team;

            setTimeout(() => {
              this.match.isGoal = false;
              this.match.team = '';
            }, 3000);

            break;
          case 'red':
            match.homeRedCard = data.home_red;
            match.awayRedCard = data.away_red;
            this.match.isRedCard = true;
            this.match.team = data.team;
            setTimeout(() => {
              this.match.isRedCard = false;
              this.match.team = '';
            }, 3000);

            break;

          case 'yellow':
            match.homeYellowCard = data.home_yellow;
            match.awayYellowCard = data.away_yellow;
            this.match.isYellowCard = true;
            this.match.team = data.team;
            setTimeout(() => {
              this.match.isYellowCard = false;
              this.match.team = '';
            }, 3000);

            break;

          case 'startPeriod':
            match.period.name = data.period;
            match.period.start = moment(data.time).format('mm:ss');
            let count_time = data.count_time;
            console.log(count_time);
            this.match.countTime = count_time;
            // start count up interval
            this.countUp(data.time, 'start');
            // play video
            if (this.video.paused) {
              this.video.play();
            }

            this.match.starting = true;
            setTimeout(() => {
              this.match.starting = null;
            }, 3000);
            break;
          case 'endPeriod':
            match.period.name = data.period;
            // stop count up interval
            // pause video
            if (!this.video.paused) {
              this.video.pause();
            }

            this.match.countTime = data.count_time;
            this.countUp(null, 'stop');
            this.match.starting = false;
            setTimeout(() => {
              this.match.starting = null;
            }, 3000);

            break;

          case 'onChangeScore':
            this.getMatchDetails(this.match_id);
            break;

          case 'removeGoal':
            match.homeGoal = data.home_score;
            match.awayGoal = data.away_score;

            break;

          default:
            if (data.time) {
              match.time = moment(data.time).format('mm:ss');
              this.countUp(data.time, 'start');
            }

            break;
        }

        break;
      case 'Subscribe.Play.Unpublish':
        if (!this.video.paused) {
          this.video.pause();
        }
        this.useHLS = true;
        Swal.fire({
          icon: 'info',
          title: this._translateService.instant('Stream ended'),
          confirmButtonText: 'Ok',
        });
        break;
      case 'Subscribe.Fail':
        Swal.fire({
          icon: 'error',
          title: this._translateService.instant(
            'Stream subscribe failed, please try again later'
          ),
          confirmButtonText: 'Ok',
        });
        this.useHLS = true;
        break;

      case 'Subscribe.Connection.Closed':
      case 'NetConnection.Connect.Closed':
      case 'Connect.Failure':
        this.useHLS = true;
        console.log('connection closed');
        break;
    }
    // console.log('Subscriber Event: ' + type, event);
  }

  onTabChange(event) {
    console.log(event);
  }

  countUp(time, action) {
    if (action == 'stop') {
      clearInterval(this.count_up);
      return;
    }

    let count_time_second = this.match.countTime;

    let current_time = moment().unix();

    let match_time = current_time - time;

    match_time = match_time + count_time_second;

    // time to display
    let display_time = null;

    // set match time with the interval
    this.count_up = setInterval(() => {
      match_time++;
      display_time = moment.unix(match_time).format('mm:ss');
      this.match.time = display_time;
    }, 1000);
  }

  getMatchDetails(match_id) {
    this._tournamentService.getMatchDetails(match_id).subscribe((res) => {
      if (res) {
        this.match.awayRedCard = res.away_red_card || 0;
        this.match.homeRedCard = res.home_red_card || 0;
        this.match.awayYellowCard = res.away_yellow_card || 0;
        this.match.homeYellowCard = res.home_yellow_card || 0;
        // merge home and away team details and add type
        this.match_details = res.home_team.map((item) => {
          item.type_team = 'home';
          return item;
        });
        this.match_details = this.match_details.concat(
          res.away_team.map((item) => {
            item.type_team = 'away';
            return item;
          })
        );
        // sort by time
        this.match_details.sort((a, b) => {
          return a.time - b.time;
        });
      }
    });
  }

  getIconByType(type) {
    let ngClass = '';
    switch (type) {
      case AppConfig.MATCH_DETAIL_TYPES.goal:
        ngClass = 'fa-solid fa-futbol';
        break;
      case AppConfig.MATCH_DETAIL_TYPES.yellow_card:
        ngClass = 'fa-duotone fa-cards-blank fa-yellow';
        break;
      case AppConfig.MATCH_DETAIL_TYPES.red_card:
        ngClass = 'fa-duotone fa-cards-blank fa-red';
        break;
      case AppConfig.MATCH_DETAIL_TYPES.substitution:
        ngClass =
          'fa-duotone fa-arrow-up-arrow-down fa-primary-green fa-secondary-red';
        break;
    }
    return ngClass;
  }

  ngOnDestroy() {
    // disable interval
    clearInterval(this.count_up);
  }

}
