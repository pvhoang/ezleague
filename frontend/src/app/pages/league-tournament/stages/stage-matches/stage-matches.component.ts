import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { CommonsService } from 'app/services/commons.service';
import { Subject } from 'rxjs';
import { AppConfig } from 'app/app-config';
import { StageService } from 'app/services/stage.service';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { LoadingService } from 'app/services/loading.service';
import { EditorSidebarParams } from 'app/interfaces/editor-sidebar';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-stage-matches',
  templateUrl: './stage-matches.component.html',
  styleUrls: ['./stage-matches.component.scss'],
})
export class StageMatchesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  @Input() stage: any;
  public contentHeader: object;
  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  AppConfig = AppConfig;

  @Output() onUpdateScore = new EventEmitter<any>();
  @Output() onDataChange = new EventEmitter<any>();
  constructor(
    private _http: HttpClient,
    public _translateService: TranslateService,
    public _commonsService: CommonsService,
    public _stageService: StageService,
    public _loadingService: LoadingService,
    public _coreSidebarService: CoreSidebarService,
    public _toastr: ToastrService
  ) {}
  public fields_subject = new Subject<any>();
  public cancelOptions = [];
  public paramsToPost = {};
  public is_score_updated = false;
  public table_name = 'matches-table';
  public params: EditorSidebarParams = {
    editor_id: this.table_name,
    title: {
      create: this._translateService.instant('Add match'),
      edit: this._translateService.instant('Edit match'),
      remove: this._translateService.instant('Remove match'),
    },
    url: `${environment.apiUrl}/stage-matches/editor`,
    method: 'POST',
    action: 'create',
  };
  public location = {
    options: [],
    selected: null,
  };
  public teams = {
    options: [],
    selected: null,
  };

  public editMatch = [
    {
      key: 'date',
      type: 'input',
      props: {
        label: this._translateService.instant('Date'),
        placeholder: this._translateService.instant('Enter date of match'),
        // required: true,
        type: 'date',
        max: '2100-12-31',
      },
      expressions: {
        'props.required':
          '(model.hasOwnProperty("start_time_short") && model.start_time_short!="") || (model.hasOwnProperty("end_time_short") && model.end_time_short!="")',
      },
    },
    {
      key: 'start_time_short',
      type: 'input',
      props: {
        label: this._translateService.instant('Start time'),
        placeholder: this._translateService.instant(
          'Enter start time of match'
        ),
        // required: true,
        type: 'time',
      },
      expressions: {
        'props.required':
          '(model.hasOwnProperty("date") && model.date!="") || (model.hasOwnProperty("end_time_short") && model.end_time_short!="")',
      },
    },
    {
      key: 'end_time_short',
      type: 'input',
      props: {
        label: this._translateService.instant('End time'),
        placeholder: this._translateService.instant('Enter end time of match'),
        // required: true,
        type: 'time',
      },
    },
    {
      key: 'location_id',
      type: 'select',
      props: {
        label: this._translateService.instant('Location'),
        placeholder: this._translateService.instant('Select location'),
        // required: true,
        options: this.location.options,
      },
    },

    {
      key: 'home_team_id',
      type: 'select',
      props: {
        hideOnMultiple: true,
        label: this._translateService.instant('Home team'),
        placeholder: this._translateService.instant('Select home team'),
        required: true,
        options: [],
      },
    },
    {
      key: 'away_team_id',
      type: 'select',
      props: {
        hideOnMultiple: true,
        label: this._translateService.instant('Away team'),
        placeholder: this._translateService.instant('Select away team'),
        required: true,
        options: [],
      },
    },
  ];

  public updateScore = [];

  public cancelMatch = [
    {
      key: 'status',
      type: 'radio',
      props: {
        label: this._translateService.instant('Cancel type'),
        required: true,
        options: this.cancelOptions,
      },
    },
    {
      key: 'description',
      type: 'input',
      props: {
        label: this._translateService.instant('Reason'),
        placeholder: this._translateService.instant('Enter reason'),
      },
    },
  ];

  public fields: any[] = this.editMatch;

  ngOnInit(): void {
    this.setUp();
    this.buildTable();
  }

  setUp() {
    AppConfig.CANCEL_MATCH_TYPES.forEach((type) => {
      this.cancelOptions.push({
        value: type,
        label: this._translateService.instant(type),
      });
    });
    (this.editMatch as any).push({
      key: 'stage_id',
      type: 'input',
      props: {
        type: 'hidden',
      },
      defaultValue: this.stage.id,
    });

    this.updateScore = [
      {
        key: 'type',
        type: 'input',
        props: {
          type: 'hidden',
        },
        defaultValue: this.stage.type,
      },
      {
        key: 'home_score',
        type: 'core-touchspin',
        props: {
          label: this._translateService.instant('Home score'),
          required: true,
          type: 'number',
          min: 0,
          max: 100,
          step: 1,
        },
        defaultValue: 0,
      },
      {
        key: 'away_score',
        type: 'core-touchspin',
        props: {
          label: this._translateService.instant('Away score'),
          required: true,
          type: 'number',
          min: 0,
          max: 100,
          step: 1,
        },
        defaultValue: 0,
      },
      {
        key: 'home_penalty',
        type: 'core-touchspin',
        props: {
          label: this._translateService.instant('Home penalty score'),
          // required: true,
          type: 'number',
          min: 0,
          max: 100,
          step: 1,
        },
        expressions: {
          hide: `model.type != '${AppConfig.TOURNAMENT_TYPES.knockout}' || model.home_score != model.away_score`,
        },
        defaultValue: 0,
      },
      {
        key: 'away_penalty',
        type: 'core-touchspin',
        props: {
          label: this._translateService.instant('Away penalty score'),
          // required: true,
          type: 'number',
          min: 0,
          max: 100,
          step: 1,
        },
        expressions: {
          hide: `model.type != '${AppConfig.TOURNAMENT_TYPES.knockout}' || model.home_score != model.away_score`,
        },
        defaultValue: 0,
      },
    ];

    this.contentHeader = {
      headerTitle: this._translateService.instant('League Reports'),
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: this._translateService.instant('Leagues'),
            isLink: false,
          },
          {
            name: this._translateService.instant('League Reports'),
            isLink: false,
          },
        ],
      },
    };
  }

  buildTable() {
    setTimeout(() => {
      this.dtOptions = {
        dom: this._commonsService.dataTableDefaults.dom,
        select: 'multi+shift',
        // serverSide: true,
        rowId: 'id',
        ajax: (dataTablesParameters: any, callback) => {
          // add season id
          this._http
            .post<any>(
              `${environment.apiUrl}/stage-matches/all-in-stage/${this.stage.id}`,
              dataTablesParameters
            )
            .subscribe((resp: any) => {
              // find fields has key location_id and set options
              this.fields.forEach((field) => {
                if (field.key === 'location_id') {
                  field.props.options = resp.options.location;
                }
                if (field.key === 'home_team_id') {
                  field.props.options = resp.options.teams;
                }
                if (field.key === 'away_team_id') {
                  field.props.options = resp.options.teams;
                }
              });

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
        columnDefs: [
          { responsivePriority: 1, targets: -7 },
          { responsivePriority: 1, targets: -6 },
          { responsivePriority: 1, targets: -5 },
          { responsivePriority: 1, targets: -4 },
          { responsivePriority: 1, targets: -3 },
          { responsivePriority: 1, targets: -2 },
        ],
        columns: [
          { data: 'order', visible: false },
          { data: 'round_level', visible: false },
          {
            title: this._translateService.instant('Date'),
            data: 'date',
            className: 'text-center p-1',
            render: function (data, type, row) {
              if (!data || data === 'TBD') {
                return 'TBD';
              }
              // format to HH:mm from ISO 8601
              return moment(data).format('YYYY-MM-DD');
            },
          },
          {
            title: this._translateService.instant('Start time'),
            data: 'start_time',
            className: 'text-center p-1',
            render: function (data, type, row) {
              if (!data) {
                return 'TBD';
              }
              // format to HH:mm from ISO 8601
              return moment(data).format('HH:mm');
            },
          },
          {
            title: this._translateService.instant('End time'),
            data: 'end_time',
            className: 'text-center p-1',
            render: function (data, type, row) {
              if (!data) {
                return 'TBD';
              }
              // format to HH:mm from ISO 8601
              return moment(data).format('HH:mm');
            },
          },
          {
            title: this._translateService.instant('Location'),
            data: 'location_name',
          },
          {
            title: this._translateService.instant('Home team'),
            data: 'home_team_name',
            className: 'text-center p-1',
            orderable: false,
          },
          {
            data: null,
            className: 'text-center p-0 font-weight-bolder',
            render: function (data, type, row) {
              return `VS`;
            },
            orderable: false,
          },
          {
            title: this._translateService.instant('Away team'),
            data: 'away_team_name',
            className: 'text-center p-1',
            orderable: false,
          },
          {
            title: this._translateService.instant('Home score'),
            data: 'home_score',
            className: 'text-center p-1',
            orderable: false,
            render: function (data, type, row) {
              if (row.home_penalty) {
                return `${data}<br> ( ${row.home_penalty} )`;
              }
              return data;
            },
          },
          {
            data: null,
            className: 'text-center p-0',
            orderable: false,
            render: function (data, type, row) {
              return ` - `;
            },
          },
          {
            title: this._translateService.instant('Away score'),
            data: 'away_score',
            className: 'text-center p-1',
            orderable: false,
            render: function (data, type, row) {
              if (row.away_penalty) {
                return `${data}<br> ( ${row.away_penalty} )`;
              }
              return data;
            },
          },
          {
            title: this._translateService.instant('Status'),
            data: 'status',
            render: (data: string, type, row) => {
              if (AppConfig.CANCEL_MATCH_TYPES.includes(data)) {
                return `<span class="badge badge-danger">${data}</span>`;
              } else {
                return `<span class="badge badge-success">Can play</span>`;
              }
            },
            className: 'text-center p-1',
            orderable: false,
          },
        ],
        buttons: {
          dom: this._commonsService.dataTableDefaults.buttons.dom,
          buttons: [
            {
              text: `<i class="fa-solid fa-plus"></i> ${this._translateService.instant(
                'Add'
              )}`,
              action: (e, dt, node, config) => {
                // check if stage type is league
                if (this.stage.type != AppConfig.TOURNAMENT_TYPES.league) {
                  Swal.fire({
                    title: this._translateService.instant('Notification'),
                    text: this._translateService.instant(
                      'You can not add match in this stage'
                    ),
                    icon: 'warning',
                    confirmButtonText: this._translateService.instant('Ok'),
                    customClass: {
                      confirmButton: 'btn btn-primary',
                    },
                  });
                  return;
                }

                this.editor('create', 'editMatch');
              },
            },
            {
              text: `<i class="fa-solid fa-wand-magic-sparkles"></i> ${this._translateService.instant(
                'Auto Generate'
              )}`,
              action: (e, dt, node, config) => {
                this.autoGenerateMatches();
              },
            },
            {
              text: `<i class="feather icon-edit"></i> ${this._translateService.instant(
                'Update Score'
              )}`,
              action: () => this.editor('edit', 'updateScore'),
              extend: 'selected',
            },
            {
              text: `<i class="feather icon-edit"></i>${this._translateService.instant(
                'Edit'
              )}`,
              action: () => this.editor('edit', 'editMatch'),
              extend: 'selected',
            },
            {
              text: `<i class="fa-solid fa-repeat-1"></i> ${this._translateService.instant(
                'Add replace match'
              )}`,

              action: (e, dt, node, config) => {
                // get selected rows
                let selectedRows = dt.rows({ selected: true }).data();
                // check if selected rows > 1
                if (selectedRows.length > 1) {
                  Swal.fire({
                    title: this._translateService.instant('Notification'),
                    text: this._translateService.instant(
                      'Please select only one match'
                    ),
                    icon: 'warning',
                    confirmButtonText: this._translateService.instant('Ok'),
                    customClass: {
                      confirmButton: 'btn btn-primary',
                    },
                  });
                  return;
                }
                let row = selectedRows[0];
                let hasCancel = false;
                if (this.checkRowIsCanclled(row)) {
                  hasCancel = true;
                }
                if (!hasCancel) {
                  Swal.fire({
                    title: this._translateService.instant('Notification'),
                    text: this._translateService.instant(
                      'You can not add replace match for this match'
                    ),
                    icon: 'warning',
                    confirmButtonText: this._translateService.instant('Ok'),
                    customClass: {
                      confirmButton: 'btn btn-primary',
                    },
                  });
                  return;
                }
                this.editor('create', 'addReplaceMatch', row);
              },
              extend: 'selected',
            },
            {
              text: `<i class="fa-solid fa-ban"></i> ${this._translateService.instant(
                'Cancel'
              )}`,
              action: (e, dt, node, config) => {
                // get selected rows
                let selectedRows = dt.rows({ selected: true }).data();
                // check if selected rows has status is not can play
                let hasCancel = false;
                selectedRows.map((row) => {
                  if (this.checkRowIsCanclled(row)) {
                    hasCancel = true;
                  }
                });

                if (hasCancel) {
                  Swal.fire({
                    title: this._translateService.instant('Warning'),
                    text: this._translateService.instant(
                      'You can not cancel match that has been cancelled'
                    ),
                    icon: 'warning',
                    confirmButtonText: this._translateService.instant('OK'),
                    customClass: {
                      confirmButton: 'btn btn-primary',
                    },
                  });

                  return;
                }
                // confirm cancel match
                Swal.fire({
                  title: this._translateService.instant('Are you sure?'),
                  text: this._translateService.instant(
                    'Are you sure you want to cancel this match(s)?'
                  ),
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: this._translateService.instant('Yes'),
                  cancelButtonText: this._translateService.instant('No'),
                }).then((result) => {
                  if (result.value) {
                    this.editor('edit', 'cancelMatch');
                  }
                });
              },

              extend: 'selected',
            },
            {
              text: `<i class="feather icon-trash"></i> ${this._translateService.instant(
                'Delete'
              )}`,
              extend: 'selected',
              action: (e, dt, node, config) => {
                // get selected rows
                let selectedRows = dt.rows({ selected: true }).data();
                // get ids
                let ids = [];
                selectedRows.map((row) => {
                  ids.push(row.id);
                });

                // confirm delete
                Swal.fire({
                  title: this._translateService.instant('Are you sure?'),
                  text: this._translateService.instant(
                    'You will not be able to recover this!'
                  ),
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: this._translateService.instant('Yes'),
                  cancelButtonText: this._translateService.instant('No'),
                }).then((result) => {
                  if (result.value) {
                    // delete
                    this._loadingService.show();
                    this._stageService
                      .deleteMatchesInStage(ids, this.stage.id)
                      .toPromise()
                      .then((resp) => {
                        this._toastr.success(
                          this._translateService.instant('Deleted successfully')
                        );
                        dt.ajax.reload();
                        this.onDataChange.emit(resp);
                      });
                  }
                });
              },
            },
            {
              //  select all
              text: `<i class="bi bi-check2-square"></i> ${this._translateService.instant(
                'Select All'
              )}`,
              action: (e, dt, node, config) => {
                // if has selected rows
                if (dt.rows({ selected: true }).count() > 0) {
                  // deselect all
                  dt.rows().deselect();
                } else {
                  // select all
                  dt.rows().select();
                }
              },
            },
            {
              text: `<i class="fas fa-file-export mr-1"></i> ${this._translateService.instant(
                'Export'
              )}`,
              extend: 'csv',
            },
          ],
        },
      };

      switch (this.stage.type) {
        case AppConfig.TOURNAMENT_TYPES.knockout:
          this.dtOptions.order = [[0, 'asc']];
          // add rowGroup
          this.dtOptions.rowGroup = { dataSrc: 'group_round' };
          // insert round_name column at index 5
          this.dtOptions.columns.splice(5, 0, {
            title: this._translateService.instant('Name'),
            data: 'round_name',
            className: 'text-center',
          });
          break;
        case AppConfig.TOURNAMENT_TYPES.groups:
          this.dtOptions.order = [[1, 'asc']];
          // add rowGroup
          this.dtOptions.rowGroup = { dataSrc: 'group_round' };
          // insert round_name column at index 4
          this.dtOptions.columns.splice(5, 0, {
            title: this._translateService.instant('Name'),
            data: 'round_name',
            className: 'text-center',
            render: function (data, type, row) {
              // split round_name by - and get the last item
              if (!data) return '';
              let round_name = data.split('-').pop();
              return round_name;
            },
          });
          break;
        case AppConfig.TOURNAMENT_TYPES.league:
          break;
        default:
          break;
      }
    });
  }

  checkRowIsCanclled(row) {
    let hasCancel = false;
    // if row has status in AppConfig.CANCEL_MATCH_TYPES
    if (AppConfig.CANCEL_MATCH_TYPES.includes(row.status)) {
      hasCancel = true;
    }
    return hasCancel;
  }

  autoGenerateMatches() {
    this._loadingService.show();
    this._stageService.autoGenerateMatches(this.stage.id).subscribe(
      (resp: any) => {
        console.log(resp);

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.ajax.reload();
          this.onDataChange.emit(resp);
        });
      },
      (error) => {
        Swal.fire({
          title: this._translateService.instant('Error'),
          text: error.message,
          icon: 'error',
          confirmButtonText: this._translateService.instant('OK'),
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      }
    );
  }

  onSuccess($event) {
    if (this.is_score_updated) {
      this.onUpdateScore.emit($event);
    }
    this.onDataChange.emit($event);
  }

  editor(action, fields, row?) {
    this.params.use_data = false;
    this.paramsToPost = null;
    switch (fields) {
      case 'editMatch':
        this.params.title.edit = this._translateService.instant('Edit match');
        this.fields = this.editMatch;
        this.is_score_updated = false;
        break;
      case 'updateScore':
        this.params.title.edit = this._translateService.instant('Update Score');
        this.fields = this.updateScore;
        this.is_score_updated = true;
        break;
      case 'cancelMatch':
        this.params.title.edit = this._translateService.instant('Cancel Match');
        this.fields = this.cancelMatch;
        this.is_score_updated = false;
        break;
      case 'addReplaceMatch':
        this.paramsToPost = {
          'data[0][round_name]': row.round_name,
          'data[0][round_level]': row.round_level,
        };
        this.params.title.edit =
          this._translateService.instant('Add Replace Match');
        this.fields = this.editMatch;
        this.params.use_data = true;
        break;
      default:
        break;
    }
    this.fields_subject.next(this.fields);      
    this.params.action = action;
    this.params.row = row ? row : null;
    this._coreSidebarService.getSidebarRegistry(this.table_name).toggleOpen();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // race condition fails unit tests if dtOptions isn't sent with dtTrigger
      this.dtTrigger.next(this.dtOptions);
    }, 500);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    // this.unlistener();
  }
}
