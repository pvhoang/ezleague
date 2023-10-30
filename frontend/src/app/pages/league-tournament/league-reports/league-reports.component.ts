import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
  TemplateRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { CommonsService } from 'app/services/commons.service';
import { LoadingService } from 'app/services/loading.service';
import { TeamService } from 'app/services/team.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'environments/environment';
import { RegistrationService } from 'app/services/registration.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { EditorSidebarParams } from 'app/interfaces/editor-sidebar';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { AppConfig } from 'app/app-config';
import { EZBtnActions } from 'app/components/btn-dropdown-action/btn-dropdown-action.component';
import { ClubService } from 'app/services/club.service';
import moment from 'moment';

@Component({
  selector: 'app-league-reports',
  templateUrl: './league-reports.component.html',
  styleUrls: ['./league-reports.component.scss'],
})
export class LeagueReportsComponent implements AfterViewInit, OnInit {
  @ViewChild('rowActionBtn') rowActionBtn: TemplateRef<any>;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  dtOptions: any = {};
  private unlistener: () => void;
  public currentTeam: any = {};
  public seasonId: any;
  public clubId: any;
  public modalRef: any;
  public contentHeader: object;
  public seasons;
  public clubs;
  public table_name = 'team-table';
  public params: EditorSidebarParams = {
    editor_id: this.table_name,
    title: {
      create: this._translateService.instant('Create New Tournament'),
      edit: 'Edit team',
      remove: 'Delete team',
    },
    url: `${environment.apiUrl}/teams/editor`,
    method: 'POST',
    action: 'create',
  };

  public fields: any[] = [
    {
      key: 'home_score',
      type: 'number',
      props: {
        label: this._translateService.instant('Home team score'),
        placeholder: this._translateService.instant('Enter score of team'),
        required: true,
      },
    },
    {
      key: 'away_score',
      type: 'number',
      props: {
        label: this._translateService.instant('Away team score'),
        placeholder: this._translateService.instant('Enter score of team'),
        required: true,
      },
    },
  ];

  public rowActions: EZBtnActions[] = [
    {
      type: 'collection',
      buttons: [
        {
          label: 'Update score',
          onClick: (row: any) => {
            this.editor('edit', row);
          },
          icon: 'fa-regular fa-pen-to-square',
        },
      ],
    },
  ];

  // private variables
  private _unsubscribeAll: Subject<any>;

  constructor(
    private route: ActivatedRoute,
    public _router: Router,
    public _commonsService: CommonsService,
    public _http: HttpClient,
    public _trans: TranslateService,
    public renderer: Renderer2,
    public _teamService: TeamService,
    public _modalService: NgbModal,
    public _loadingService: LoadingService,
    public _toastService: ToastrService,
    public _registrationService: RegistrationService,
    public _clubService: ClubService,
    public _translateService: TranslateService,
    public _coreSidebarService: CoreSidebarService
  ) {}

  _getCurrentSeason() {
    this._registrationService.getAllSeasonActive().subscribe(
      (data) => {
        this.seasons = data;
        this.seasonId = this.seasons[0].id;
        if (this.dtElement.dtInstance) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
          });
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonText: this._translateService.instant('OK'),
        });
      }
    );
  }

  _getClubs() {
    this._loadingService.show();
    this._clubService.getAllClubs().subscribe(
      (res) => {
        this.clubs = res.data;
        // this.clubId = this.clubs[0];
        if (this.dtElement.dtInstance) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
          });
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonText: this._translateService.instant('OK'),
        });
      }
    );
  }

  onSelectSeason($event) {
    return new Promise((resolve, reject) => {
      this.seasonId = $event;
      if (this.dtElement.dtInstance) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.ajax.reload();
        });
      }
      resolve(true);
    });
  }

  onSelectClub($event) {
    console.log(`onSelectClub: ${$event}`);
    this.clubId = $event;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: this._trans.instant('Matches Report'),
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: this._trans.instant('Leagues'),
            isLink: false,
          },
          {
            name: this._trans.instant('Matches Report'),
            isLink: false,
          },
        ],
      },
    };

    this._getCurrentSeason();
    this._getClubs();
    setTimeout(() => {
      this.dtOptions = {
        dom: this._commonsService.dataTableDefaults.dom,
        select: 'single',
        // serverSide: true,
        rowId: 'id',
        ajax: (dataTablesParameters: any, callback) => {
          let params =
            this.clubId != undefined ? `?club_id=${this.clubId}` : '';
          this._http
            .post<any>(
              `${environment.apiUrl}/seasons/${this.seasonId}/matches${params}`,
              dataTablesParameters
            )
            .subscribe((resp: any) => {
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: resp.data,
              });
            });
        },
        responsive: false,
        scrollX: true,
        language: this._commonsService.dataTableDefaults.lang,
        columnDefs: [{ responsivePriority: 1, targets: -1 }],
        columns: [
          {
            data: 'name',
            className: 'font-weight-bolder',
          },
          {
            data: 'start_time',
            className: 'text-center',
            render: function (data, type, row) {
              if (!data || data == 'TBD') {
                return 'TBD';
              }
              // format to HH:mm from ISO 8601
              return moment(data).format('YYYY-MM-DD');
            },
          },
          {
            data: 'start_time',
            className: 'text-center',
            render: function (data, type, row) {
              if (!data || data == 'TBD') {
                return 'TBD';
              }
              // format to HH:mm from ISO 8601
              return moment(data).format('HH:mm');
            },
          },
          {
            data: 'end_time',
            className: 'text-center',
            render: function (data, type, row) {
              if (!data || data == 'TBD') {
                return 'TBD';
              }
              // format to HH:mm from ISO 8601
              return moment(data).format('HH:mm');
            },
          },
          {
            data: 'location',
            reder: function (data, type, row) {
              if (!data || data == 'TBD') {
                return 'TBD';
              }
              // format to HH:mm from ISO 8601
              return data;
            },
          },
          { data: 'user' },
          {
            data: 'home_team_name',
            className: 'text-center',
          },
          {
            data: null,
            className: 'text-center',
            render: function (data, type, row) {
              return 'vs';
            },
          },
          {
            data: 'away_team_name',
            className: 'text-center',
          },
          {
            data: 'home_score',
            className: 'text-center',
          },
          {
            data: null,
            className: 'text-center',
            render: function (data, type, row) {
              return '-';
            },
          },
          {
            data: 'away_score',
            className: 'text-center',
          },
        ],
        buttons: {
          dom: this._commonsService.dataTableDefaults.buttons.dom,
          buttons: [
            {
              text: `<i class="fa fa-file-excel-o mr-1"></i> ${this._translateService.instant(
                'Export Excel'
              )}`,
              extend: 'csv',
            },
          ],
        },
      };
    }, 500);
  }

  setClubs(data) {
    this.clubs = data;
    // get field has key club_id
    const clubField = this.fields.find((field) => field.key === 'club_id');
    // set options for club field
    let current_clubs = [];
    data.forEach((club) => {
      let club_name = this._translateService.instant(club.name);
      current_clubs.push({
        label: club_name,
        value: club.id,
      });
    });
    clubField.props.options = current_clubs;
  }

  onCaptureEvent(event: any) {
    // console.log(event);
  }

  editor(action, row?) {
    this.fields[0].defaultValue = this.clubId;
    switch (action) {
      case 'create':
        this.fields[2].props.disabled = false;
        break;
      case 'edit':
        this.fields[2].props.disabled = true;
        break;
      case 'remove':
        break;
      default:
        break;
    }
    this.params.action = action;
    this.params.row = row ? row : null;
    this._coreSidebarService.getSidebarRegistry(this.table_name).toggleOpen();
  }

  ngAfterViewInit(): void {
    this.unlistener = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('tournament_id')) {
        let tournament_id = event.target.getAttribute('tournament_id');
        let stage_id = event.target.getAttribute('stage_id');
        //  navigate to path ':tournament_id/stages/:stage_id'
        this._router.navigate([tournament_id, 'stages', stage_id], {
          relativeTo: this.route,
        });
      }
    });
    setTimeout(() => {
      // race condition fails unit tests if dtOptions isn't sent with dtTrigger
      this.dtTrigger.next(this.dtOptions);
    }, 500);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.unlistener();
  }
}
