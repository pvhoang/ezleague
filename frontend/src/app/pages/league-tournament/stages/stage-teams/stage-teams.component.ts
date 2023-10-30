import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { CommonsService } from 'app/services/commons.service';
import { LoadingService } from 'app/services/loading.service';
import { StageService } from 'app/services/stage.service';
import { TeamService } from 'app/services/team.service';
import { TournamentService } from 'app/services/tournament.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { EZBtnActions } from 'app/components/btn-dropdown-action/btn-dropdown-action.component';
import { AppConfig } from 'app/app-config';
import { ToastrService } from 'ngx-toastr';
// sweet alert
import Swal from 'sweetalert2';
import { ModalAddGroupTeamComponent } from './modal-add-group-team/modal-add-group-team.component';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'stage-teams',
  templateUrl: './stage-teams.component.html',
  styleUrls: ['./stage-teams.component.scss'],
})
export class StageTeamsComponent implements OnInit {
  @Input() stage: any;
  @Input() tournament: any;
  @Input() group_stages: any = [];
  @Input() allowEditTeam = true;
  @Output() onDataChange: EventEmitter<any> = new EventEmitter<any>();
  stage_type: any = null;
  team_by_group: any = [];
  team_id = null;
  groups: any = [];
  AppConfig = AppConfig;
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'group_name',
      type: 'input',
      props: {
        label: '',
        placeholder: 'Group name',
        required: true,
        maxLength: 20,
      },
    },
  ];

  constructor(
    public _trans: TranslateService,
    public _route: ActivatedRoute,
    public _router: Router,
    public _tournamentService: TournamentService,
    public _teamService: TeamService,
    public _stageService: StageService,
    public _loadingService: LoadingService,
    public _toastrService: ToastrService,
    public _translateService: TranslateService,
    public _commonsService: CommonsService,
    public _modalService: NgbModal,
    public _http: HttpClient
  ) {}

  ngOnInit(): void {
    this.stage_type = this.stage.type;
    this.getTeamsByGroup();
  }

  getTeamByGroup(group_id) {
    return this._teamService
      .getTeamNotInStage(this.stage.id, group_id)
      .toPromise();
  }

  removeTeamFromStage(stage_team, action) {
    let params = new FormData();
    params.append('action', action);
    params.append('data[' + stage_team.id + '][stage_id]', stage_team.stage_id);
    params.append('data[' + stage_team.id + '][team_id]', stage_team.team_id);
    params.append('data[' + stage_team.id + '][group]', stage_team.group);
    return this._stageService.removeTeamFromStage(params).toPromise();
  }

  removeTeam(stage_team, action) {
    Swal.fire({
      title: this._translateService.instant('Are you sure?'),
      html:
        `
        <div class="text-center">
        <img src="assets/images/ai/warning.svg" alt="Frame" width="200px" height="149px">

        <p class="text-center"> ` +
        this._translateService.instant(
          'You will not be able to recover this team'
        ) +
        `      
        </p>
      </div>
        `,
      showCancelButton: true,
      confirmButtonText: this._translateService.instant('Yes'),
      cancelButtonText: this._translateService.instant('No'),
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          this.removeTeamFromStage(stage_team, action).then((res: any) => {
            if (res) {
              this.getTeamsInStage();
              this.getTeamsByGroup();
              Swal.fire({
                title: this._translateService.instant('Success'),
                text: this._translateService.instant(
                  'Team removed successfully'
                ),
                icon: 'success',
                confirmButtonText: this._translateService.instant('OK'),
                confirmButtonColor: '#3085d6',
              }).then((result) => {
                if (result.isConfirmed) {
                }
              });
            } else {
              Swal.fire({
                title: this._translateService.instant('Error'),
                text: this._translateService.instant('Team not removed'),
                icon: 'error',
                confirmButtonText: this._translateService.instant('OK'),
                confirmButtonColor: '#3085d6',
              });
            }
          });
        });
      },
    });
  }

  changeTeam(stage_team, action) {
    this.getTeamByGroup(this.tournament.group_id).then((res: any) => {
      res = res.data;
      if (res) {
        // sort by name
        res.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        let options = '';
        res.forEach((team) => {
          options += `<option value="${team.id}">${team.name}</option>`;
        });
        // pop up to select team
        Swal.fire({
          title: this._translateService.instant('Select team to change'),
          html: `<select class="form-control" id="team_id">
        ${options}
        </select>`,
          showCancelButton: true,
          confirmButtonText: this._translateService.instant('Change'),
          cancelButtonText: this._translateService.instant('Cancel'),
          reverseButtons: true,
          showLoaderOnConfirm: true,
          preConfirm: () => {
            return new Promise((resolve) => {
              let team_id = (<HTMLInputElement>(
                document.getElementById('team_id')
              )).value;
              let params = new FormData();
              params.append('action', action);
              params.append(
                'data[' + stage_team.id + '][stage_id]',
                stage_team.stage_id
              );
              params.append('data[' + stage_team.id + '][team_id]', team_id);

              if (stage_team.group) {
                params.append(
                  'data[' + stage_team.id + '][group]',
                  stage_team.group
                );
              }

              this._stageService.changeTeamInStage(params).subscribe(
                (res: any) => {
                  if (res) {
                    Swal.fire({
                      title: this._translateService.instant('Success'),
                      html:
                        `
                      <div class="text-center">
                      <img src="assets/images/ai/done.svg" alt="Frame" width="200px" height="149px">
              
                      <p class="text-center"> ` +
                        this._translateService.instant(
                          'Team changed successfully'
                        ) +
                        `      
                      </p>
                    </div>
                      `,
                      confirmButtonText: this._translateService.instant('OK'),
                      confirmButtonColor: '#3085d6',
                    }).then((result) => {
                      this.getTeamsInStage();
                    });
                  } else {
                    Swal.fire({
                      title: 'Error',
                      text: 'Team not changed',
                      icon: 'error',
                      confirmButtonText: this._translateService.instant('OK'),
                      confirmButtonColor: '#3085d6',
                    });
                  }
                },
                (error) => {
                  console.log('error', error);
                  Swal.fire({
                    title: 'Error',
                    text: 'Dublicate Team Error',
                    icon: 'error',
                    confirmButtonText: this._translateService.instant('OK'),
                    confirmButtonColor: '#3085d6',
                  });
                }
              );
            });
          },
        });
      }
    });
  }

  addGroupTeam() {
    if (this.allowEditTeam == false) {
      Swal.fire({
        title: this._translateService.instant('Error'),
        text: this._translateService.instant(
          'You must remove all schedule before add team'
        ),
        icon: 'error',
        confirmButtonText: this._translateService.instant('OK'),
        confirmButtonColor: '#3085d6',
      });

      return;
    }
    this.openModalAddTeam();
  }

  getTeamsByGroup() {
    if (!this.tournament.group_id) return;
    this.getTeamByGroup(this.tournament.group_id).then((res: any) => {
      res = res.data;
      if (res) {
        this.team_by_group = res;
      }
    });
  }

  openModalAddTeam() {
    if (this.team_by_group.length == 0) {
      return;
    }

    const modalRef = this._modalService.open(ModalAddGroupTeamComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-add-group-team',
    });
    if (this.team_by_group) {
      modalRef.componentInstance.teams = this.team_by_group;
      modalRef.componentInstance.stage_type = this.stage_type;

      // get current group
      let current_group = [];
      this.group_stages.forEach((group) => {
        current_group.push(group[0].group);
      });

      modalRef.componentInstance.current_group = current_group;
      modalRef.result.then((result) => {
        if (result) {
          let group_name =
            this.stage_type == 'Groups' ? result.group_name : null;
          let selected_team: any = result.selected_team;
          selected_team = selected_team.join(',');
          let params = new FormData();
          params.append('stage_id', this.stage.id);
          if (this.stage_type == 'Groups') {
            params.append('group', group_name);
          }
          params.append('teams', selected_team);

          this._stageService
            .createTeamMultiple(params)
            .subscribe((res: any) => {
              if (res) {
                this.getTeamsByGroup();
                Swal.fire({
                  title: this._translateService.instant('Success'),
                  html:
                    `
                  <div class="text-center">
                    <img src="assets/images/ai/done.svg" alt="Frame" width="200px" height="149px">
                    <p class="text-center"> ` +
                    this._translateService.instant('Teams added successfully') +
                    `      
                    </p>
                  </div>`,
                  confirmButtonText: this._translateService.instant('OK'),
                  confirmButtonColor: '#3085d6',
                }).then((result) => {
                  this.getTeamsInStage();
                });
              } else {
                Swal.fire({
                  title: 'Error',
                  text: 'Team not added',
                  icon: 'error',
                  confirmButtonText: this._translateService.instant('OK'),
                  confirmButtonColor: '#3085d6',
                });
              }
            });
        }
      });
    }
  }

  removeGroup(group_stage) {
    console.log('removeGroup');
    let teams: any = [];
    group_stage.forEach((group) => {
      teams.push(group.team_id);
    });

    // implode teams

    Swal.fire({
      title: this._translateService.instant('Are you sure?'),
      html:
        ` 
      <div class="text-center">
        <img src="assets/images/ai/warning.svg" alt="Frame" width="200px" height="149px">
        <p class="text-center"> ` +
        this._translateService.instant(
          'You will not be able to recover this group'
        ) +
        `
        </p>
      </div>
      
      `,
      showCancelButton: true,
      confirmButtonText: this._translateService.instant('Yes'),
      cancelButtonText: this._translateService.instant('No'),
      reverseButtons: true,
    }).then((result) => {
      let stage_id = group_stage[0].stage_id;
      let group = group_stage[0].group;
      teams = teams.join(',');

      let params = new FormData();
      // stage_id: 139
      // group: A
      // teams: 7, 8, 9
      params.append('stage_id', stage_id);
      params.append('group', group);
      params.append('teams', teams);
      if (result.value) {
        this._stageService.removeTeamMultiple(params).subscribe((res: any) => {
          if (res) {
            Swal.fire({
              title: this._translateService.instant('Success'),
              text: this._translateService.instant(
                'Group removed successfully'
              ),
              icon: 'success',
              confirmButtonText: this._translateService.instant('OK'),
              confirmButtonColor: '#3085d6',
            }).then((result) => {
              this._loadingService.show();
              setTimeout(() => {
                this.getTeamsInStage();
              }, 400);
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: this._translateService.instant('Group not removed'),
              icon: 'error',
              confirmButtonText: this._translateService.instant('OK'),
              confirmButtonColor: '#3085d6',
            });
          }
        });
      }
    });
  }

  removeAllTeam(group_stage) {
    console.log('removeAllTeam');
    let teams: any = [];
    group_stage.forEach((group) => {
      teams.push(group.team_id);
    });

    Swal.fire({
      title: this._translateService.instant('Are you sure?'),
      html:
        `
      <div class="text-center">
        <img src="assets/images/ai/warning.svg" alt="Frame" width="200px" height="149px">

        <p class="text-center"> ` +
        this._translateService.instant(
          'You are about to remove all teams in this group'
        ) +
        `      
        </p>
      </div>`,
      showCancelButton: true,
      confirmButtonText: this._translateService.instant('Yes'),
      cancelButtonText: this._translateService.instant('No'),
      reverseButtons: true,
    }).then((result) => {
      let stage_id = group_stage[0].stage_id;
      teams = teams.join(',');

      let params = new FormData();
      // stage_id: 139
      // teams: 7, 8, 9
      params.append('stage_id', stage_id);
      params.append('teams', teams);

      if (result.value) {
        this._stageService.removeTeamMultiple(params).subscribe((res: any) => {
          if (res) {
            this.getTeamsByGroup();
            Swal.fire({
              title: 'Success',
              text: 'Teams removed successfully',
              icon: 'success',
              confirmButtonText: this._translateService.instant('OK'),
              confirmButtonColor: '#3085d6',
            }).then((result) => {
              if (result.isConfirmed) {
                this._loadingService.show();
                setTimeout(() => {
                  this.getTeamsInStage();
                }, 400);
              }
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Teams not removed',
              icon: 'error',
              confirmButtonText: this._translateService.instant('OK'),
              confirmButtonColor: '#3085d6',
            });
          }
        });
      }
    });
  }
  public getTeamsInStage() {
    this._stageService.getTeamsInStage(this.stage.id).subscribe((res: any) => {
      this.group_stages = res.data;
      this.onDataChange.emit(this.group_stages);
    });
    this._loadingService.dismiss();
  }

  public rowActions: EZBtnActions[] = [
    {
      type: 'collection',
      buttons: [
        {
          label: 'Change team',

          icon: 'fa-regular fa-pen-to-square',
        },
        {
          label: 'Delete',

          icon: 'fa-regular fa-trash',
        },
      ],
    },
  ];

  checkTeamAlreadyInStage(teams) {
    return new Promise((resolve, reject) => {
      // check if teams are already in stage
      this._teamService
        .getTeamListInStage(this.stage.id)
        .subscribe((res: any) => {
          let teams_in_stage: any = res.data;
          teams_in_stage.sort((a, b) => a.id - b.id);
          teams_in_stage = teams_in_stage.map((team) => team.id);
          let list_teams_in_stage = teams_in_stage.join(',');
          let list_teams = teams.join(',');
          if (list_teams == list_teams_in_stage) {
            console.log('teams already imported');
            resolve(false);
          } else {
            // find the teams that are not in stage
            let teams_not_in_stage = teams.filter(
              (team) => !teams_in_stage.includes(team)
            );
            resolve(teams_not_in_stage);
          }
        });
    });
  }

  sortBy(stage_teams) {
    stage_teams.sort((a, b) => a.team.name.localeCompare(b.team.name));
    return stage_teams;
  }

  importTeams() {
    this._stageService
      .getDataByTournament(this.tournament.id)
      .subscribe((res: any) => {
        let stages = res.data;
        stages = stages.filter((stage) => stage.type == 'Groups');

        Swal.fire({
          title:
            this._translateService.instant('Do you want to import teams from') +
            ' ' +
            this.tournament.name +
            ' ' +
            stages[0].name +
            '? ',
          showCancelButton: true,
          cancelButtonText: this._translateService.instant('No'),
          confirmButtonText: this._translateService.instant('Yes'),
        }).then((result) => {
          if (result.isConfirmed) {
            let stage_id = stages[0].id;
            // get teams from stages
            this._teamService
              .getTeamListInStage(stage_id)
              .subscribe((res: any) => {
                let teams: any = res.data;
                teams.sort((a, b) => a.id - b.id);
                teams = teams.map((team) => team.id);

                // check if teams are already in stage
                this.checkTeamAlreadyInStage(teams).then((res) => {
                  if (res) {
                    teams = res;
                    // sort teams by name
                    let params = new FormData();
                    teams = teams.join(',');
                    params.append('stage_id', this.stage.id);
                    params.append('teams', teams);
                    this._stageService
                      .createTeamMultiple(params)
                      .subscribe((res: any) => {
                        if (res) {
                          Swal.fire({
                            title: 'Success',
                            text: 'Teams imported successfully',
                            icon: 'success',
                            confirmButtonText:
                              this._translateService.instant('OK'),
                            confirmButtonColor: '#3085d6',
                          }).then((result) => {
                            if (result.isConfirmed) {
                              this._loadingService.show();
                              setTimeout(() => {
                                this._stageService
                                  .getTeamsInStage(this.stage.id)
                                  .subscribe((res: any) => {
                                    this.group_stages = res.data;

                                    this._loadingService.dismiss();
                                  });
                              }, 400);
                            }
                          });
                        } else {
                          Swal.fire({
                            title: 'Error',
                            text: 'Teams not imported',
                            icon: 'error',
                            confirmButtonText:
                              this._translateService.instant('OK'),
                            confirmButtonColor: '#3085d6',
                          });
                        }
                      });
                  } else {
                    Swal.fire({
                      title: 'Error',
                      text: 'Teams already imported',
                      icon: 'error',
                      confirmButtonText: this._translateService.instant('OK'),
                      confirmButtonColor: '#3085d6',
                    });
                  }
                });
              });
          }
        });
      });
  }

  groupStage;
  openModalEdit(content, groupStage) {
    this.groupStage = groupStage;
    if (this.groupStage.group) {
      this.model = {
        group_name: this.groupStage.group,
      };
    }
    this._modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {
          this.groupStage = null;
        },
        (reason) => {
          this.groupStage = null;
        }
      );
  }

  onEdit(model) {
    this.groupStage;
    console.log(model);
    console.log(this.groupStage);
    if(this.form.invalid || !this.groupStage) return;
    let params = new FormData();
    params.append('stage_id', this.groupStage.stage_id);
    params.append('old_group', this.groupStage.group.toString());
    params.append('group', model.group_name);
    params.append('all_teams_in_groups', 'true');
    this._stageService.editGroup(params).subscribe(
      (res: any) => {
        if (res) {
          this._toastrService.success(
            this._translateService.instant('Update group successfully')
          );
          this._modalService.dismissAll();
          // reload data
          this.getTeamsInStage();
        } else {
          Swal.fire({
            title: 'Error',
            text: this._translateService.instant('Update teams group failed'),
            icon: 'error',
            confirmButtonText: this._translateService.instant('OK'),
            confirmButtonColor: '#3085d6',
          });
        }
      },
      (error) => {
        Swal.fire({
          title: 'Update teams group failed',
          text: error.message,
          icon: 'error',
          confirmButtonText: this._translateService.instant('OK'),
          confirmButtonColor: '#3085d6',
        });
      }
    );
  }
}
