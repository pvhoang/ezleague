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
import { AssignNewCoachComponent } from '../assign-coaches/assign-new-coach/assign-new-coach.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-coaches',
  templateUrl: './assign-coaches.component.html',
  styleUrls: ['./assign-coaches.component.scss'],
})
export class TeamCoachesComponent implements AfterViewInit, OnInit {
  @Input() team: any;
  onSubmitted: EventEmitter<any> = new EventEmitter();
  public teamId: any;
  private unlistener: () => void;

  public seasonId: any;
  public clubId: any;
  public groupId: any;
  @ViewChild('modalValidator') modalValidator: TemplateRef<any>;
  dtOptions: any = {};
  dtTrigger: any = {};
  public modalRef: any;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
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

    let team_coaches_url = `${environment.apiUrl}/teams/${this.teamId}/coaches`;
    let params = {
      season_id: this.seasonId,
      club_id: this.clubId,
      group_id: this.groupId,
    };

    // this.dtOptions[0] = this.buildDtOptions1(current_season_coach_url, params, buttons_assign);
    this.dtOptions = this.buildDtOptions(team_coaches_url, false);
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
          // name
          data: null,
          className: 'font-weight-bolder',
          render: (data, type, row) => {
            if (row.user.first_name && row.user.last_name) {
              return row.user.first_name + ' ' + row.user.last_name;
            } else {
              return '';
            }
          },
        },
        {
          data: 'user.email',
        },
        {
          data: 'user.phone',
        },
        {
          data: 'id',
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

  assignCoachToTeam() {
    // open modal
    const modalRef = this._modalService.open(AssignNewCoachComponent, {
      size: 'lg',
      backdrop: 'static',
      // click outside modal to close
      centered: true,
      keyboard: true,
      // close button
    });

    modalRef.componentInstance.params = {
      team_id: this.team.id,
      club_id: this.team.club_id,
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

  editor(action, row) {
    switch (action) {
      case 'remove':
        Swal.fire({
          title: this._translateService.instant('Are you sure?'),
          html:
            `
        <div class="text-center">
          <img src="assets/images/alerts/are_you_sure.svg" width="200px" height="149px">
          <p class="text-center">` +
            this._translateService.instant('ask_want_to_remove_coach') +
            `
          </p>
        </div>`,
          reverseButtons: true,

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
            let user_id = row.user.id;
            let params: FormData = new FormData();
            params.append('action', 'remove');
            params.append('data[' + row_id + '][team_id]', this.teamId);
            params.append('data[' + row_id + '][user_id]', user_id);

            this._teamService.editorTableTeamCoaches(params).subscribe(
              (resp: any) => {
                if (resp) {
                  this._toastService.success(
                    this._translateService.instant('Coach removed successfully')
                  );
                }

                // reload
                this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  dtInstance.ajax.reload();
                });
              },
              (err) => {
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
        break;

      default:
        break;
    }
  }

  ngAfterViewInit(): void {
    this.unlistener = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('data-row')) {
        let row = event.target.getAttribute('data-row');
        row = JSON.parse(row);

        this.editor(event.target.getAttribute('action'), row);
      }
    });
  }
}
