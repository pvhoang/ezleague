import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TeamService } from 'app/services/team.service';
import { AppConfig } from 'app/app-config';

@Component({
  selector: 'app-modal-add-group-team',
  templateUrl: './modal-add-group-team.component.html',
  styleUrls: ['./modal-add-group-team.component.scss'],
})
export class ModalAddGroupTeamComponent implements OnInit {
  @Input() teams: any;
  @Input() selected_team: any = null;
  @Input() stage_type: any = null;
  @Input() group_name: string = '';
  @Input() current_group: any;
  AppConfig = AppConfig;

  groupNameOptions = [];

  selectedGroupName: any = null;

  groupForm = new FormGroup({
    group_name: new FormControl(null, [
      Validators.required,
      Validators.maxLength(20),
    ]),
    selected_team: new FormControl(null, Validators.required), // add the selected_team form control
  });

  constructor(
    private _teamService: TeamService,
    private _activeModal: NgbActiveModal,
    private _translateService: TranslateService
  ) {}

  getTeamByGroup(group_id) {
    let teams = [];
    this._teamService.getTeamByGroup(group_id).subscribe(
      (res: any) => {
        teams = res.data;
        // if team is already in stage, remove it
        this.teams.forEach((stage) => {
          teams = teams.filter((team) => {
            return team.id != stage.team_id;
          });
        });
      },
      (err) => {
        console.log('err', err);
      }
    );
  }

  createNew(group) {
    // max length of group name is 20
    if (group.length > 20) {
      group = group.substring(0,20);
    }
    return group;
  }

  onClose() {
    this.teams = [];
    this._activeModal.close();
  }

  onSubmit() {
    if (this.groupForm.valid) {
      // submit the form data
      this._activeModal.close(this.groupForm.value);
    } else {
      // show validation errors
      // console.log('this.stage_type', this.stage_type);
      if (this.stage_type != 'Groups') {
        this.groupForm.get('group_name').disable();
        // check again if form is valid
        if (this.groupForm.valid) {
          this._activeModal.close(this.groupForm.value);
        }
      }
      this.groupForm.markAllAsTouched();
    }
  }
  selectAllTeam() {
    // select all team in ng-select
    this.groupForm
      .get('selected_team')
      .setValue(this.teams.map((team) => team.id));
  }

  groupPlaceholder = this._translateService.instant(
    "'Select' or 'Type new' the Group Name"
  );
  teamPlaceholder = this._translateService.instant('Choose teams for group');
  ngOnInit(): void {
    // console.log('this.current_group', this.current_group);
    // console.log('team', this.teams);
    this.current_group.forEach((group) => {
      this.groupNameOptions.push({
        label: group,
        value: group,
      });
    });
  }
}
