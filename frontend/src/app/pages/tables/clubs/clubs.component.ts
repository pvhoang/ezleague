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
import { ClubService } from 'app/services/club.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageClubComponent } from './manage-club/manage-club.component';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClubsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  private unlistener: () => void;
  // public
  public form: FormGroup;
  public paramsToPost: any = {};
  public contentHeader: object;
  public table_name = 'clubs-table';
  public params: EditorSidebarParams = {
    editor_id: this.table_name,
    title: {
      create: 'Create new club',
      edit: 'Edit club',
      remove: 'Delete club',
    },
    url: `${environment.apiUrl}/clubs/editor`,
    method: 'POST',
    action: 'create',
  };

  public fields: any[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        required: true,
        label: this._translateService.instant('Name'),
        placeholder: this._translateService.instant('Enter name of club'),
      },
    },
    {
      key: 'code',
      type: 'input',
      props: {
        required: true,
        label: this._translateService.instant('Code'),
        placeholder: this._translateService.instant('Enter code of club'),
      },
    },
    {
      key: 'logo',
      type: 'image-cropper',
      props: {
        upload_url: `${environment.apiUrl}/files/editor`,
        label: this._translateService.instant('Logo'),
        accept: 'image/png, image/jpg, image/jpeg',
        note: this._translateService.instant('Note: Image ratio must be 1:1'),
        config: {
          width: 200,
          height: 200,
          resizableArea: false,
          output: {
            width: 150,
            height: 150,
          },
        },
      },
      defaultValue: '',
    },
    {
      key: 'is_active',
      type: 'input',
      props: {
        label: '',
        type: 'hidden',
      },
      defaultValue: 1,
    },
  ];

  dtOptions: any = {};

  constructor(
    private _http: HttpClient,
    public _coreSidebarService: CoreSidebarService,
    public _translateService: TranslateService,
    public _commonsService: CommonsService,
    public renderer: Renderer2,
    public _clubService: ClubService,
    public _modalService: NgbModal
  ) {}

  ngOnInit(): void {
    console.log('ClubsComponent OnInit');
    this.contentHeader = {
      headerTitle: 'Clubs',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Tables',
            isLink: false,
          },
          {
            name: 'Clubs',
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
          .post<any>(`${environment.apiUrl}/clubs/all`, dataTablesParameters)
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
        { responsivePriority: 1, targets: -1 },
        { responsivePriority: 1, targets: -2 },
        { responsivePriority: 2, targets: -3 },
      ],
      orderBy: [[1, 'asc']],
      displayLength: -1,
      columns: [
        {
          title: this._translateService.instant('Logo'),
          data: 'logo',
          className: 'p-1',
          render: function (data: any, type: any, row: any) {
            let img = document.createElement('img');
            img.src = data;
            img.id = `img-${row.id}`;
            img.className = 'avatar avatar-lg';
            img.style.maxWidth = '50px';
            img.style.backgroundColor = '#fff';
            img.style.objectFit = 'cover';
            if (data == null) {
              img.src = 'assets/images/logo/ezactive_1024x1024.png';
            }
            // check get image error
            img.onerror = function () {
              img.src = 'assets/images/logo/ezactive_1024x1024.png';
              // set src by row id
              $(`#img-${row.id}`).attr('src', img.src);
            };
            return img.outerHTML;
          },
        },
        {
          title: this._translateService.instant('Name'),
          data: 'name',
          className: 'font-weight-bolder p-1',
        },
        {
          title: this._translateService.instant('Code'),
          data: 'code',
          className: 'p-1',
        },
        {
          title: this._translateService.instant('Active'),
          data: 'is_active',
          className: 'text-center p-0',
          render: (data, type, row) => {
            let checked = '';
            if (data) {
              checked = 'checked';
            }
            return `<div class="custom-control custom-switch custom-control-inline">
                    <input ${checked} type="checkbox" class="custom-control-input" club_id="${row.id}" id="switch_${row.id}" />
                    <label class="custom-control-label" for="switch_${row.id}"></label>
                  </div>`;
          },
        },
        {
          title: this._translateService.instant('Action'),
          data: 'id',

          className: 'text-center p-1',
          render: (data, type, row) => {
            return `<button class="btn btn-icon btn-outline-primary" btn_manage="${data}">
            ${this._translateService.instant('Assign Manager')}
            </button>`;
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
    this.unlistener = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('club_id')) {
        console.log(event.target.getAttribute('club_id'));
        this._clubService
          .toggleIsActive(event.target.getAttribute('club_id'))
          .toPromise();
      }

      if (event.target.hasAttribute('btn_manage')) {
        console.log(event.target.getAttribute('btn_manage'));
        let club_id = event.target.getAttribute('btn_manage');
        let modalRef = this._modalService.open(ManageClubComponent, {
          size: 'lg',
          centered: true,
          backdrop: 'static',
        });
        modalRef.componentInstance.club_id = club_id;
      }
    });
  }
  ngOnDestroy(): void {
    console.log('ClubsComponent destroy');
    this.unlistener();
  }
}
