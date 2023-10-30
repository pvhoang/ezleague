import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from 'app/app-config';
import { TeamService } from 'app/services/team.service';
import { TournamentService } from 'app/services/tournament.service';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-update-match-details',
  templateUrl: './update-match-details.component.html',
  styleUrls: ['./update-match-details.component.scss'],
})
export class UpdateMatchDetailsComponent implements OnInit {
  @Input() team_id: any;
  @Input() match: any;
  @Output() onUpdated = new EventEmitter();
  fields = [
    {
      key: 'type',
      type: 'radio',
      props: {
        required: true,
        label: this._translateService.instant('Type'),
        options: [
          {
            value: AppConfig.MATCH_DETAIL_TYPES.goal,
            label: this._translateService.instant('Goal'),
          },
          {
            value: AppConfig.MATCH_DETAIL_TYPES.yellow_card,
            label: this._translateService.instant('Yellow card'),
          },
          {
            value: AppConfig.MATCH_DETAIL_TYPES.red_card,
            label: this._translateService.instant('Red card'),
          },
        ],
      },
      defaultValue: AppConfig.MATCH_DETAIL_TYPES.goal,
    },
    {
      key: 'team_player_id',
      type: 'select',

      props: {
        required: true,
        label: this._translateService.instant('Select Player'),
        placeholder: this._translateService.instant('Select Player'),
        options: [],
      },
    },
    {
      key: 'time',
      type: 'input',
      props: {
        required: true,
        label: this._translateService.instant('Time'),
        type: 'number',
        min: 0,
        max: 255,
      },
      defaultValue: 0,
    },
    {
      key: 'note',
      type: 'input',
      props: {
        label: this._translateService.instant('Note'),
        type: 'text',
        placeholder: this._translateService.instant('Note'),
      },
    },
  ];
  constructor(
    public _translateService: TranslateService,
    public _modalService: NgbModal,
    public _tournamentService: TournamentService,
    public _teamService: TeamService
  ) {}
  form = new FormGroup({});
  model: any;
  ngOnInit(): void {
    this.model = {
      match_id: this.match.id,
    };
    this.getPlayers();
  }

  onSubmit(model) {
    console.log(model);
    console.log('form', this.form);

    if (this.form.invalid) {
      return;
    }
    this._tournamentService.updateMatchDetails(model).subscribe((res) => {
      console.log(res);
      this._modalService.dismissAll();
      this.onUpdated.emit(res);
      // dissmiss modal

    });
  }

  getPlayers() {
    this._teamService.getOptionsPlayer(this.team_id).subscribe((res) => {
      // find field has key team_player_id and set options
      const field = this.fields.find((f) => f.key === 'team_player_id');
      field.props.options = res;
    });
  }
  close() {
    this._modalService.dismissAll();
  }
}
