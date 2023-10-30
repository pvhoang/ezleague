import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'app/services/loading.service';
import { StageService } from 'app/services/stage.service';
import { TournamentService } from 'app/services/tournament.service';

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StagesComponent implements OnInit {
  contentHeader: object;
  tournament_id: any;
  stage_id: any;
  current_Tournament: any = null;
  current_Stage: any = null;
  group_stages: any = [];
  tableData: any;
  allowEditTeam = true;
  constructor(
    public _trans: TranslateService,
    public _route: ActivatedRoute,
    public _router: Router,
    public _tournamentService: TournamentService,
    public _stageService: StageService,
    public _loadingService: LoadingService,
    public stageService: StageService
  ) {
    this.tournament_id = this._route.snapshot.paramMap.get('tournament_id');
    this.stage_id = this._route.snapshot.paramMap.get('stage_id');
    _tournamentService
      .getTournament(this.tournament_id)
      .toPromise()
      .then((res: any) => {
        _loadingService.show();
        this.current_Tournament = res;
        _stageService
          .getStage(this.stage_id)
          .toPromise()
          .then((res: any) => {
            this.current_Stage = res;
            this.getTeamsInStage();
            this.hasMatches();
            this.getTableData();

            this.contentHeader = {
              headerTitle: this.current_Tournament.name,
              actionButton: false,
              breadcrumb: {
                type: '',
                links: [
                  {
                    name: this._trans.instant('Leagues'),
                    isLink: false,
                  },
                  {
                    name: this._trans.instant('Manage Leagues'),
                    isLink: true,
                    link: '/leagues/manage',
                  },
                  {
                    name:this.current_Tournament.group_name,
                    
                  },
                  {
                    name:  this.current_Tournament.name
                  },
                ],
              },
            };
          });
      });
      
  }

  getTableData() {
    this.stageService
      .getTableData(this.current_Stage.id)
      .subscribe((data: any) => {
        this.tableData = data;
      });
  }

  getTeamsInStage() {
    this._stageService
      .getTeamsInStage(this.current_Stage.id)
      .toPromise()
      .then((res: any) => {
        this.group_stages = res.data;
      });
  }

  hasMatches() {
    this._stageService
      .hasMatches(this.current_Stage.id)
      .toPromise()
      .then((res: any) => {
        this.allowEditTeam = !res.hasMatches;
        return this.allowEditTeam;
      });
  }

  onDataChange($event) {
    this.getTableData();
  }

  onMatchTableChange($event) {
    this.hasMatches();
  }

  onTeamChange($event) {
    this.group_stages = $event;
  }

  ngOnInit(): void {}
}
