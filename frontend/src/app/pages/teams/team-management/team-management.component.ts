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
import { Season } from 'app/interfaces/season';
import { SeasonService } from 'app/services/season.service';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.scss'],
})
export class TeamManagementComponent implements AfterViewInit, OnInit {
  @ViewChild('rowActionBtn') rowActionBtn: TemplateRef<any>;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  dtOptions: any = {};
  private unlistener: () => void;
  public currentTeam: any = {};
  public seasonId: any;
  public clubId: any;
  public groupId: any;
  public modalRef: any;
  public contentHeader: object;
  public seasons: Season[] = [];
  public season: Season;
  public currentGroups;
  public selectedGroup: any = {};
  public table_name = 'team-table';
  public clubs = [];
  public params: EditorSidebarParams = {
    editor_id: this.table_name,
    title: {
      create: this._translateService.instant('Create new team'),
      edit: this._translateService.instant('Edit team'),
      remove: 'Delete team',
    },
    url: `${environment.apiUrl}/teams/editor`,
    method: 'POST',
    action: 'create',
  };

  public fields: any[] = [
    {
      key: 'group_id',
      type: 'input',
      props: {
        type: 'hidden',
        required: true,
      },
    },
    {
      key: 'name',
      type: 'input',
      props: {
        label: this._translateService.instant('Name'),
        placeholder: this._translateService.instant('Enter name of team'),
        required: true,
      },
    },
    {
      key: 'club_id',
      label: this._translateService.instant('Club'),
      type: 'select',
      props: {
        placeholder: this._translateService.instant('Club'),
        required: true,
        options: this.clubs,
      },
    },
  ];

  public rowActions: EZBtnActions[] = [
    {
      type: 'collection',
      buttons: [
        {
          label: 'Edit',
          onClick: (row: any) => {
            this.editor('edit', row);
          },
          icon: 'fa-regular fa-pen-to-square',
        },
        {
          label: 'Delete',
          onClick: (row: any) => {
            this.editor('remove', row);
          },
          icon: 'fa-regular fa-trash',
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
    public seasonService: SeasonService,
    public _teamService: TeamService,
    public _modalService: NgbModal,
    public _loadingService: LoadingService,
    public _toastService: ToastrService,
    public _registrationService: RegistrationService,
    public _translateService: TranslateService,
    public _coreSidebarService: CoreSidebarService,
    public _seasonService: SeasonService
  ) {}

  // _getCurrentSeason() {
  //   this._registrationService.getAllSeasonActive().subscribe(
  //     (data) => {
  //       this.seasons: Season[] = []; = data;
  //       this.season = this.seasons: Season[] = [];[0].id;
  //       this.seasonId = this.season;
  //       this._getGroupsBySeason();
  //     },
  //     (error) => {
  //       Swal.fire({
  //         title: 'Error',
  //         text: error.message,
  //         icon: 'error',
  //         confirmButtonText: this._translateService.instant('OK'),
  //       });
  //     }
  //   );
  // }
  _getGroupsBySeason() {
    if (!this.seasonId) return;

    this._loadingService.show();
    this._seasonService.getGroupsBySeason(this.seasonId).subscribe(
      (data) => {
        this.currentGroups = data;
        this.selectedGroup = this.currentGroups[0];
        this.groupId = this.selectedGroup?.id;
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

  onSelectedSeasonChange($event) {
    return new Promise((resolve, reject) => {
      this.seasonId = $event.id;
      this._getGroupsBySeason();
      resolve(true);
    });
  }
  onSelectedGroupChange($event) {
    this.groupId = $event.id;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  setContentHeader() {
    this.contentHeader = {
      headerTitle: this._trans.instant('Team Management'),
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: this._trans.instant('Teams'),
            isLink: false,
          },
          {
            name: this._trans.instant('Team Management'),
            isLink: false,
          },
        ],
      },
    };
  }

  ngOnInit(): void {
    this.setContentHeader();
    this.getActiveSeasons();
    setTimeout(() => {
      // console.log(this.rowActionBtn);

      this.dtOptions = {
        dom: this._commonsService.dataTableDefaults.dom,
        ajax: (dataTablesParameters: any, callback) => {
          dataTablesParameters.group_id = this.groupId;
          this._http
            .get<any>(
              `${environment.apiUrl}/groups/${this.groupId}/teams`,
              dataTablesParameters
            )
            .subscribe((resp: any) => {
              if (resp.hasOwnProperty('options')) {
                this.setClubs(resp.options.club);
              }
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
        responsive: true,
        scrollX: false,
        language: this._commonsService.dataTableDefaults.lang,
        lengthMenu: this._commonsService.dataTableDefaults.lengthMenu,
        displayLength: -1,
        order: [[1, 'asc']],
        columnDefs: [
          { responsivePriority: 1, targets: -1 },
          // { responsivePriority: 2, targets: 2 },
        ],
        columns: [
          {
            title: this._translateService.instant('Logo'),
            data: 'club.logo',

            render: (data, type, row) => {
              if (data) {
                return `<img src="${data}" width="50" height="50" />`;
              } else {
                return '';
              }
            },
          },
          {
            title: this._translateService.instant('Name'),
            data: 'name',
          },
          {
            title: this._translateService.instant('Club'),
            data: 'club.name',
            render: (data, type, row) => {
              if (data) {
                return this._translateService.instant(data);
              } else {
                return '';
              }
            },
          },
          {
            data: 'id',
            className: 'btn-action',
            defaultContent: '',
            ngTemplateRef: {
              ref: this.rowActionBtn,
              context: {
                captureEvents: this.onCaptureEvent.bind(this),
              },
            },
          },
        ],
        buttons: {
          dom: {
            container: {
              className: 'dt-buttons d-flex justify-content-end mr-2',
            },
            button: { className: 'btn btn-primary ' },
          },
          buttons: [
            {
              text:
                '<i class="feather icon-plus"></i> ' +
                this._translateService.instant('Add New Team'),
              action: () => this.editor('create'),
            },
          ],
        },
      };
    }, 500);
  }

  getActiveSeasons() {
    let status = 'active';
    this.seasonService.getSeasons(status).subscribe(
      (data) => {
        console.log(`getActiveSeasons`, data);
        this.seasons = data;
        this.season = this.seasons[0];
        this.seasonId = this.season.id;
        this._getGroupsBySeason();
        // this.rerenderDataTable();
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

  onChangeSeason($event) {
    console.log('onChangeSeason', $event);
    this.season = $event;
    this.seasonId = this.season.id;
    // this.rerenderDataTable();
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
    this.fields[0].defaultValue = this.groupId;
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
