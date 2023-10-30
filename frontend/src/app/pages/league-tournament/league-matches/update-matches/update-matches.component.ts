import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TournamentService } from 'app/services/tournament.service';
import { ModalUpdateScoreComponent } from '../../modal-update-score/modal-update-score.component';
import { coreConfig } from '../../../../app-config';
import { UpdateMatchDetailsComponent } from '../../modal-update-match-details/update-match-details.component';
import { AppConfig } from 'app/app-config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-update-matches',
  templateUrl: './update-matches.component.html',
  styleUrls: ['./update-matches.component.scss'],
})
export class UpadateMatchesComponent implements OnInit {
  @Input() is_update: boolean = false;
  match_id: any;
  match_info: any;
  coreConfig = coreConfig;
  home_team_details: any;
  away_team_details: any;
  AppConfig = AppConfig;
  constructor(
    public _route: ActivatedRoute,
    public _tournamentService: TournamentService,
    public _modalService: NgbModal,
    private location: Location
  ) {
    this.match_id = this._route.snapshot.paramMap.get('match_id');
    this.getMatchById();
    this.getMatchDetails();
  }

  ngOnInit(): void {}

  getMatchById() {
    this._tournamentService.getMatchById(this.match_id).subscribe((res) => {
      console.log(res);
      this.match_info = res;
    });
  }

  getMatchDetails() {
    this._tournamentService.getMatchDetails(this.match_id).subscribe((res) => {
      this.home_team_details = res.home_team;
      this.away_team_details = res.away_team;
      console.log('home_team_details', this.home_team_details);
      console.log('away_team_details', this.away_team_details);
    });
  }

  openModalUpdateScore() {
    if (!this.match_info) return;
    let modalRef = this._modalService.open(ModalUpdateScoreComponent, {
      size: 'md',
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.stage_type = this.match_info.stage.type;
    modalRef.componentInstance.match = {
      id: this.match_info.id,
      home_score: this.match_info.home_score,
      away_score: this.match_info.away_score,
      home_penalty: this.match_info.home_penalty,
      away_penalty: this.match_info.away_penalty,
      home_team_name: this.match_info.home_team.name,
      away_team_name: this.match_info.away_team.name,
    };
    modalRef.componentInstance.onUpdated.subscribe((res) => {
      this.getMatchById();
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

  openModalUpdataEvent(team_id) {
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
    modalRef.componentInstance.onUpdated.subscribe((res) => {
      this.getMatchDetails();
      this.getMatchById();
    });
  }

  updateScore(score, is_home) {
    if (score < 0) return;
    this.match_info.home_score = is_home ? score : this.match_info.home_score;
    this.match_info.away_score = is_home ? this.match_info.away_score : score;
    let data = {
      id: this.match_id,
      home_score: this.match_info.home_score ? this.match_info.home_score : 0,
      away_score: this.match_info.away_score ? this.match_info.away_score : 0,
    };
    this._tournamentService.updateMatch(data).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        this.match_info.home_score = this.match_info.home_score - 1;
        this.match_info.away_score = this.match_info.away_score - 1;
      }
    );
  }

  removeEvent(event: any) {
    this._tournamentService.deleteMatchDetails(event.id).subscribe(
      (res) => {
        console.log(res);
        this.getMatchDetails();
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
