import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Season } from 'app/interfaces/season';
import { AuthService } from 'app/services/auth.service';
import { ClubService } from 'app/services/club.service';
import { LoadingService } from 'app/services/loading.service';
import { SeasonService } from 'app/services/season.service';
import { TeamService } from 'app/services/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-team-selection',
  templateUrl: './team-selection.component.html',
  styleUrls: ['./team-selection.component.scss'],
})
export class TeamSelectionComponent implements OnInit {
  public contentHeader: object;
  seasons: Season[] = [];
  season: Season;
  selectedClub: any;
  selectedGroup: any;
  clubFilter: any;
  seasonId: any;
  clubs:
    | [
        {
          id: number;
          name: string;
          code: string;
          groups: [];
        }
      ]
    | any = [];
  groups = [];
  teams = [];

  constructor(
    public _route: ActivatedRoute,
    public _router: Router,
    public teamService: TeamService,
    public seasonService: SeasonService,
    private _translateService: TranslateService,
    public _clubService: ClubService,
    public _loadingService: LoadingService,
    public _authService: AuthService,
    public _trans: TranslateService
  ) {
    this.seasonId = this._route.snapshot.paramMap.get('seasonId');
    console.log('current User', this._authService.currentUserValue);
  }

  setContentHeader() {
    this.contentHeader = {
      headerTitle: this._trans.instant('Team Assignment'),
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: this._trans.instant('Team'),
            isLink: false,
          },
          {
            name: this._trans.instant('Team Assignment'),
            isLink: false,
          },
        ],
      },
    };
  }

  ngOnInit(): void {
    this.setContentHeader();
    this.getActiveSeasons();
  }

  getActiveSeasons() {
    let status = 'active';
    this.seasonService.getSeasons(status).subscribe(
      (data) => {
        console.log(`getActiveSeasons`, data);
        this.seasons = data;
        this.season = this.seasons[0];
        this.seasonId = this.season.id;
        this.getTeam();
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonText: this._translateService.instant('OK'),
        });
      }
    );
  }

  getTeam() {
    this._loadingService.show();
    this.teamService
      .getTeamInSeason2Manage(this.seasonId)
      .toPromise()
      .then((res: any) => {
        console.log('res', res);
        this.teams = res.data;
        // divide into groups by club
        this.getClbsGroups(res.data);
      });
  }

  onChangeSeason($event) {
    console.log('onChangeSeason', $event);
    this.season = $event;
    this.seasonId = this.season.id;

    // reset teams
    this.teams = [];
    // reset groups
    this.groups = [];
    // get teams
    this.getTeam();
  }

  onSelectedClubChange(event) {
    // console.log('onSelectedClubChange', event);
    if (event) {
      this.clubFilter = event.id;
      this.groups = event.groups;
      this.selectedGroup = this.groups[0].id;
    } else {
      this.clubFilter = null;
      this.groups = [];
      this.selectedGroup = null;
    }
  }

  getClbsGroups(teams) {
    // reset clubs
    this.clubs = [];

    teams.forEach((team) => {
      // if team.club.id is not in clubs
      if (!this.clubs.find((club) => club.id === team.club.id)) {
        this.clubs.push(team.club);
        this.clubs[this.clubs.length - 1].groups = [];
      }
      // add group to club if not exist in club
      let club = this.clubs.find((club) => club.id === team.club.id);
      if (!club.groups.find((group) => group.id === team.group.id)) {
        club.groups.push(team.group);
        club.groups[club.groups.length - 1].teams = [];
      }
      // sort groups
      club.groups.sort((a, b) => {
        // get number from string
        let aNumber;
        if (parseInt(a.name.match(/\d+/))) {
          aNumber = parseInt(a.name.match(/\d+/)[0]);
        }
        let bNumber;
        if (parseInt(b.name.match(/\d+/))) {
          bNumber = parseInt(b.name.match(/\d+/)[0]);
        }
        if (aNumber < bNumber) {
          return -1;
        }
        if (aNumber > bNumber) {
          return 1;
        }
        // if aNumber == bNumber then sort by name
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    });
    // sort clubs
    this.clubs.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    // set selected club
    this.clubFilter = this.clubs[0]?.id;
    this.selectedClub = this.clubs[0];
    this.groups = this.clubs[0]?.groups;
    this.selectedGroup = this.clubs[0]?.groups[0].id;
  }

  openPlayerModal(team) {
    this._router.navigate(['teams/team-assignment', team.id]);
  }
}
