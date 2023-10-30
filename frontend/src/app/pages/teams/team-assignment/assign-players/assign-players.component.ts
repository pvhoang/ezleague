import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from 'app/app-config';
import { CommonsService } from 'app/services/commons.service';
import { RegistrationService } from 'app/services/registration.service';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { LoadingService } from 'app/services/loading.service';
import { TeamService } from 'app/services/team.service';
import { AvailablePlayerModalComponent } from '../assign-players/available-player-modal/available-player-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-players',
  templateUrl: './assign-players.component.html',
  styleUrls: ['./assign-players.component.scss'],
})
export class TeamPlayersComponent implements AfterViewInit, OnInit {
  onSubmitted: EventEmitter<any> = new EventEmitter();
  public teamId: any;
  private unlistener: () => void;

  public availablePlayers = AvailablePlayerModalComponent;

  public seasonId: any;
  public clubId: any;
  public groupId: any;
  @ViewChild('modalValidator') modalValidator: TemplateRef<any>;
  dtOptions: any = {};
  dtTrigger: any = {};
  public modalRef: any;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  isProcessing: boolean = false;
  constructor(
    private route: ActivatedRoute,
    public _router: Router,
    public _commonsService: CommonsService,
    public _http: HttpClient,
    public _translateService: TranslateService,
    public renderer: Renderer2,
    public _teamService: TeamService,
    public _modalService: NgbModal,
    public _loadingService: LoadingService,
    public _toastService: ToastrService
  ) {
    this.seasonId = this.route.snapshot.paramMap.get('seasonId');
    this.teamId = this.route.snapshot.paramMap.get('teamId');

    this.route.queryParams.subscribe((params) => {
      this.clubId = params['clubId'];
      this.groupId = params['groupId'];
    });
  }

  ngOnInit(): void {
    $.fx.off = true; //this is for disable jquery animation

    let team_player_url = `${environment.apiUrl}/teams/${this.teamId}/players`;
    let current_season_player_url = `${environment.apiUrl}/registrations/club-group-approved`;
    let params = {
      season_id: this.seasonId,
      club_id: this.clubId,
      group_id: this.groupId,
    };

    // this.dtOptions[0] = this.buildDtOptions1(current_season_player_url, params, buttons_assign);
    this.dtOptions = this.buildDtOptions(team_player_url, false);
  }

  buildDtOptions(url, params: any, buttons?: any[]) {
    return {
      dom: this._commonsService.dataTableDefaults.dom,
      ajax: (dataTablesParameters: any, callback) => {
        if (params) {
          dataTablesParameters['season_id'] = parseInt(params.season_id);
          dataTablesParameters['club_id'] = parseInt(params.club_id);
          dataTablesParameters['group_id'] = parseInt(params.group_id);
        }
        this._http
          .post<any>(`${url}`, dataTablesParameters)
          .subscribe((resp: any) => {
            callback({
              // this function callback is used to return data to datatable
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data,
            });
          });
      },

      select: 'single',
      // serverSide: true,
      rowId: 'id',
      // fake data
      responsive: true,
      scrollX: false,
      language: this._commonsService.dataTableDefaults.lang,
      lengthMenu: this._commonsService.dataTableDefaults.lengthMenu,
      displayLength: -1,
      columnDefs: [
        { responsivePriority: 1, targets: -1 },
        { responsivePriority: 2, targets: 0 },
        { responsivePriority: 3, targets: 1 },
      ],
      columns: [
        {
          //photo
          data: 'player.photo',
          render: (data, type, row) => {
            if (data) {
              return `<img src="${data}" width="50px" height="70px" />`;
            } else {
              return `<img src="assets/images/avatars/default.png" width="50px" height="70px" />`;
            }
          },
        },
        {
          // name
          data: null,
          className: 'font-weight-bolder',
          render: (data, type, row) => {
            row = row.player;
            if (row.user.first_name && row.user.last_name) {
              return row.user.first_name + ' ' + row.user.last_name;
            } else {
              return '';
            }
          },
        },
        {
          //year
          data: 'player.dob',
          render: (data, type, row) => {
            return new Date(data).getFullYear();
          },
        },
        {
          //gender
          data: 'player.gender',
          render: (data, type, row) => {
            return data == 'Male'
              ? this._translateService.instant('Male')
              : this._translateService.instant('Female');
          },
        },

        {
          data: 'player.id',
          render: (data, type, row) => {
            return (
              `<button class="btn btn-outline-danger btn-sm" 
            data-row = '${JSON.stringify(row)}'
            action="remove">` +
              '<i class="fa-solid fa-xmark"></i>&nbsp;' +
              this._translateService.instant('Remove') +
              `</button>`
            );
          },
        },
      ],
      buttons: [],
    };
  }

  assignPlayerToTeam() {
    // open modal
    const modalRef = this._modalService.open(AvailablePlayerModalComponent, {
      size: 'lg',
      backdrop: 'static',
      // click outside modal to close
      centered: true,
      keyboard: true,
      // close button
    });

    modalRef.componentInstance.params = {
      team_id: this.teamId,
      season_id: this.seasonId,
      club_id: this.clubId,
      group_id: this.groupId,
    };

    modalRef.result.then(
      (result) => {
        // reload datatable
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.ajax.reload();
        });
      },
      (reason) => {
        // reload datatable
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.ajax.reload();
        });
      }
    );
  }

  submitTeamSheet() {
    // this.onSubmitted.emit();
    Swal.fire({
      title: this._translateService.instant('Are you sure?'),
      html:
        `<div class="text-center">
              <img src="assets/images/alerts/r_u_sure.svg" width="200px" height="149px">
              <p class="text-center">` +
        this._translateService.instant('ask_want_to_submit_teamsheet') +
        `</p>
            </div>`,
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonText: this._translateService.instant('Yes'),
      confirmButtonColor: '#3085d6',
      cancelButtonText:
        '<span class="text-primary">' +
        this._translateService.instant('No') +
        '</span>',
      cancelButtonColor: '#d33',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary mr-1',
        cancelButton: 'btn btn-outline-primary mr-1',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('submit team sheet');
        this._loadingService.show();
        this._teamService.submitTeamSheet(this.teamId).subscribe(
          (resp) => {
            this._loadingService.dismiss();
            // reload datatable
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.ajax.reload();
            });
            console.log('resp', resp);
            this._toastService.success(
              this._translateService.instant(
                'Team sheet submitted successfully'
              )
            );
          },
          (err) => {
            this._loadingService.dismiss();
            Swal.fire({
              title: 'Warning!',
              icon: 'warning',
              text: err.message,
              confirmButtonText: this._translateService.instant('OK'),
            });
          }
        );
      }
    });
  }

  editor(action, row, target = null) {
    this.isProcessing = true;
    switch (action) {
      case 'remove':
        Swal.fire({
          title: this._translateService.instant('Are you sure?'),
          html:
            `
        <div class="text-center">
          <img src="assets/images/alerts/are_you_sure.svg" width="200px" height="149px">
          <p class="text-center">` +
            this._translateService.instant('ask_want_to_remove_player') +
            `
          </p>
        </div>`,
          reverseButtons: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: this._translateService.instant('Yes'),
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          // cancel buton text color
          cancelButtonText: this._translateService.instant('Cancel'),
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-danger mr-1',
            cancelButton: 'btn btn-outline-primary mr-1',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            let row_id = row.id;
            let player_id = row.player.id;
            let params: FormData = new FormData();
            params.append('action', 'remove');
            params.append('data[' + row_id + '][team_id]', this.teamId);
            params.append('data[' + row_id + '][player_id]', player_id);

            this._teamService.editorTableTeamPlayers(params).subscribe(
              (resp: any) => {
                if (resp) {
                  this._toastService.success(
                    this._translateService.instant(
                      'Player removed successfully'
                    )
                  );
                }

                // reload
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  dtInstance.ajax.reload();
                  setTimeout(() => {
                    this.toggleRemoveButton(target, false);
                  }, 1000);
                });
              },
              (err) => {
                this.toggleRemoveButton(target, false);
                let message = '';
                if (err.hasOwnProperty('error')) {
                  if (typeof err.error === 'string') {
                    message = err.error;
                  } else {
                    message = err.error[0];
                  }
                } else {
                  message = err.message;
                }
                Swal.fire({
                  title: 'Warning!',
                  icon: 'warning',
                  html: message,
                  confirmButtonText: this._translateService.instant('OK'),
                });
              }
            );
          } else {
            this.toggleRemoveButton(target, false);
          }
        });
        break;

      default:
        break;
    }
  }

  toggleRemoveButton(target, action) {
    if (action) {
      this.isProcessing = true;
      target.setAttribute('disabled', 'disabled');
    } else {
      this.isProcessing = false;
      target.removeAttribute('disabled');
    }
  }

  ngAfterViewInit(): void {
    this.unlistener = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('data-row')) {
        let target = event.target;
        let row = target.getAttribute('data-row');
        row = JSON.parse(row);
        this.editor(target.getAttribute('action'), row, target);
        // disable remove button
        target.setAttribute('disabled', 'disabled');
      }
    });
  }
}
