import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from 'app/services/loading.service';
import { Red5Service, Red5StreamConfig } from 'app/services/red5.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Capacitor } from '@capacitor/core';
import { RTCPublisher } from 'red5pro-webrtc-sdk';
import { AppConfig, coreConfig } from 'app/app-config';
import { CoreConfigService } from '@core/services/config.service';
import { TournamentService } from 'app/services/tournament.service';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BatteryInfo, Device } from '@capacitor/device';
import 'p5';
import 'p5/lib/addons/p5.sound';
import { UpdateMatchDetailsComponent } from 'app/pages/league-tournament/modal-update-match-details/update-match-details.component';
import { Location, formatNumber } from '@angular/common';
import { TourService } from 'ngx-ui-tour-ng-bootstrap';
import { TutorialTourService } from 'app/services/tutorial-tour.service';
declare var p5: any;
@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss'],
})
export class BroadcastComponent implements OnInit {
  @ViewChild('canvasElement') canvasElement: ElementRef;
  @ViewChild('videoElement') videoElement: ElementRef;
  @ViewChild('videoElement2') videoElement2: ElementRef;
  @ViewChild('scoreboard') scoreboard: ElementRef;
  @ViewChild('modalEvent') modalEvent: ElementRef;

  @ViewChild('p5Canvas') p5Canvas!: ElementRef;
  // define p5 instance
  private p5!: any;
  private video1: any;
  private mic: any;
  private canvas: any;
  private video2: HTMLVideoElement;
  private ctx: CanvasRenderingContext2D;
  moment = moment;
  match_details: any;
  logoHome: any;
  logoAway: any;
  pg: any;
  aspectRatio = 1.7777777777777777;
  stream: any;
  checkMic = false;
  isIos = Capacitor.getPlatform() === 'ios';
  isOverlay = false;
  isMuted = false;
  batteryInfo: BatteryInfo;
  streamUrl = '';
  match = {
    homeGoal: 0,
    awayGoal: 0,
    homeRedCard: 0,
    awayRedCard: 0,
    homeYellowCard: 0,
    awayYellowCard: 0,
    starting: false,
    half: 0,
    isCounting: false,
  };
  timer = {
    minutes: 0,
    seconds: 0,
    interval: null,
  };
  cameralist = [];
  miclist = [];
  video_element_id = 'red5pro-publisher';
  video: HTMLVideoElement;
  source_connection_information: any;
  current_camera: any;
  current_mic: any;
  red5Publisher: RTCPublisher = null;
  red5Config: Red5StreamConfig;
  match_id: any;
  match_info: any;
  startStreamingTime: any;
  streamingTime: any;
  wifiStatus: any;
  networkListener: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private renderer: Renderer2,
    private loading: LoadingService,
    public _red5Service: Red5Service,
    public _modalService: NgbModal,
    public tourService: TourService,
    private _coreConfigService: CoreConfigService,
    public _tournamentService: TournamentService,
    public _translateService: TranslateService,
    public _tutorialTourService: TutorialTourService,
    private location: Location
  ) {
    if (window.innerWidth > window.innerHeight) {
      this.aspectRatio = window.innerWidth / window.innerHeight;
    } else {
      this.aspectRatio = window.innerHeight / window.innerWidth;
    }
    // get match id from url
    this.match_id = this.route.snapshot.paramMap.get('id');
    this._coreConfigService.setConfig({
      layout: {
        navbar: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        enableLocalStorage: false,
      },
    });
    this.getMatchById(this.match_id);

    if (Capacitor.isNativePlatform()) {
      window.screen.orientation.lock('landscape-primary');
      Device.getBatteryInfo().then((info) => {
        this.batteryInfo = info;
      });
      setInterval(() => {
        Device.getBatteryInfo().then((info) => {
          this.batteryInfo = info;
        });
      }, 30000);
    }
  }

  sketch = (p: any) => {
    p.preload = () => {
      if (this.match_info) {
        console.log('has match info');
        this.logoHome = p.loadImage(
          `https://cors-anywhere.herokuapp.com/${this.match_info?.home_team?.club?.logo}`
        );
        this.logoAway = p.loadImage(
          `https://cors-anywhere.herokuapp.com/${this.match_info?.away_team?.club?.logo}`
        );
      }
    };
    p.setup = () => {
      let deivce: any = {
        facingMode: 'environment',
        aspectRatio: this.aspectRatio,
      };
      if (this.current_camera) {
        console.log(this.current_camera);
        deivce = {
          deviceId: this.current_camera,
          aspectRatio: this.aspectRatio,
        };
      }
      // Create video capture
      this.video1 = p.createCapture({
        video: deivce,
        audio: false,
      });
      this.video1.hide();
      this.mic = new p5.AudioIn();
      this.mic.start();
      // Create canvas
      let width = 720;
      let height = width / this.aspectRatio;
      // console.log(width, height);
      this.canvas = p.createCanvas(width, height);
      this.canvas.hide();
    };

    p.draw = () => {
      p.background(0);
      let width = 260;
      let height = 45;
      p.image(this.video1, 0, 0, p.width, p.height);
      if (this.video1) {
        this.drawScoreBoard(p, width, height, this.canvas);
      }
      if (this.canvas && !this.stream) {
        this.stream = this.canvas.elt.captureStream(30);
        // console.log(this.stream, 'stream', this.canvas.elt);
      }
      setTimeout(() => {
        if (this.stream && this.mic.stream && !this.checkMic) {
          console.log('have mic');
          this.stream.addTrack(this.mic.stream.getAudioTracks()[0]);
          console.log('add mic');
          if (!this.red5Publisher) {
            this.initRed5(this.stream);
          }
          this.checkMic = true;
        }
      }, 3000);
    };
  };

  ngAfterViewInit(): void {
    this.video2 = this.videoElement2.nativeElement;
    this.tourService.initialize([
      {
        anchorId: 'video-broadcast',
        content: 'This is the view of the camera',
        title: 'View of the camera',
        enableBackdrop: true,
      },
      {
        anchorId: 'match-info',
        content: 'Information of the match',
        title: 'Match information',
        enableBackdrop: true,
      },
      {
        anchorId: 'start-stop',
        content: 'Click to start to broadcast the match',
        title: 'Broadcast the match',
        enableBackdrop: true,
      },
      {
        anchorId: 'setTimer',
        content: 'If you want to set the timer, click here',
        title: 'Set timer',
        enableBackdrop: true,
      },
      {
        anchorId: 'start-period',
        content: 'Click here to start the period',
        title: 'Start period',
        enableBackdrop: true,
      },
      {
        anchorId: 'addEventHome',
        content:
          'Click here to add event (goal, red/yellow card) for home team',
        title: 'Start period',
        enableBackdrop: true,
      },
      {
        anchorId: 'addEventAway',
        content:
          'Click here to add event (goal, red/yellow card) for away team',
        title: 'Start period',
        enableBackdrop: true,
      },
      {
        anchorId: 'play-pause',
        content: 'Click here to play or pause the timer of the match',
        title: 'Play/Pause timer',
        enableBackdrop: true,
      },
      {
        anchorId: 'end-period',
        content: 'Click here to end the period',
        title: 'End period',
        enableBackdrop: true,
      },
      {
        anchorId: 'start-stop',
        content: 'Click to end broadcast the match',
        title: 'End broadcast',
        enableBackdrop: true,
      },
    ]);
    this.tourService.end$.subscribe(() => {
      this._tutorialTourService.setTutorialTourStatus('broadcast', true);
    });
    let status = this._tutorialTourService.getTutorialTourStatus('broadcast');
    if (!status) {
      this.tourService.start();
    }
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

  getWifiIcon() {
    let wifiStatus = this.wifiStatus;
    let ngClass = '';
    if (wifiStatus.connected) {
      if (wifiStatus.connectionType === 'wifi') {
        ngClass = 'fa-solid fa-wifi';
      } else {
        ngClass = 'fa-solid fa-signal';
      }
    } else {
      ngClass = 'fa-solid fa-slash';
    }

    return ngClass;
  }

  getBatteryIcon(battery) {
    let ngClass = '';
    if (battery > 75) {
      ngClass = 'fa-solid fa-battery-full text-success';
    } else if (battery > 50) {
      ngClass = 'fa-solid fa-battery-three-quarters text-primary';
    } else if (battery > 25) {
      ngClass = 'fa-solid fa-battery-half text-secondary';
    } else if (battery > 10) {
      ngClass = 'fa-solid fa-battery-quarter text-warning';
    } else {
      ngClass = 'fa-solid fa-battery-empty text-danger';
    }
    return ngClass;
  }

  getMatchById(id) {
    this.loading.show();
    this._tournamentService.getMatchById(id).subscribe((res) => {
      this.match_info = res;
      this.match.awayGoal = this.match_info.away_score || 0;
      this.match.homeGoal = this.match_info.home_score || 0;
      this.getMediaList();
      this.getMatchDetails(id);
    });
  }

  getMatchDetails(match_id) {
    this._tournamentService.getMatchDetails(match_id).subscribe((res) => {
      if (res) {
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

  modalOpen(modal: any) {
    this._modalService.open(modal, { centered: true });
  }
  ngOnInit(): void {
    this.getMediaList();
  }

  getMediaList() {
    navigator.mediaDevices?.enumerateDevices().then((devices) => {
      // filter camera devices
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      if (cameras) {
        this.current_camera = cameras[0].deviceId;
        // create camera list
        this.cameralist = cameras.map((camera) => {
          return {
            value: camera.deviceId,
            label: camera.label
              ? camera.label
              : `Camera ${cameras.indexOf(camera) + 1}`,
          };
        });
        console.log(cameras);
      }
      // get microphone
      const microphones = devices.filter(
        (device) => device.kind === 'audioinput'
      );
      if (microphones.length > 0) {
        this.current_mic = microphones[0].deviceId;
        // create microphone list
        this.miclist = microphones.map((microphone) => {
          return {
            value: microphone.deviceId,
            label: microphone.label
              ? microphone.label
              : `Microphone ${microphones.indexOf(microphone) + 1}`,
          };
        });
      }

      this.setMediaDevice(this.current_camera, this.current_mic);
      this.p5 = new p5(this.sketch, this.p5Canvas.nativeElement);
      this.loading.dismiss();
    });
  }

  onSelectedCameraChange(deviceID) {
    if (deviceID) {
      this.setMediaDevice(deviceID);
    }
  }

  onSelectedMicChange(deviceID) {
    if (deviceID) {
      this.setMediaDevice(null, deviceID);
    }
  }

  setMediaDevice(camera_id?, mic_id?) {
    console.log('setMediaDevice: ', camera_id, mic_id);
    // this.video = this.videoElement.nativeElement;
    if (camera_id) {
      if (this.video1) {
        this.stopMediaDevice();
        this.current_camera = camera_id;
        setTimeout(() => {
          this.changeVideoSource();
        }, 1000);
      }
    }
    if (mic_id) {
      if (this.video1) {
        this.changeAudioSource();
      }
    }
  }

  changeVideoSource(): void {
    console.log('changeVideoSource');
    this.video1.remove(); // Xóa đối tượng video hiện tại
    this.video1 = this.p5.createCapture({
      video: {
        deviceId: this.current_camera,
        aspectRatio: this.aspectRatio,
      },
    });
    this.video1.elt.muted = true;
    this.video1.hide();
  }

  changeAudioSource(): void {
    console.log('changeAudioSource');
    if (!this.stream) return;
    if (!this.stream.getAudioTracks()[0]) return;
    this.stream.removeTrack(this.stream.getAudioTracks()[0]);
    navigator.mediaDevices
      .getUserMedia({ audio: { deviceId: this.current_mic } })
      .then((stream) => {
        this.stream.addTrack(stream.getAudioTracks()[0]);
        console.log('change audio source');
      });
  }

  stopMediaDevice() {
    const activeStream = this.video1.elt.srcObject as MediaStream;
    if (activeStream) {
      const tracks = activeStream.getTracks();
      tracks.forEach((track) => {
        track.stop();
        console.log('stop track', track);
      });
      console.log('stop camera to change');
    }
  }
  async unpublish() {
    if (!this.red5Publisher) return;
    console.log('unpublishing...');
    await this._red5Service.stopPublish(
      this.match_id,
      this.red5Config,
      this.red5Publisher
    );
    this.red5Publisher = null;
  }
  async initRed5(stream: MediaStream) {
    if (!this.current_camera) {
      this.current_camera = this.cameralist[0].value;
    }
    let stream_mode = 'record';
    let stream_name = null;
    console.log('broadcast_id: ', this.match_info.broadcast_id);

    if (this.match_info?.broadcast_id) {
      stream_name = this.match_info.broadcast_id;
      stream_mode = 'append';
    }

    // console.log(this.current_camera);
    this.red5Config = {
      streamName: stream_name,
      mediaElementId: this.video_element_id,
      streamMode: stream_mode,
      playsinline: true,
      mediaConstraints: {
        audio: true,
        video: {
          aspectRatio: this.aspectRatio,
        },
      },
      bandwidth: {
        video: 4000,
        audio: 128,
      },
    };
    this.red5Publisher = new RTCPublisher();
    this.red5Publisher.on('*', (event) => {
      this.handlePublisherEvent(event);
    });

    if (stream) {
      this._red5Service
        .initPublisher(this.red5Config, this.red5Publisher, stream)
        .then((res) => {
          if (res.hasOwnProperty('error')) {
            this.red5Publisher = null;
          } else {
            this.red5Publisher = res;
            console.log('init red5 publisher success');
            this.video2.muted = true;
            this.red5Publisher.preview();
          }
        });
    }
  }

  async startPublishing() {
    this._red5Service
      .startPublish(this.match_id, this.red5Config, this.red5Publisher)
      .then((res) => {
        // type object and has key error
        if (typeof res === 'object' && res.hasOwnProperty('error')) {
          this.red5Publisher = null;
        } else {
          this.red5Publisher = res;
          this.startStreamingTime = new Date();

          // update streaming time
          setInterval(() => {
            this.streamingTime =
              new Date().getTime() - this.startStreamingTime.getTime();
            // convert to HH:mm:ss
            this.streamingTime = new Date(this.streamingTime)
              .toISOString()
              .substr(11, 8);
          }, 1000);
        }
        // console.log(this.red5Publisher);
      });
  }

  handlePublisherEvent(event) {
    // The name of the event:
    const { type } = event;
    // The dispatching publisher instance:
    const { publisher } = event;
    // Optional data releated to the event (not available on all events):
    const { data } = event;
    switch (type) {
      case 'Publish.Start':
        console.log('Publish.Start');
        this.isOverlay = true;
        this.match.starting = true;
        console.log('overlay: ', this.isOverlay);
        console.log('starting: ', this.match.starting);
        break;
      case 'Publish.Fail':
        this.red5Publisher = null;
        console.log('Publish.Fail');
        Swal.fire({
          icon: 'error',
          title: 'Cannot start broadcast session, please try again later',
          confirmButtonText: 'OK',
        });
      case 'Publish.Available':
        console.log('Publish.Available');
        break;
      case 'Publisher.Connection.Closed':
        this.red5Publisher = null;
        console.log('Publisher.Connection.Closed');
        break;
      case 'Publish.InvalidName':
        this.red5Publisher = null;
        console.log('Publish.InvalidName');
        Swal.fire({
          icon: 'info',
          title:
            'Stream already has a broadcast session. Please try again later',
          confirmButtonText: 'OK',
        });
        break;
    }
  }

  dismiss() {
    this.router.navigate(['/streaming']);
  }

  countdown = 3;
  countDownNumber() {
    return new Promise((resolve, reject) => {
      let countdowninv = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.isOverlay = false;
          this.countdown = 3;
          clearInterval(countdowninv);
          resolve(true);
        }
      }, 1000);
    });
  }

  toggleStream() {
    if (this.isOverlay) {
      this.endBroadcast();
    } else {
      this.startPublishing();
    }
  }

  theInterval = null;

  async toggleCounting(isCounting: boolean) {
    // get element by id
    const timerCount = document.getElementById('timer-count');
    // add keyframe animation
    timerCount.classList.add('blink-class');

    this.match.isCounting = isCounting;

    if (this.match.isCounting) {
      this.theInterval = setInterval(() => {
        this.timer.seconds++;
        if (this.timer.seconds == 60) {
          this.timer.seconds = 0;
          this.timer.minutes++;
        }
      }, 1000);
    } else {
      clearInterval(this.theInterval);
    }
  }

  endIsHalf() {
    this.match.half = this.match.half == 0 ? 1 : 0;
    this.match.starting = false;
    if (this.video.paused) this.video.play();
    else this.video.pause();
  }

  endBroadcast() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning' as SweetAlertIcon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, end it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isOverlay = false;
        this.unpublish().then(() => {
          Swal.fire('Ended!', 'The match has been ended.', 'success');
        });
      }
    });
  }

  sendEvent(data) {
    console.log('send event: ', this.red5Publisher);

    if (!this.red5Publisher) return;
    this._red5Service.sendMessageStream(this.red5Publisher, data);
  }

  async ngOnDestroy() {
    this._coreConfigService.setConfig({
      layout: {
        navbar: {
          hidden: false,
        },
        menu: {
          hidden: false,
        },
        footer: {
          hidden: false,
        },
      },
    });
    this.mic.stop();
    this.stopMediaDevice();
    await this.unpublish();
    this.video = null;
    //  if native, stop camera access
    if (Capacitor.isNativePlatform()) {
      window.screen.orientation.lock('portrait');
    }
  }

  addGoal(team: any) {
    if (!this.red5Publisher) {
      Swal.fire({
        icon: 'info',
        title: 'Please start the broadcast first',
        confirmButtonText: 'OK',
      });
      return;
    }

    switch (team) {
      case 'home':
        this.match.homeGoal++;
        break;
      case 'away':
        this.match.awayGoal++;
        break;
    }
    this._tournamentService
      .updateMatch({
        home_score: this.match.homeGoal,
        away_score: this.match.awayGoal,
        id: this.match_info.id,
      })
      .subscribe(
        (res) => {
          // console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );

    this.sendEvent({
      type: 'goal',
      team: team,
      // get timestamp by momentjs
      time: moment().unix(),
      home_score: this.match.homeGoal,
      away_score: this.match.awayGoal,
      home_yellow: this.match.homeYellowCard,
      away_yellow: this.match.awayYellowCard,
      home_red: this.match.homeRedCard,
      away_red: this.match.awayRedCard,
    });
  }

  removeEvent(event: any) {
    if (!this.red5Publisher) {
      Swal.fire({
        icon: 'info',
        title: 'Please start the broadcast first',
        confirmButtonText: 'OK',
      });
      return;
    }

    this._tournamentService.deleteMatchDetails(event.id).subscribe(
      (res) => {
        console.log(res);

        this.getMatchDetails(this.match_id);
        this.match.awayGoal = res.data.away_score;
        this.match.homeGoal = res.data.home_score;
        this.sendEvent({
          type: 'onChangeScore',
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  editTimer(minutes, seconds, modal?) {
    this.timer.minutes = minutes;
    this.timer.seconds = seconds;
    if (modal) modal.dismiss();
  }

  actionPeriod(type, event) {
    switch (type) {
      case 'start':
        this.toggleCounting(true);
        if (this.match.half == 5) {
          this.match.starting = true;
          // disable the button
          this.isOverlay = false;
          return;
        } else {
          this.match.half++;
        }

        this.sendEvent({
          type: 'startPeriod',
          time: moment().unix(),
          period: this.match.half,
        });
        break;
      case 'end':
        this.toggleCounting(false);
        this.sendEvent({
          type: 'endPeriod',
          period: this.match.half,
        });

        break;
    }
  }

  drawScoreBoard(p, width, height, canvas) {
    let x_board = canvas.width / 2 - width / 2;
    let size_score = 17;

    // Vẽ background border radius 10px
    let c = p.color(255, 255, 255);
    p.fill(c);
    p.noStroke();
    p.rect(x_board, 0, width, height, 10);

    // Vẽ tên đội
    p.fill(0);
    p.textSize(size_score);
    let textHome = this.match_info?.home_team?.name;
    let textHomeWidth = p.textWidth(textHome);
    let textAway = this.match_info?.away_team?.name;
    let textAwayWidth = p.textWidth(textAway);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(textHome, x_board + 42, height / 2);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text(textAway, x_board + width - 42, height / 2);

    // Vẽ số bàn thắng
    p.textSize(size_score * 1.5);
    p.fill(39, 72, 147);
    let score = `${this.match.homeGoal} : ${this.match.awayGoal}`;
    let scoreWidth = p.textWidth(score);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(score, x_board + width / 2, height / 2 - 8);

    // Vẽ thời gian
    p.fill(0);
    p.textSize(10);
    let period: any = this.match.half;
    switch (this.match.half) {
      case 0:
      case 1:
        period = '1st';
        break;
      case 2:
        period = '2nd';
        break;
      case 3:
        period = '3rd';
        break;
      default:
        period = `${this.match.half}th`;
        break;
    }
    let time = `${period} ${formatNumber(
      this.timer.minutes,
      'en-US',
      '2.0'
    )}:${formatNumber(this.timer.seconds, 'en-US', '2.0')}`;
    let timeWidth = p.textWidth(time);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(time, x_board + width / 2, height - 10);

    // vẽ logo đội
    if (this.logoHome && this.logoAway && this.match_info) {
      p.image(this.logoHome, x_board + 10, height / 2 - 15, 30, 30);
      p.image(this.logoAway, x_board + width - 40, height / 2 - 15, 30, 30);
    }
  }

  openModalUpdataEvent(team_id) {
    if (!this.match.starting) {
      Swal.fire({
        icon: 'info',
        title: this._translateService.instant(
          'Please start the broadcast first'
        ),
        confirmButtonText: 'OK',
      });
      return;
    }
    if (!team_id) return;
    let modalRef = this._modalService.open(UpdateMatchDetailsComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.team_id = team_id;
    modalRef.componentInstance.match = {
      id: this.match_info.id,
    };
    let match_id = this.match_info.id;
    modalRef.componentInstance.onUpdated.subscribe((res) => {
      if (res) {
        this.getMatchDetails(match_id);
        this.match.awayGoal = res.data.away_score;
        this.match.homeGoal = res.data.home_score;
        this.sendEvent({
          type: 'onChangeScore',
        });
      }
    });
  }
}
