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
import { SeasonService } from 'app/services/season.service';

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LeagueComponent implements OnInit {
  @ViewChild('rowActionBtn') rowActionBtn: TemplateRef<any>;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  dtOptions: any = {};
  model: any = {};
  private unlistener: () => void;
  public currentTeam: any = {};
  public seasonId: any;
  public clubId: any;
  public groupId: any;
  public modalRef: any;
  public contentHeader: object;
  public currentSeasons;
  public currentGroups;
  public selectedSeason: any = {};
  public selectedGroup: any = {};
  public table_name = 'tournament-table';
  public params: EditorSidebarParams = {
    editor_id: this.table_name,
    title: {
      create: this._translateService.instant('Create New Tournament'),
      edit: 'Edit tournament',
      remove: 'Delete tournament',
    },
    url: `${environment.apiUrl}/tournaments/editor`,
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
        placeholder: this._translateService.instant('Enter name of tournament'),
        required: true,
      },
    },
    {
      key: 'type',
      type: 'radio',
      props: {
        label: this._translateService.instant('Type'),
        placeholder: this._translateService.instant('Select tournament type'),
        required: true,
        options: [
          {
            value: AppConfig.TOURNAMENT_TYPES.league,
            label: this._translateService.instant(
              AppConfig.TOURNAMENT_TYPES.league
            ),
          },
          {
            value: AppConfig.TOURNAMENT_TYPES.groups_knockout,
            label: this._translateService.instant(
              AppConfig.TOURNAMENT_TYPES.groups_knockout
            ),
          },
        ],
      },
    },
    {
      key: 'id',
      type: 'input',
      props: {
        type: 'hidden',
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
    public _teamService: TeamService,
    public _modalService: NgbModal,
    public _loadingService: LoadingService,
    public _toastService: ToastrService,
    public _registrationService: RegistrationService,
    public _seasonService: SeasonService,
    public _translateService: TranslateService,
    public _coreSidebarService: CoreSidebarService
  ) {}

  _getCurrentSeason() {
    this._registrationService.getAllSeasonActive().subscribe(
      (data) => {
        this.currentSeasons = data;
        this.selectedSeason = this.currentSeasons[0].id;
        this.seasonId = this.selectedSeason;
        this.buildTable();
        this.dtTrigger.next(this.dtOptions);
        this.addListener();
        this._getGroupsBySeason();
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
      this.seasonId = $event;
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

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: this._trans.instant('Manage Leagues'),
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: this._trans.instant('Leagues'),
            isLink: false,
          },
          {
            name: this._trans.instant('Manage Leagues'),
            isLink: false,
          },
        ],
      },
    };

    this._getCurrentSeason();
  }

  buildTable() {
    this.dtOptions = {
      dom: this._commonsService.dataTableDefaults.dom_m25,
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.group_id = this.groupId;
        this.model.group_id = this.groupId;
        this._http
          .post<any>(
            `${environment.apiUrl}/tournaments/all-in-group`,
            dataTablesParameters
          )
          .subscribe((resp: any) => {
            callback({
              // this function callback is used to return data to datatable
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data,
            });
          });
      },
      order: [[2, 'desc']],
      select: 'single',
      // serverSide: true,
      rowId: 'id',
      responsive: true,
      scrollX: false,
      language: this._commonsService.dataTableDefaults.lang,
      columnDefs: [
        // { responsivePriority: 1, targets: -1 },
        // { responsivePriority: 2, targets: 2 },
      ],
      columns: [
        {
          title: 'Name',
          data: 'name',
          className: 'col-4 text-warp d-sm-table-cell d-inline-block',
        },
        {
          data: null,
          className: 'col-12 text-center border-right-0',
          render: (data, type, row) => {
            let btns = '';
            let btn_knockout = `<div class="col-auto pr-0 pt-25 pb-25" >
              <button type="button" tournament_id="${row.id}" stage_id="{stage_id}" class="btn p-1 btn-outline-danger btn-sm w-110px" > 
              <i class="bi bi-diagram-2"></i>
              {stage_name}
              </button>
            </div>`;
            let btn_league = `<div class="col-auto pr-0 pt-25 pb-25" >
              <button type="button" tournament_id="${row.id}" stage_id="{stage_id}" class="btn p-1 btn-outline-success btn-sm w-110px" >
              <i class="bi bi-trophy"></i>
              {stage_name}
              </button>
            </div>`;
            let btn_groups = `<div class="col-auto pr-0 pt-25 pb-25" >
              <button type="button" tournament_id="${row.id}" stage_id="{stage_id}" class="btn p-1 btn-outline-warning btn-sm w-110px" >
              <i class="bi bi-ui-checks-grid"></i>
              {stage_name}
              </button>
            </div>`;

            // for each row.stages, create a button
            row.stages.forEach((stage) => {
              let stage_name = stage.name;
              stage_name = this._translateService.instant(stage_name);
              switch (stage.type) {
                case AppConfig.TOURNAMENT_TYPES.knockout:
                  btn_knockout = btn_knockout.replace(
                    '{stage_name}',
                    stage_name
                  );
                  btn_knockout = btn_knockout.replace('{stage_id}', stage.id);
                  btns += btn_knockout;
                  break;
                case AppConfig.TOURNAMENT_TYPES.league:
                  btn_league = btn_league.replace('{stage_name}', stage_name);
                  btn_league = btn_league.replace('{stage_id}', stage.id);
                  btns += btn_league;
                  break;
                case AppConfig.TOURNAMENT_TYPES.groups:
                  btn_groups = btn_groups.replace('{stage_name}', stage_name);
                  btn_groups = btn_groups.replace('{stage_id}', stage.id);
                  btns += btn_groups;
                  break;
                default:
                  break;
              }
            });

            let html = `<div class="row justify-content-start" >
            ${btns}
            </div>`;
            // return 2 button
            return html;
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
            className: 'dt-buttons d-flex justify-content-end',
          },
          button: { className: 'btn btn-primary ' },
        },
        buttons: [
          {
            text:
              '<i class="feather icon-plus"></i> ' +
              this._translateService.instant('New Tournament'),
            action: () => this.editor('create'),
          },
        ],
      },
    };
  }

  onCaptureEvent(event: any) {
    // console.log(event);
  }

  editor(action, row?) {
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
  addListener() {
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
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.unlistener();
  }
}
