import { Component, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { SeasonService } from 'app/services/season.service';
import { TournamentService } from 'app/services/tournament.service';
import moment from 'moment';
import { query } from '@angular/animations';
import { LoadingService } from 'app/services/loading.service';
import { coreConfig } from '../../../app-config';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-league-matches',
  templateUrl: './league-matches.component.html',
  styleUrls: ['./league-matches.component.scss'],
})
export class LeagueMatchesComponent implements AfterViewInit, OnInit {
  onSelectTab = new EventEmitter();
  activeIds = '';
  selectedTabIndex = 0;
  tabs = [];
  matches: any = {};
  tab: any;
  selectedTeam: any;
  selectedTournament: any;
  seasons = [];
  teams = [];
  tournaments = [];
  coreConfig = coreConfig;
  params = { season_id: null, tournament_id: null };
  hasMatch = false;
  constructor(
    public _tourService: TournamentService,
    public _seasonService: SeasonService,
    public _loadingService: LoadingService,
    public _router: Router,
    public route: ActivatedRoute
  ) {
    this.params.tournament_id = parseInt(
      this.route.snapshot.queryParamMap.get('tournament_id')
    );
    this.params.season_id = parseInt(
      this.route.snapshot.queryParamMap.get('season_id')
    );
  }

  ngOnInit(): void {
    this.getSeasons();
  }

  getSeasons() {
    let query = this.params.tournament_id
      ? `?tournament_id=${this.params.tournament_id}`
      : '';
    this._seasonService
      .getCurrentSeason()
      .toPromise()
      .then((res) => {
        this.seasons = res;
        if (this.seasons.length == 0) {
          this._loadingService.dismiss();
          return;
        }
        this.params.season_id = this.params.season_id
          ? this.params.season_id
          : res[0].id;
        this.params.tournament_id = this.params.tournament_id
          ? this.params.tournament_id
          : null;
        this._router.navigate([], { queryParams: this.params });
        this.getTournamentOptions(this.params.season_id);
      });
  }

  onSelectMatch(e) {
    this._router.navigate(['/leagues/matches', e.id, 'update-details']);
  }

  selectedTab(e) {
    this.tab = e;
    if (this.tab) {
      let element = document.getElementById(this.tab.value);
      setTimeout(() => {
        if (!element) return;
        const y = element.getBoundingClientRect().top + window.scrollY - 250;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 500);
    }
  }

  onSelectSeason(e) {
    this.selectedTournament = null;
    this.params.tournament_id = null;
    console.log(this.params);

    this._router.navigate([], { queryParams: this.params });
    this.getTournamentOptions(this.params.season_id);
  }

  onSelectTournament(e) {
    this.selectedTournament = e;
    this.teams = this.selectedTournament ? this.selectedTournament.teams : [];
    this.selectedTeam = null;
    // navigate to tournament with url leagues/matches?tournament_id=100
    this.params.tournament_id = this.selectedTournament?.id || null;
    this._router.navigate([], {
      queryParams: this.params,
    });
    let query = this.selectedTournament?.id
      ? `?tournament_id=${this.selectedTournament?.id}`
      : '';
    this.getMatchesWithQuery(query, false);
  }

  getTournamentOptions(season_id) {
    this._seasonService.getTournamentOptions(season_id, 0, true).subscribe((res) => {
      this.tournaments = res.tournaments;
      if (this.tournaments.length == 0) {
        this.hasMatch = false;
        this.tabs = [];
        return;
      }
      this.params.tournament_id =
        this.params.tournament_id || res.tournaments[0].id;
      this.selectedTournament = this.tournaments.find(
        (tournament) => tournament.id === this.params.tournament_id
      );
      this.onSelectTournament(this.selectedTournament);
    });
  }

  getMatchesWithQuery(query: string = '', updateOptions: boolean = true) {
    this._loadingService.show();
    this._tourService
      .getMatchesWithQuery(this.params.season_id, query)
      .toPromise()
      .then((res) => {
        let today = moment().format('YYYY-MM-DD');
        this.matches = res.matches;
        let numberOfMatches = Object.keys(this.matches).length;
        this.hasMatch = numberOfMatches > 0 ? true : false;
        let tabs = [];
        if (numberOfMatches == 0) {
          this.tabs = tabs;
          return;
        }
        let count = 0;
        this.activeIds = '';
        for (let key in this.matches) {
          if (key) {
            this.activeIds += `match-panel-${count},`;
          }
          count++;
          let index = tabs.length;
          let label = 'TBD';
          let date = 'TBD';
          if (key) {
            label = moment(key).format('ddd DD MMM');
            date = moment(key).format('YYYY-MM-DD');
          }

          if (date == today) {
            label = 'Today';
          }
          if (label != 'TBD') {
            tabs.push({
              label: label,
              value: date,
              index: index,
            });
          }
        }

        // select tab has date nearest to today
        let nearestDate = Object.keys(this.matches).reduce((a, b) => {
          return Math.abs(moment(a).diff(today, 'days')) <
            Math.abs(moment(b).diff(today, 'days'))
            ? a
            : b;
        });
        
        this.selectedTabIndex = tabs.findIndex(
          (tab) => tab.value === moment(nearestDate).format('YYYY-MM-DD')
        );

        // sort tabs by date
        tabs.sort((a, b) => {
          return moment(a.value).diff(moment(b.value));
        });
        this.tabs = tabs;
        setTimeout(() => {
          this.onSelectTab.emit(this.selectedTabIndex);
        }, 500);
      });
  }

  ngAfterViewInit(): void {}
}
