import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import 'slick-carousel/slick/slick';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { StageService } from 'app/services/stage.service';

@Component({
  selector: 'app-streaming',
  templateUrl: './streaming.component.html',
  styleUrls: ['./streaming.component.scss'],
})
export class StreamingComponent implements OnInit {
  contentHeader: any;
  isMobile = false;

  homeimage = 'assets/images/clubs/chelsea.png';
  awayimage = 'assets/images/clubs/lesceiter.png';
  upcomingMatches = [];
  liveMatches = [];
  finishedMatches = [];
  $: any;
  slick: any;
  constructor(
    private breakpointObserver: BreakpointObserver,
    public modalService: NgbModal,
    private router: Router,
    public _coreConfigService: CoreConfigService,
    public _stageService: StageService
  ) {
    this._coreConfigService.setConfig({
      layout: {
        navbar: {
          hidden: false,
        },
        menu: {
          hidden: false,
        },
        footer: {
          hidden: true,
        },
      },
    });
    this.getUpcomingMatches();
    this.getLiveMatches();
    this.getFinishedMatches();
  }

  getUpcomingMatches() {
    this._stageService.getLiveMatchesAvailable().subscribe((res) => {
      this.upcomingMatches = res.data;
    });
  }

  getLiveMatches() {
    this._stageService.getStreamingMatches('in_progress').subscribe((res) => {
      this.liveMatches = res.matches;
    });
  }

  getFinishedMatches() {
    this._stageService.getStreamingMatches('finished').subscribe((res) => {
      this.finishedMatches = res.matches;
    });
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Streaming',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Streaming',
            isLink: false,
            link: '',
          },
        ],
      },
    };

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }
  ngAfterViewInit(): void {
    (<any>$('.slick-slider')).slick({
      arrows: true,
      dots: true,
    });
  }

  showBroadCastModal(match_id) {
    this.router.navigate(['/streaming/broadcast', match_id]);
  }

  goWatchLive(broadcast_id, match_id) {
    // navigate to watch room 'streaming/:matchid/watch/:id'
    this.router.navigate(['/streaming', match_id, 'watch', broadcast_id]);
  }
}
