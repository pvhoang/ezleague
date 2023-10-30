import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonsService } from 'app/services/commons.service';
import { LoadingService } from 'app/services/loading.service';
import { TeamService } from 'app/services/team.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-available-player-modal',
  templateUrl: './available-player-modal.component.html',
  styleUrls: ['./available-player-modal.component.scss'],
})
export class AvailablePlayerModalComponent implements OnInit {
  dtOptions1: any = {};
  dtTrigger: any = {};
  public params: any;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;

  constructor(
    public modalService: NgbModal,
    public _translateService: TranslateService,
    public _commonsService: CommonsService,
    public _http: HttpClient,
    public renderer: Renderer2,
    public _teamService: TeamService,
    public loadingService: LoadingService,
    public toastService: ToastrService
  ) {}

  ngOnInit(): void {
    let params = this.params;

    let current_season_player_url = `${environment.apiUrl}/registrations/club-group-approved`;

    this.dtOptions1 = this.buildDtOptions1(current_season_player_url, params);
  }

  buildDtOptions1(url, params: any) {
    return {
      dom: this._commonsService.dataTableDefaults.dom,
      ajax: (dataTablesParameters: any, callback) => {
        if (params) {
          dataTablesParameters['team_id'] = parseInt(params.team_id);
          // dataTablesParameters['club_id'] = parseInt(params.club_id);
          // dataTablesParameters['group_id'] = parseInt(params.group_id);
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

      columnDefs: [
        { responsivePriority: 1, targets: 1 },
        { responsivePriority: 1, targets: -1 },
        { responsivePriority: 2, targets: 1 },
      ],
      columns: [
        {
          // photo
          data: 'photo',
          className: 'text-center',
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
          data: 'user.first_name',
          className: 'font-weight-bolder',
          render: (data, type, row) => {
            if (data && row.user.last_name) {
              return data + ' ' + row.user.last_name;
            } else {
              return '';
            }
          },
        },

        {
          //year
          data: 'dob',
          render: (data, type, row) => {
            return new Date(data).getFullYear();
          },
        },
        {
          //gender
          data: 'gender',
          render: (data, type, row) => {
            return this._translateService.instant(data);
          }
        },
        {
          data: null,
          render: (data, type, row) => {
            return `<button class="btn btn-primary btn-sm" 
            data-row-value = '${JSON.stringify(row)}'
            action="assign">${this._translateService.instant(
              'Assign'
            )}</button>`;
          },
        },
      ],
      buttons: [
        {
          text:
            '<i class="fa-duotone fa-check-double"></i> ' +
            this._translateService.instant('Assign All'),
          className: 'btn btn-primary',
          action: (e, dt, node, config) => {
            // if no data
            if (dt.rows().data().length == 0) {
              // disable  this button
              return;
            }
            // check if players assigned to this team
            let rows = dt.rows().data();

            Swal.fire({
              title: this._translateService.instant('Are you sure?'),
              html:
                `
              <div class="text-center">
                <img src="assets/images/alerts/Frame1.svg" width="200px" height="149px">
                <p class="text-center">
                ` +
                this._translateService.instant(
                  'You want to assign all players to this team?'
                ) +
                `
                </p>
              </div>
              `,
              showCancelButton: true,
              confirmButtonText: this._translateService.instant('Yes'),
              confirmButtonColor: '#3085d6',
              cancelButtonText:
                '<span class="text-primary">' +
                this._translateService.instant('Cancel') +
                '</span>',
              cancelButtonColor: '#d33',
              reverseButtons: true,
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-primary mr-1',
                cancelButton: 'btn btn-outline-primary mr-1',
              },

              // on confirm
            }).then((result) => {
              if (result.isConfirmed) {
                this.loadingService.dismiss();
                // assign all players
                for (let i = 0; i < rows.length; i++) {
                  this.editor('auto-assign', rows[i]);
                }

                Swal.fire({
                  title: 'Success',
                  html: `
                  <div class="text-center">
                    <img src="assets/images/alerts/assigned.svg" width="200px" height="149px">
                    <p class="text-center">
                    All players assigned to this team successfully!
                    </p>
                  </div>
                  `,
                  confirmButtonText: this._translateService.instant('OK'),
                  customClass: {
                    confirmButton: 'btn btn-primary mr-1',
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    // reload table
                    dt.ajax.reload();
                    // dismiss modal
                    this.modalService.dismissAll();
                  }
                });
              }
            });
          },
        },
      ],
    };
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('data-row-value')) {
        let row = event.target.getAttribute('data-row-value');
        row = JSON.parse(row);

        this.editor(event.target.getAttribute('action'), row);
      }
    });
  }

  editor(action, row) {
    switch (action) {
      case 'assign':
        Swal.fire({
          title: this._translateService.instant('Are you sure?'),
          html:
            `
          <div class="text-center">
            <img src="assets/images/alerts/Frame1.svg" width="200px" height="149px">
            <p class="text-center">` +
            this._translateService.instant(
              'You want to assign this player to this team?'
            ) +
            `
            </p>
          </div>`,
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonText: this._translateService.instant('Yes'),
          confirmButtonColor: '#3085d6',
          cancelButtonText:
            '<span class="text-primary">' +
            this._translateService.instant('Cancel') +
            '</span>',
          cancelButtonColor: '#d33',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary mr-1',
            cancelButton: 'btn btn-outline-primary mr-1',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            let team_id = this.params.team_id;
            let player_id = row.id;
            let params: FormData = new FormData();
            params.append('action', 'create');
            params.append('data[0][team_id]', team_id);
            params.append('data[0][player_id]', player_id);

            this._teamService
              .editorTableTeamPlayers(params)
              .subscribe((resp: any) => {
                if (resp) {
                  this.toastService.success(
                    this._translateService.instant(
                      'Player assigned to this team successfully'
                    )
                  );

                  // disable button
                  let button = document.querySelector(
                    `button[action="assign"][data-row-value='${JSON.stringify(
                      row
                    )}']`
                  );
                  button.setAttribute('disabled', 'disabled');
                  button.classList.add('disabled');
                  // change text
                  button.innerHTML = this._translateService.instant('Assigned');
                }
              });
          }
        });
        break;
      case 'auto-assign':
        let team_id = this.params.team_id;
        let player_id = row.id;

        let params: FormData = new FormData();
        params.append('action', 'create');
        params.append('data[0][team_id]', team_id);
        params.append('data[0][player_id]', player_id);

        this._teamService
          .editorTableTeamPlayers(params)
          .subscribe((resp: any) => {
            if (resp) {
              // disable button
              let button = document.querySelector(
                `button[action="assign"][data-row-value='${JSON.stringify(
                  row
                )}']`
              );
              button.setAttribute('disabled', 'disabled');
              button.classList.add('disabled');
              // change text
              button.innerHTML = this._translateService.instant('Assigned');
            }
          });
        break;

      default:
        break;
    }
  }

  onClose() {
    this.modalService.dismissAll();
  }
}
