import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EVENT_ACTIVE, EVENT_ARCHIVED } from './events-constants';
import {
  AfterViewInit,
  Component,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DataTableDirective } from 'angular-datatables';
import { EditorSidebarParams } from 'app/interfaces/editor-sidebar';
import { TranslateService } from '@ngx-translate/core';
import { CommonsService } from '../../../services/commons.service';
import { Router } from '@angular/router';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { EZBtnActions } from 'app/components/btn-dropdown-action/btn-dropdown-action.component';
import moment from 'moment';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EventsComponent implements OnInit, AfterViewInit {
  private unlistener: () => void;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  @ViewChild('dropdownAction') dropdownAction: TemplateRef<any>;
  // public
  public contentHeader: object;
  public table_name = 'seasons-table';
  public params: EditorSidebarParams = {
    editor_id: this.table_name,
    title: {
      create: 'Create new event',
      edit: 'Edit event',
      remove: 'Delete event',
    },
    url: `${environment.apiUrl}/seasons/editor`,
    method: 'POST',
    action: 'create',
  };

  public fields: any[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        label: this._translateService.instant('Event name'),
        placeholder: this._translateService.instant('Enter name of event'),
        required: true,
      },
    },
    {
      key: 'fee',
      type: 'input',
      props: {
        type: 'number',
        label: this._translateService.instant('Event fee'),
        placeholder: this._translateService.instant('Enter fee of event'),
        required: true,
        min: 0,
        max: 9999999999,
      },
    },
    {
      key: 'start_date',
      type: 'input',
      props: {
        type: 'date',
        label: this._translateService.instant('Start date'),
        placeholder: this._translateService.instant(
          'Enter start date of event'
        ),
        required: true,
        max: '9999-12-31',
        min: moment().format('YYYY-MM-DD'),
      },
    },
    {
      key: 'end_date',
      type: 'input',
      props: {
        type: 'date',
        label: this._translateService.instant('End date'),
        placeholder: this._translateService.instant('Enter end date of event'),
        required: true,
        max: '9999-12-31',
        min: moment().format('YYYY-MM-DD'),
      },
    },
    {
      key: 'start_register_date',
      type: 'input',
      props: {
        type: 'date',
        label: this._translateService.instant('Start register date'),
        placeholder: this._translateService.instant(
          'Enter start register date of event'
        ),
        required: true,
        max: '9999-12-31',
        min: moment().format('YYYY-MM-DD'),
      },
    },
    {
      key: 'status',
      type: 'select',
      props: {
        label: this._translateService.instant('Status'),
        placeholder: this._translateService.instant('Select status of event'),
        required: true,
        options: [
          {
            label: this._translateService.instant('Active'),
            value: EVENT_ACTIVE,
          },
          {
            label: this._translateService.instant('Archived'),
            value: EVENT_ARCHIVED,
          },
        ],
      },
    },
  ];

  public rowActions: EZBtnActions[] = [
    {
      label: 'Edit',
      onClick: (row: any) => {
        this.editor('edit', row);
      },
      icon: 'fa-regular fa-pen-to-square',
    },
    {
      type: 'collection',
      buttons: [
        {
          label: this._translateService.instant('Groups'),
          onClick: (row: any) => {
            this.router.navigate(['tables', 'events', row.id, 'groups']);
          },
          icon: 'fa-duotone fa-people-group',
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

  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  constructor(
    private _http: HttpClient,
    public _coreSidebarService: CoreSidebarService,
    public _translateService: TranslateService,
    public _commonsService: CommonsService,
    public render: Renderer2,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Events',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Tables',
            isLink: false,
          },
          {
            name: 'Events',
            isLink: false,
          },
        ],
      },
    };
    setTimeout(() => {
      this.dtOptions = {
        dom: this._commonsService.dataTableDefaults.dom,
        select: 'single',
        // serverSide: true,
        rowId: 'id',
        ajax: (dataTablesParameters: any, callback) => {
          this._http
            .post<any>(
              `${environment.apiUrl}/seasons/all`,
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
        responsive: true,
        scrollX: false,
        language: this._commonsService.dataTableDefaults.lang,
        columnDefs: [
          { targets: 0, responsivePriority: 1 },
          { targets: -1, responsivePriority: 2 },
          { targets: -2, responsivePriority: 3 },
        ],
        columns: [
          {
            data: 'name',
            className: 'font-weight-bolder',
          },
          // { data: "type", className: "center" },
          {
            data: 'start_date',
            className: 'center',
            render: (data, type, row) => {
              return moment(data).format('YYYY-MM-DD');
            },
          },
          {
            data: 'end_date',
            className: 'center',
            render: (data, type, row) => {
              return moment(data).format('YYYY-MM-DD');
            },
          },
          {
            data: 'start_register_date',
            className: 'center',
            render: (data, type, row) => {
              return moment(data).format('YYYY-MM-DD');
            },
          },
          { data: 'fee', className: 'center' },
          {
            data: 'status',
            className: 'center',
            render: (data, type, row) => {
              if (data == EVENT_ACTIVE) {
                return (
                  `<span class="badge badge-light-success">` +
                  this._translateService.instant('Active') +
                  `</span>`
                );
              } else {
                return (
                  `<span class="badge badge-light-danger">` +
                  this._translateService.instant('Archived') +
                  `</span>`
                );
              }
            },
          },
          {
            width: '100px',
            data: null,
            defaultContent: '',
            ngTemplateRef: {
              ref: this.dropdownAction,
              context: {
                captureEvents: this.onCaptureEvent.bind(this),
              },
            },
          },
        ],
        buttons: {
          dom: this._commonsService.dataTableDefaults.buttons.dom,
          buttons: [
            {
              text:
                '<i class="feather icon-plus"></i> ' +
                this._translateService.instant('Add'),
              action: () => this.editor('create'),
            },
            {
              text:
                '<i class="feather icon-edit"></i> ' +
                this._translateService.instant('Edit'),
              action: () => this.editor('edit'),
              extend: 'selected',
            },
            {
              text:
                '<i class="feather icon-trash"></i> ' +
                this._translateService.instant('Delete'),
              action: () => this.editor('remove'),
              extend: 'selected',
            },
          ],
        },
      };
    });
  }

  editor(action, row?) {
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

  onCaptureEvent(event: any) {
    // console.log(event);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    // this.unlistener();
  }
}
