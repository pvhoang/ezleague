import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { DataTableDirective } from 'angular-datatables';
import { EditorSidebarParams } from 'app/interfaces/editor-sidebar';
import { TranslateService } from '@ngx-translate/core';
import { CommonsService } from '../../../services/commons.service';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LocationsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  // private unlistener: () => void;
  // public
  public form: FormGroup;
  public paramsToPost: any = {};
  public contentHeader: object;
  public table_name = 'locations-table';
  public params: EditorSidebarParams = {
    editor_id: this.table_name,
    title: {
      create: 'Create new location',
      edit: 'Edit location',
      remove: 'Delete location',
    },
    url: environment.apiUrl + '/locations/editor',
    method: 'POST',
    action: 'create',
  };

  public fields: any[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        label: this._translateService.instant('Name'),
        placeholder: this._translateService.instant('Enter name of location'),
        required: true,
        minLength: 2,
      },
    },
    {
      key: 'address',
      type: 'input',
      props: {
        label: this._translateService.instant('Address'),
        placeholder: this._translateService.instant('Enter address of location'),
        required: true,
        minLength: 2,
      },
    },
    {
      key: 'latitude',
      type: 'input',
      props: {
        label: this._translateService.instant('Latitude'),
        placeholder: this._translateService.instant('Enter latitude of location'),
      },
    },
    {
      key: 'longitude',
      type: 'input',
      props: {
        label: this._translateService.instant('Longitude'),
        placeholder: this._translateService.instant('Enter longtitude of location'),
      },
    },
    {
      key: 'surface',
      type: 'input',
      props: {
        label: this._translateService.instant('Surface'),
        placeholder: this._translateService.instant('Enter surface of location'),
      },
    },
    {
      key: 'parking',
      type: 'input',
      props: {
        label: this._translateService.instant('Parking'),
        placeholder: this._translateService.instant('Enter parking of location'),
      },
    },
  ];

  dtOptions: any = {};

  constructor(
    private _http: HttpClient,
    public _coreSidebarService: CoreSidebarService,
    public _translateService: TranslateService,
    public _commonsService: CommonsService,
    public renderer: Renderer2,
    public _modalService: NgbModal
  ) {}

  ngOnInit(): void {
    console.log('LocationsComponent OnInit');
    this.contentHeader = {
      headerTitle: 'Locations',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Tables',
            isLink: false,
          },
          {
            name: 'Locations',
            isLink: false,
          },
        ],
      },
    };

    this.dtOptions = {
      dom: this._commonsService.dataTableDefaults.dom,
      select: 'single',
      // serverSide: true,
      rowId: 'id',
      ajax: (dataTablesParameters: any, callback) => {
        this._http
          .post<any>(`${environment.apiUrl}/locations/all`, dataTablesParameters)
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
      lengthMenu: this._commonsService.dataTableDefaults.lengthMenu,
      columnDefs: [
        { responsivePriority: 0, targets: -1 },
        { responsivePriority: 1, targets: -2 },
      ],
      displayLength: -1,
      columns: [
        {
          title: this._translateService.instant('Name'),
          data: 'name',
          className: 'font-weight-bolder p-1',
        },
        {
          title: this._translateService.instant('Address'),
          data: 'address',
          className: 'p-1',
        },
        {
          title: this._translateService.instant('Latitude'),
          data: 'latitude',
          className: 'p-1',
        },
        {
          title: this._translateService.instant('Longitude'),
          data: 'longitude',
          className: 'p-1',
        },
        {
          title: this._translateService.instant('Surface'),
          data: 'surface',
          className: 'p-1',
        },
        {
          title: this._translateService.instant('Parking'),
          data: 'parking',
          className: 'p-1',
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
  }

  editor(action) {
    this.params.action = action;
    this._coreSidebarService.getSidebarRegistry(this.table_name).toggleOpen();
  }

  formChange($event) {
    this.form = $event;
  }

  onSubmitted() {
    switch ('create') {
      case 'create':
        // if form is not empty
        if (this.form) {
          // this.paramsToPost = {
          //   "data[0][photo]": "hehe",
          // };
        }
        break;
    }
  }

  ngAfterViewInit(): void {
  }
  ngOnDestroy(): void {
    console.log('LocationsComponent destroy');
    // this.unlistener();
  }
}
