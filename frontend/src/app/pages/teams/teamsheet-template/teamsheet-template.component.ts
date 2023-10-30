import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import jsPDF from 'jspdf';
import { AppConfig } from 'app/app-config';
import { TeamsheetService } from 'app/services/teamsheet.service';
import moment from 'moment';

@Component({
  selector: 'app-teamsheet-template',
  templateUrl: './teamsheet-template.component.html',
  styleUrls: ['./teamsheet-template.component.scss'],
})
export class TeamsheetTemplateComponent implements AfterViewInit, OnInit {
  today = moment(new Date()).format('DD-MMM-YYYY');

  APP_NAME = AppConfig.APP_NAME;
  @Input() team_id: any;
  @Input() season: any;
  @Input() currentTeam: any;
  @Input() team_player: any[];
  @Input() onSubmitted: EventEmitter<any> = new EventEmitter<any>();
  constructor(public _teamsheetService: TeamsheetService) {
    console.log(this.team_player);
  }

  ngOnInit(): void {
    // this.getTeamSheet2Submit();
    this.onSubmitted.subscribe((data) => {
      this.getTeamSheet2Submit();
      setTimeout(() => {
        this.submitTeamSheet();
      }, 1000);
    });
  }

  submitTeamSheet() {
    // export to pdf
    let html = document.getElementById('team-sheet').innerHTML;
    let doc = new jsPDF('p', 'px', 'a4');
    let font = new FontFace('SimSun', 'url(assets/fonts/pdf/SIMSUN.ttf)');
    let file_name = `Team Sheet-${this.season.name}-${this.currentTeam.group.name}-${this.currentTeam.name}(${this.today}).pdf`;
    font.load().then(function () {
      // set font for div content
      (document.fonts as any).add(font);
      doc.addFont('assets/fonts/pdf/SIMSUN.ttf', 'SimSun', 'normal');
      doc.setFont('SimSun');
      doc.html(html, {
        callback: (doc) => {
          doc.save(file_name);
        },
        x: 10,
        y: 10,
        html2canvas: {
          scale: 1,
        },
      });
    });
  }

  convertImageToBase64(imgUrl, callback) {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      // console.log(image);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      ctx.drawImage(image, 0, 0);
      const dataUrl = canvas.toDataURL();
      callback && callback(dataUrl);
    };
    image.src = imgUrl;
  }

  replaceImage(url, image_id) {
    url = url.replace('https://app.hkjfl.com/hkjfl', '/hkjfl');
    this.convertImageToBase64(url, (dataUrl) => {
      document.getElementById(image_id).setAttribute('src', dataUrl);
    });
  }

  replaceImageURL(url) {
    if (!url) return url;
    url = url.replace('https://app.hkjfl.com/hkjfl', '/hkjfl');
    return url;
  }
  ngAfterViewInit(): void {
    // if (this.currentTeam?.club?.logo) {
    //   this.replaceImage(this.currentTeam.club.logo, 'club_logo');
    // }
  }

  getTeamSheet2Submit() {
    this._teamsheetService
      .getTeamSheet2Submit(this.team_id)
      .toPromise()
      .then((res) => {
        console.log('team sheet', res);
        this.team_player = res.team_players;
        this.currentTeam = res.team;
        this.season = res.season;
        // team_player to array
        this.team_player = Object.keys(this.team_player).map((key) => {
          return this.team_player[key];
        });
        this.team_player = this.team_player.reduce(
          (resultArray, item, index) => {
            const chunkIndex = Math.floor(index / 4);
            if (!resultArray[chunkIndex]) {
              resultArray[chunkIndex] = []; // start a new chunk
            }
            resultArray[chunkIndex].push(item);

            return resultArray;
          },
          []
        );
        console.log(this.team_player);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
