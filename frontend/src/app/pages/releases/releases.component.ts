import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { EditorSidebarParams } from 'app/interfaces/editor-sidebar';
import { CommonsService } from 'app/services/commons.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss'],
})
export class ReleasesComponent implements OnInit {
  constructor(
    private _http: HttpClient,
    public _coreSidebarService: CoreSidebarService,
    public _translateService: TranslateService,
    public _commonsService: CommonsService,
    public render: Renderer2,
    public router: Router
  ) {}
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<ADTSettings> = new Subject<ADTSettings>();
  public table_name = 'releases-table';
  public params: EditorSidebarParams = {
    editor_id: this.table_name,
    title: {
      create: 'Create new Release',
      edit: 'Edit Release',
      remove: 'Delete Release',
    },
    url: `${environment.apiUrl}/releases/editor`,
    method: 'POST',
    action: 'create',
  };
  model: any = {};
  public fields: FormlyFieldConfig[] = [
    {
      type: 'input',
      key: 'name',
      props: {
        translate: true,
        label: 'Name',
        required: true,
      },
      expressions: {
        hide: 'model.show_download_link',
      },
    },
    {
      type: 'input',
      key: 'version',
      props: {
        translate: true,
        label: 'Version',
        required: true,
        pattern: /[\S]/,
      },
      expressions: {
        hide: 'model.show_download_link',
      },
    },
    {
      type: 'input',
      key: 'towards_version',
      props: {
        translate: true,
        label: 'Towards Version',
        required: true,
        pattern: /[\S]/,
      },
      expressions: {
        hide: 'model.show_download_link',
      },
    },
    {
      type: 'radio',
      key: 'type',
      props: {
        translate: true,
        label: 'Type',
        required: true,
        options: [
          { label: 'Stable', value: 'stable' },
          { label: 'Beta', value: 'beta' },
          { label: 'Alpha', value: 'alpha' },
        ],
      },
      expressions: {
        hide: 'model.show_download_link',
      },
      defaultValue: 'alpha',
    },
    {
      type: 'file',
      key: 'download_link',
      props: {
        translate: true,
        label: 'Download Link',
        required: true,
        upload_url: `${environment.apiUrl}/releases/editor`,
        accept: '.zip',
        multiple: false,
        custom_params: {
          release_id: 'model.id',
        },
      },
      expressions: {
        hide: '!model.show_download_link',
      },
    },

    {
      type: 'input',
      key: 'changelog',
      props: {
        translate: true,
        label: 'Change log',
      },
      expressions: {
        hide: 'model.show_download_link',
      },
    },
    {
      type: 'textarea',
      key: 'description',
      props: {
        translate: true,
        label: 'Description',
      },
      expressions: {
        hide: 'model.show_download_link',
      },
    },
    {
      type: 'input',
      key: 'id',
      props: {
        type: 'hidden',
      },
    },
    {
      type: 'input',
      key: 'show_download_link',
      props: {
        type: 'hidden',
      },
      defaultValue: false,
    },
  ];
  ngOnInit(): void {
    this.buildTable();
  }

  editor(action, row_id?, show_download_link?) {
    this.params.action = action;
    this.params.row_id = row_id ? row_id : null;
    this.model.show_download_link = show_download_link
      ? show_download_link
      : false;
    this._coreSidebarService.getSidebarRegistry(this.table_name).toggleOpen();
  }

  buildTable() {
    this.dtOptions = {
      dom: this._commonsService.dataTableDefaults.dom,
      select: 'single',
      // serverSide: true,
      rowId: 'id',
      ajax: (dataTablesParameters: any, callback) => {
        this._http
          .post<any>(`${environment.apiUrl}/releases/all`, dataTablesParameters)
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
        // { targets: 0, responsivePriority: 1 },
        // { targets: -1, responsivePriority: 2 },
        // { targets: -2, responsivePriority: 3 },
      ],
      columns: [
        {
          title: this._translateService.instant('Name'),
          data: 'name',
          className: 'font-weight-bolder',
        },
        {
          title: this._translateService.instant('Version'),
          data: 'version',
        },
        {
          title: this._translateService.instant('Towards Version'),
          data: 'towards_version',
        },
        {
          title: this._translateService.instant('Type'),
          data: 'type',
        },
        {
          title: this._translateService.instant('Download Link'),
          data: 'download_link',
          render: (data, type, row) => {
            if (!data) {
              return `<button realease_id="${
                row.id
              }" class="btn btn-sm btn-danger">${this._translateService.instant(
                'Upload'
              )} <i class="fa-regular fa-upload"></i> </button>`;
            } else {
              return data;
            }
          },
        },
        {
          title: this._translateService.instant('Change log'),
          data: 'changelog',
        },
        {
          title: this._translateService.instant('Description'),
          data: 'description',
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
        ],
      },
    };
  }

  private unlistener: () => void;
  ngAfterViewInit(): void {
    this.unlistener = this.render.listen(document, 'click', (event: any) => {
      if (event.target.hasAttribute('realease_id')) {
        let row_id = event.target.getAttribute('realease_id');
        this.editor('edit', row_id, true);
      }

      this.fields;
    });

    setTimeout(() => {
      // race condition fails unit tests if dtOptions isn't sent with dtTrigger
      this.dtTrigger.next(this.dtOptions);
    }, 500);
  }

  ngOnDestroy(): void {
    this.unlistener();
    this.dtTrigger.unsubscribe();
  }
}
