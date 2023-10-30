import { Component, OnInit } from '@angular/core';
import { User } from 'app/interfaces/user';
import { AuthService } from 'app/services/auth.service';
import { ClubService } from 'app/services/club.service';
import { SeasonService } from 'app/services/season.service';
import { TeamService } from 'app/services/team.service';
import { UserService } from 'app/services/user.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public contentHeader: object;
  public toggleMenu = true;
  public currentUser: User;
  public fav_clubs: any = [];
  public club_list: any = [];
  public team_list: any = [];
  public fav_teams: any = [];
  public group_list: any = [];
  public season_id;
  constructor(
    public _authService: AuthService,
    public _userService: UserService,
    public _clubService: ClubService,
    public _teamService: TeamService,
    public _seasonService: SeasonService
  ) {
    this._authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.getCurrentSeason();
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Profile',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/',
          },
          {
            name: 'Profile',
            isLink: false,
          },
        ],
      },
    };
    this.getAllClub();
  }

  getCurrentSeason() {
    this._seasonService.getCurrentSeason().subscribe((res) => {
      this.season_id = res[0].id;
      this.getTeamBySeason(this.season_id);
      this.getGroupsBySeason(this.season_id);
    });
  }

  getFavouriteClubs(club_list) {
    this._userService.getFavouriteClubs().subscribe((res1) => {
      this.fav_clubs = res1.data;
      // add property isFollow to club list if user follow club
      club_list.forEach((club) => {
        club.isFollow = this.fav_clubs.some((x) => x.id == club.id);
      });
    });
  }

  getAllClub() {
    this._clubService
      .getAllClubs()
      .toPromise()
      .then((res) => {
        console.log(res);
        this.club_list = res.data;
        this.getFavouriteClubs(this.club_list);
      });
  }
  getTeamBySeason(season_id) {
    this._teamService.getTeamBySeason(season_id).subscribe((res) => {
      console.log(res);
      this.team_list = res.data;
      this.getFavouriteTeams(this.team_list, season_id);
    });
  }

  getFavouriteTeams(teams, season_id) {
    this._userService.getFavouriteTeams(season_id).subscribe((res) => {
      this.fav_teams = res.data;
      // add property isFollow to club list if user follow club
      teams.forEach((team) => {
        team.isFollow = this.fav_teams.some((x) => x.id == team.id);
      });
    });
  }

  getGroupsBySeason(season_id) {
    this._seasonService.getGroupsBySeason(season_id).subscribe((res) => {
      this.group_list = res;
    });
  }

  updateFavClub(event) {
    this.getFavouriteClubs(this.club_list);
  }

  updateFavTeam(event) {
    this.getFavouriteTeams(this.team_list, this.season_id);
  }
}
