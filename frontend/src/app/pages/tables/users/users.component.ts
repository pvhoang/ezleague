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
import { UserService } from 'app/services/user.service';
import { RoleService } from 'app/services/role.service';
import { LoadingService } from '../../../services/loading.service';
import { RolesComponent } from './role-permissions/roles/roles.component';
import Swal from 'sweetalert2';
import moment from 'moment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit {
  constructor(
    private _http: HttpClient,
    public _coreSidebarService: CoreSidebarService,
    public _translateService: TranslateService,
    public _commonsService: CommonsService,
    public renderer: Renderer2,
    public _clubService: ClubService,
    public _modalService: NgbModal,
    public _userService: UserService,
    public _roleService: RoleService,
    public _loadingService: LoadingService
  ) {}

  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  private unlistener: () => void;
  // public
  public roles = [];
  public form: FormGroup;
  public paramsToPost: any = {};
  public contentHeader: object;
  public table_name = 'users-table';
  current_role_id = 2;
  public params: EditorSidebarParams = {
    editor_id: this.table_name,
    title: {
      create: this._translateService.instant('Create user'),
      edit: this._translateService.instant('Edit user'),
      remove: this._translateService.instant('Delete user'),
    },
    url: `${environment.apiUrl}/users/editor`,
    method: 'POST',
    action: 'create',
    // icon
  };

  public fields: any[] = [
    {
      key: 'first_name',
      type: 'input',
      props: {
        label: 'Surname',
        placeholder: 'Surname',
        required: true,
        pattern: this._commonsService.regex_name,
        translate: true,
      },
    },
    {
      key: 'last_name',
      type: 'input',
      props: {
        label: 'Other names',
        placeholder: 'Other names',
        required: true,
        pattern: this._commonsService.regex_name,
        translate: true,
      },
    },
    {
      key: 'email',
      type: 'input',
      props: {
        label: 'Email',
        placeholder: 'Email',
        required: true,
        translate: true,
      },
    },
    {
      key: 'password',
      type: 'input',
      props: {
        label: 'Password',
        minLength: 5,
        placeholder: 'Password',
        required: true,
        translate: true,
      },
    },
    {
      key: 'role_id',
      type: 'select',
      props: {
        label: 'Role',
        placeholder: 'Role',
        required: true,
        options: this.roles,
        translate: true,
      },
    },
  ];

  dtOptions: any = {};

  ngOnInit(): void {
    console.log('UsersComponent OnInit');
    this.contentHeader = {
      headerTitle: 'Users',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Tables',
            isLink: false,
          },
          {
            name: 'Users',
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
      stateSave: true,
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.role_id = this.current_role_id;
        this._loadingService.show();
        this._http
          .post<any>(`${environment.apiUrl}/users/role`, dataTablesParameters)
          .subscribe((resp: any) => {
            if (resp.hasOwnProperty('options')) {
              this.setRoles(resp.options.role);
            }
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
      columnDefs: [{ responsivePriority: 1, targets: -1 }],
      columns: [
        {
          data: null,
          className: 'font-weight-bolder',
          render: (data, type, row) => {
            return data.first_name + ' ' + row.last_name;
          },
        },
        {
          data: 'email',
        },
        {
          data: 'role.name',
          render: (data, type, row) => {
            return this._translateService.instant(data);
          },
        },
        {
          data: 'last_login',
          render: (data, type, row) => {
            // dd/mm/yyyy hh:mm:ss
            if (data == null) {
              return ``;
            } else {
              return moment(data).format('YYYY-MM-DD HH:mm:ss');
            }

            return `${data}`;
          },
        },
        {
          data: 'role.id',
          visible: false,
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
          {
            extend: 'colvis',
            text:
              '<i class="feather icon-eye"></i> ' +
              this._translateService.instant('Column'),
          },
        ],
      },
    };
  }

  editor(action) {
    this.params.action = action;
    switch (action) {
      case 'create':
        break;
      case 'edit':
        // get field has key password
        const passwordField = this.fields.find(
          (field) => field.key === 'password'
        );
        //  is not required
        passwordField.props.required = false;
    }

    this._coreSidebarService.getSidebarRegistry(this.table_name).toggleOpen();
  }

  formChange($event) {
    this.form = $event;
  }

  ngAfterViewInit(): void {
    this.unlistener = this.renderer.listen('document', 'change', (event) => {
      if (event.target.hasAttribute('id')) {
        if (event.target.getAttribute('id') === 'selectRole') {
          this.current_role_id = event.target.value;
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
          });
          // this.filterData(event.target.value, -1);
        }
      }
    });
    // add selectRole to element has class dt-buttons when table is rendered
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on('draw', () => {
        const dtButtons = document.getElementsByClassName('dt-buttons');

        if (dtButtons.length > 0 && !document.getElementById('selectRole')) {
          // create div element and add label, selectRole to it
          const div: any = document.createElement('div');
          const all_text = this._translateService.instant('All');
          const role_text = this._translateService.instant('Role');
          div.className = 'form-group mt-1';

          div.innerHTML = `<label for="selectRole" class="mr-1 ">${role_text}</label>`;
          const selectRole: any = document.createElement('select');
          selectRole.className = 'form-control ';
          selectRole.style = 'width: 200px; display: inline-block;';
          selectRole.id = 'selectRole';
          selectRole.innerHTML = `<option value="0">${all_text}</option>`;
          // innerHTML of selectRole is foreach list of roles
          if (this.roles.length > 0) {
            this.roles.forEach((role) => {
              let role_name = this._translateService.instant(role.name);

              selectRole.innerHTML += `<option value="${role.id}">${role_name}</option>`;
            });
          }
          div.appendChild(selectRole);
          dtButtons[0].appendChild(div);
          // set value of selectRole is current_role_id
          selectRole.value = this.current_role_id;
        }
      });
    });
  }

  //filter data
  filterData(value, column) {
    //  filter datatable by role id
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(column).search(value).draw();
    });
  }

  modalOpen(action, data = null) {
    let params = {};
    switch (action) {
      case 'create':
        params = {
          action: action,
          title: 'Add new role',
        };
        break;
      case 'edit':
        params = {
          action: action,
          title: this._translateService.instant('Edit Role'),
          data: data,
        };
    }
    const modalRef = this._modalService.open(RolesComponent, {
      centered: true,
      size: 'md',
      backdrop: 'static',
      keyboard: true,
    });
    modalRef.componentInstance.onSuccessful.subscribe((data) => {
      this.setRoles(data);
    });
    modalRef.componentInstance.params = params;
  }

  onEditorSuccess($event) {
    if ($event.hasOwnProperty('options')) {
      this.setRoles($event.options.role);
    }
  }

  deleteRole(id) {
    // show alert confirm
    Swal.fire({
      title: this._translateService.instant('Are you sure to delete?'),
      text: this._translateService.instant("You won't be able to revert this!"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this._translateService.instant('Yes'),
      cancelButtonText: this._translateService.instant('No'),
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ml-1',
      },
    }).then((result) => {
      if (result.value) {
        let formData = new FormData();
        formData.append('id', id);
        this._roleService
          .crudRole(formData, 'delete')
          .toPromise()
          .then((resp) => {
            console.log(resp);
            // find index of role has id = id
            const index = this.roles.findIndex((role) => role.id === id);
            // remove role has id = id
            if (index > -1) {
              this.roles.splice(index, 1);
            }
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: this._translateService.instant('Error'),
              text: error.message,
              confirmButtonText: this._translateService.instant('Ok'),
              customClass: {
                confirmButton: 'btn btn-success',
              },
            });
          });
      }
    });
  }

  setRoles(data) {
    this.roles = data;
    // get field has key role_id
    const roleField = this.fields.find((field) => field.key === 'role_id');
    // set options for role field
    let current_roles = [];
    data.forEach((role) => {
      let role_name = this._translateService.instant(role.name);
      current_roles.push({
        label: role_name,
        value: role.id,
      });
    });
    roleField.props.options = current_roles;
  }

  // get per

  ngOnDestroy(): void {
    console.log('UsersComponent destroy');
    this.unlistener();
  }
}
