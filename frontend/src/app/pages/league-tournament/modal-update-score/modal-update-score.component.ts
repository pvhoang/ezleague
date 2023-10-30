import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from 'app/app-config';
import { TournamentService } from 'app/services/tournament.service';
import { log } from 'console';

@Component({
  selector: 'app-modal-update-score',
  templateUrl: './modal-update-score.component.html',
  styleUrls: ['./modal-update-score.component.scss'],
})
export class ModalUpdateScoreComponent implements OnInit {
  @Input() stage_type: any;
  @Input() match: any;
  @Output() onUpdated = new EventEmitter();
  fields = [];
  constructor(
    public _translateService: TranslateService,
    public _modalService: NgbModal,
    public _tournamentService: TournamentService
  ) {}
  form = new FormGroup({});
  model: any;
  ngOnInit(): void {
    console.log('stage_type', this.stage_type);

    console.log('match', this.match);
    this.model = {
      id: this.match.id,
      home_score: this.match.home_score,
      away_score: this.match.away_score,
      home_penalty: this.match.home_penalty,
      away_penalty: this.match.away_penalty,
    };
    this.fields = [
      {
        key: 'type',
        type: 'input',
        props: {
          type: 'hidden',
        },
        defaultValue: this.stage_type,
      },
      {
        key: 'home_score',
        type: 'core-touchspin',
        props: {
          label: this.match.home_team_name,
          type: 'number',
          min: 0,
          max: 100,
          step: 1,
        },
        defaultValue: 0,
      },
      {
        key: 'away_score',
        type: 'core-touchspin',
        props: {
          label: this.match.away_team_name,
          type: 'number',
          min: 0,
          max: 100,
          step: 1,
        },
        defaultValue: 0,
      },
      {
        key: 'home_penalty',
        type: 'core-touchspin',
        props: {
          label: `${this.match.home_team_name} ${this._translateService.instant(
            'penalty score'
          )}`,
          type: 'number',
          min: 0,
          max: 100,
          step: 1,
        },
        expressions: {
          hide: `model.type != '${AppConfig.TOURNAMENT_TYPES.knockout}' || model.home_score != model.away_score`,
        },
      },
      {
        key: 'away_penalty',
        type: 'core-touchspin',
        props: {
          label: `${this.match.away_team_name} ${this._translateService.instant(
            'penalty score'
          )}`,
          type: 'number',
          min: 0,
          max: 100,
          step: 1,
        },
        expressions: {
          hide: `model.type != '${AppConfig.TOURNAMENT_TYPES.knockout}' || model.home_score != model.away_score`,
        },
      },
    ];
  }

  onSubmit(model) {
    console.log(model);
    console.log('form', this.form);

    if (this.form.invalid) {
      return;
    }
    this._tournamentService.updateMatch(model).subscribe((res) => {
      console.log(res);
      this.onUpdated.emit(res);
      this.close();
    });
  }

  close() {
    this._modalService.dismissAll();
  }
}
