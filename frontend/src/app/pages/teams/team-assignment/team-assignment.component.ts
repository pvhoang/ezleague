import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LoadingService } from 'app/services/loading.service';
import { TeamService } from 'app/services/team.service';
import { User } from 'app/interfaces/user';
import { AppConfig } from 'app/app-config';

@Component({
  selector: 'app-team-assignment',
  templateUrl: './team-assignment.component.html',
  styleUrls: ['./team-assignment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TeamAssignmentComponent implements OnInit {
  contentHeader: object;
  teamId: any;
  teamName: any;
  team: any = null;
  group_stages: any = [];
  tableData: any;
  allowEditTeam = true;
  currentUser: User;
  permissions: any = {};
  constructor(
    public _trans: TranslateService,
    public _route: ActivatedRoute,
    public _router: Router,
    public _teamService: TeamService,
    public _loadingService: LoadingService,
    public _authService: AuthService
  ) {
    this.teamId = this._route.snapshot.paramMap.get('teamId');
    console.log('teamId', this.teamId);
    this.currentUser = this._authService.currentUserValue;

    this.permissions.assign_player = this.currentUser.role.permissions.find(
      (x) => x.id == AppConfig.PERMISSIONS.assign_players
    );
    this.permissions.assign_coach = this.currentUser.role.permissions.find(
      (x) => x.id == AppConfig.PERMISSIONS.assign_coaches
    );
    console.log('this.permissions', this.permissions);
  }

  async ngOnInit(): Promise<void> {
    await this.getTeam();
  }

  setContentHeader() {
    this.contentHeader = {
      headerTitle: `${this.team?.name} [${this.team?.group.name}]`,
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: this._trans.instant('Teams'),
            isLink: false,
          },
          {
            name: this._trans.instant('Team Assignment'),
            isLink: true,
            link: '/teams/team-assignment',
          },
          {
            name: `${this.team?.name} [${this.team?.group.name}]`,
            isLink: false,
          },
        ],
      },
    };
  }

  getTeam() {
    this._teamService.getTeamById(this.teamId).subscribe((res: any) => {
      if (res) {
        this.team = res;
        this.setContentHeader();
      }
    });
  }
}
