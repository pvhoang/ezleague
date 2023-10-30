import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'app/services/loading.service';
import { SeasonService } from 'app/services/season.service';
import { StageService } from 'app/services/stage.service';
import { TournamentService } from 'app/services/tournament.service';
import { AppConfig } from 'app/app-config';
import { CoreConfigService } from '@core/services/config.service';

@Component({
  selector: 'app-fixtures-results',
  templateUrl: './fixtures-results.component.html',
  styleUrls: ['./fixtures-results.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FixturesResultsComponent implements OnInit {
  stage_id: any;
  teamFilter: any;
  contentHeader: object;
  matches = {
    fixtures: {},
    results: {},
  };
  seasons = [];
  groups = [];
  tournaments = [];
  teams = [];
  params = {
    season_id: null,
    group_id: null,
    tournament_id: null,
  };
  tableData: any;
  selectedTournament: any;
  activeId = 1;

  constructor(
    public _trans: TranslateService,
    public _tourService: TournamentService,
    public _seasonService: SeasonService,
    public _stageService: StageService,
    public _route: ActivatedRoute,
    public _router: Router,
    public _loading: LoadingService,
    private _coreConfigService: CoreConfigService
  ) {
    this.contentHeader = {
      headerTitle: `${this._trans.instant('Fixtures')} & ${this._trans.instant(
        'Results'
      )}`,
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: this._trans.instant('Leagues'),
            isLink: false,
          },
          {
            name: `${this._trans.instant('Fixtures')} & ${this._trans.instant(
              'Results'
            )}`,
            isLink: false,
          },
        ],
      },
    };
    this.params.season_id = parseInt(
      this._route.snapshot.queryParamMap.get('season_id')
    );
    this.params.group_id = parseInt(
      this._route.snapshot.queryParamMap.get('group_id')
    );
    this.params.tournament_id = parseInt(
      this._route.snapshot.queryParamMap.get('tournament_id')
    );
    this.getCurrentSeason();
  }

  ngOnInit(): void {}

  showMatchesBySeason() {
    this._loading.show();
    this._router.navigate([], { queryParams: this.params });
    // get fixtures
    this.getFixtureResult(this.params);
    // get results
    let prm = JSON.parse(JSON.stringify(this.params));
    prm.is_results = 1;
    this.getFixtureResult(prm, 'results');
  }

  getFixtureResult(params, type = 'fixtures') {
    this._tourService
      .showMatchesFixturesBySeason(this.params.season_id, params)
      .subscribe((res) => {
        this.matches[type] = res.matches;
        // active results tab if fixtures is empty
        if (type === 'fixtures') {
          if (res.matches.length === 0) {
            this.activeId = 2;
          } else {
            this.activeId = 1;
          }
        }
        // console.log('res.stage_id ', res.stage_id);
        // console.log('typeof res.stage_id ', typeof res.stage_id);
        if (res.stage_id) {
          this.stage_id = res.stage_id;
          this.getTableData(res.stage_id);
        }
      });
  }

  // get current season
  getCurrentSeason() {
    this._seasonService.getCurrentSeason().subscribe((res) => {
      this.seasons = res;
      if (this.seasons.length > 0) {
        if (!this.params.season_id) this.params.season_id = this.seasons[0].id;
        this.getGroupsBySeason(this.params.season_id);
      }
    });
  }

  getGroupsBySeason(season_id) {
    this._seasonService.getGroupsBySeason(season_id).subscribe((res) => {
      this.groups = res;
      if (this.groups.length > 0) {
        if (!this.params.group_id) this.params.group_id = this.groups[0].id;
        this.getTournamentOptions(season_id, this.params.group_id);
      }
    });
  }

  getTournamentOptions(season_id, group_id) {
    this._seasonService
      .getTournamentOptions(season_id, group_id)
      .subscribe((res) => {
        this.tournaments = res.tournaments;
        if (this.tournaments.length > 0) {
          if (!this.params.tournament_id)
            this.params.tournament_id = res.tournaments[0].id;
          this.selectedTournament = this.tournaments.find(
            (tournament) => tournament.id === this.params.tournament_id
          );
          this.onSelectedTournament(this.selectedTournament);
        }
      });
  }

  onSelectedSeason(event) {
    if (!event) return;
    this.matches = { fixtures: {}, results: {} };
    this.tableData = null;
    this.teamFilter = null;
    this.params.season_id = event;
    this.params.group_id = null;
    this.params.tournament_id = null;
    this.selectedTournament = null;
    this.getGroupsBySeason(event);
  }

  onSelectedGroup(event) {
    if (!event) return;
    this.matches = { fixtures: {}, results: {} };
    this.tableData = null;
    this.teamFilter = null;
    this.params.group_id = event;
    this.params.tournament_id = null;
    this.selectedTournament = null;
    this.getTournamentOptions(this.params.season_id, this.params.group_id);
  }

  onSelectedTournament(event) {
    if (!event) return;
    this.matches = { fixtures: {}, results: {} };
    this.tableData = null;
    this.teamFilter = null;
    this.params.tournament_id = event.id;
    this.teams = event.teams;
    this.showMatchesBySeason();
  }

  getTableData(stage_id) {
    if (!stage_id) return;
    let stageID;
    for (let key in stage_id) {
      switch (key) {
        case AppConfig.TOURNAMENT_TYPES.league:
          stageID = stage_id[key];
          break;
        case AppConfig.TOURNAMENT_TYPES.groups:
          stageID = stage_id[key];
          break;
        case AppConfig.TOURNAMENT_TYPES.knockout:
          break;
      }
    }
    if (!stageID || this.tableData) return;
    this._stageService.getTableData(stageID).subscribe((data: any) => {
      this.tableData = data;
    });
  }

  onSelectedTeam(event) {
    if (!event) return;
    this._router.navigate([], { queryParams: this.params });
  }
}
