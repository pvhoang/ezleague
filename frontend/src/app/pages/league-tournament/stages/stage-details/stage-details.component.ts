import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from 'app/app-config';
import { StageService } from 'app/services/stage.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'stage-details',
  templateUrl: './stage-details.component.html',
  styleUrls: ['./stage-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StageDetailsComponent implements OnInit {
  @Input() stage: any;
  constructor(
    public _trans: TranslateService,
    public _stageService: StageService,
    private _translateService: TranslateService,
    public toastService: ToastrService
  ) {}
  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[];
  ngOnInit(): void {
    // console.log(this.stage);
    this.model = this.stage;
    switch (this.stage.type) {
      case AppConfig.TOURNAMENT_TYPES.groups:
      // break;
      case AppConfig.TOURNAMENT_TYPES.league:
        this.fields = [
          {
            key: 'name',
            type: 'input',
            props: {
              maxLength: 30,
              label: this._trans.instant('Stage name'),
              placeholder: this._trans.instant('Enter stage name'),
              pattern: /[\S]/,
              required: true,
            },
          },
          {
            key: 'is_released',
            type: 'checkbox',
            props: {
              label: this._trans.instant('Release'),
              required: true,
            },
          },
          {
            key: 'is_display_tbd',
            type: 'checkbox',
            props: {
              label: this._trans.instant('Display TBD'),
              required: true,
            },
          },
          {
            key: 'no_encounters',
            type: 'core-touchspin',
            props: {
              type: 'number',
              min: 1,
              max: 3,
              label: this._trans.instant('Number of encounters'),
              required: true,
            },
          },
          {
            key: 'points_win',
            type: 'core-touchspin',
            props: {
              type: 'number',
              min: 0,
              max: 100,
              label: this._trans.instant('Points for win'),
              required: true,
            },
          },
          {
            key: 'points_draw',
            type: 'core-touchspin',
            props: {
              type: 'number',
              min: 0,
              max: 100,
              label: this._trans.instant('Points for draw'),
              required: true,
            },
          },
          {
            key: 'points_loss',
            type: 'core-touchspin',
            props: {
              type: 'number',
              min: 0,
              max: 100,
              label: this._trans.instant('Points for loss'),
              required: true,
            },
          },
          {
            key: 'ranking_criteria',
            type: 'radio',
            wrappers: ['details', 'form-field'],
            props: {
              label: this._trans.instant('Tie break order'),
              required: true,
              options: [
                {
                  value: AppConfig.RANKING_CRITERIA.total,
                  label: this._trans.instant(AppConfig.RANKING_CRITERIA.total),
                  description: `<div class="text-secondary text-12px">
                  1. ${this._trans.instant('Points')} - ${this._trans.instant('Total')}<br>
                  2. ${this._trans.instant('Goal difference')} - ${this._trans.instant('Total')}<br>
                  3. ${this._trans.instant('Goals scored')} - ${this._trans.instant('Total')}<br>
                  4. ${this._trans.instant('Points')} - ${this._trans.instant('Head to Head')}<br>
                  5. ${this._trans.instant('Goal difference')} - ${this._trans.instant('Head to Head')}<br>
                  6. ${this._trans.instant('Goals scored')} - ${this._trans.instant('Head to Head')}</div>`,
                },
                {
                  value: AppConfig.RANKING_CRITERIA.direct_matches,
                  label: this._trans.instant(
                    AppConfig.RANKING_CRITERIA.direct_matches
                  ),
                  description: `<div class="text-secondary text-12px">
                  1. ${this._trans.instant('Points')} - ${this._trans.instant('Total')}<br> 
                  2. ${this._trans.instant('Points')} - ${this._trans.instant('Head to Head')}<br> 
                  3. ${this._trans.instant('Goal difference')} - ${this._trans.instant('Head to Head')}<br>
                  4. ${this._trans.instant('Goals scored')} - ${this._trans.instant('Head to Head')}<br>
                  5. ${this._trans.instant('Goal difference')} - ${this._trans.instant('Total')}<br>
                  6. ${this._trans.instant('Goals scored')} - ${this._trans.instant('Total')}</div>`,
                },
              ],
            },
          },
        ];
        break;
      case AppConfig.TOURNAMENT_TYPES.knockout:
        this.fields = [
          {
            key: 'name',
            type: 'input',
            props: {
              maxLength: 15,
              label: this._trans.instant('Stage name'),
              placeholder: this._trans.instant('Enter stage name'),
              required: true,
            },
          },
          {
            key: 'is_released',
            type: 'checkbox',
            props: {
              label: this._trans.instant('Release'),
              required: true,
            },
          },
          {
            key: 'is_display_tbd',
            type: 'checkbox',
            props: {
              label: this._trans.instant('Display TBD'),
              required: true,
            },
          },
          {
            key: 'third_place',
            type: 'checkbox',
            props: {
              label: `${this._trans.instant('Third place')}?`,
              required: true,
            },
          },
          // {
          //   key: 'no_encounters',
          //   type: 'radio',
          //   props: {
          //     label: this._trans.instant('Mode'),
          //     required: true,
          //     options: [
          //       {
          //         value: AppConfig.KNOCKOUT_MODES.single.value,
          //         label: AppConfig.KNOCKOUT_MODES.single.label,
          //       },
          //       {
          //         value: AppConfig.KNOCKOUT_MODES.double.value,
          //         label: AppConfig.KNOCKOUT_MODES.double.label,
          //       },
          //     ],
          //   },
          // },
        ];
        break;
      default:
        break;
    }
  }

  onSubmit(model) {
    if (this.form.invalid) {
      return;
    }
    // create FormData object
    const formData = new FormData();
    formData.append('action', 'edit');
    // foreach key in model add to formData object. e.g. formData.append('data[id][name]', 'value')
    Object.keys(model).forEach((key) => {
      formData.append(`data[${this.stage.id}][${key}]`, model[key]);
    });

    // send form data to server
    this._stageService.updateStage(formData).subscribe(
      (res) => {
        // console.log(res);
        this.toastService.success(
          this._trans.instant('Stage updated successfully!')
        );
      },
      (err) => {
        console.log(err);
        Swal.fire({
          title: 'Warning',
          text: err.message,
          icon: 'error',
          confirmButtonText: this._translateService.instant('OK'),
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      }
    );
  }
}
