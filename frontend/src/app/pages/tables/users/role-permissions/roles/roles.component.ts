import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonsService } from 'app/services/commons.service';
import { LoadingService } from 'app/services/loading.service';
import { PermissionService } from 'app/services/permission.service';
import { RoleService } from 'app/services/role.service';
import Swal from 'sweetalert2';
import { AuthService } from 'app/services/auth.service';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { menu } from 'app/menu/menu';

@Component({
  selector: 'app-clubs',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RolesComponent implements OnInit {
  constructor(
    private _http: HttpClient,
    public _coreSidebarService: CoreSidebarService,
    public _translateService: TranslateService,
    public _commonsService: CommonsService,
    public _modalService: NgbModal,
    public _loadingService: LoadingService,
    public _permissionService: PermissionService,
    public _roleService: RoleService,
    public _authService: AuthService,
    public _coreMenuService: CoreMenuService
  ) {
    this.form = new FormGroup({
      id: new FormControl('', []),
      name: new FormControl('', [Validators.required]),
      permissions: new FormControl([], [Validators.required]),
      description: new FormControl('', []),
    });
    this.getPermissions();
  }
  @Input() public params: any = {
    action: 'create',
    title: 'Add new role',
  };
  @Output() public onSuccessful = new EventEmitter<any>();
  // public
  public form: FormGroup;
  public permissions = [];
  public selected: any = [];
  submitted = false;

  ngOnInit(): void {
    this._loadingService.show();
    if (this.params.action === 'edit') {
      if (this.params.data) {
        for (const key in this.params.data) {
          if (key === 'permissions') {
            this.selected = this.params.data[key];
          }
          if (this.f.hasOwnProperty(key)) {
            this.f[key].setValue(this.params.data[key]);
          }
        }
      }
    }
  }

  ngAfterViewInit(): void {}

  get f() {
    return this.form.controls;
  }
  closeModal() {
    console.log('closeModal');
    this._modalService.dismissAll();
  }

  // get permissions
  getPermissions() {
    console.log('getPermissions');
    this._permissionService
      .getAll()
      .toPromise()
      .then((res: any) => {
        this.permissions = res;
        if (this.params.action === 'edit') {
          if (this.params.data) {
            this.permissions.forEach((item) => {
              let index = this.selected.findIndex((x) => x.id === item.value);
              if (index !== -1) {
                item.checked = true;
              }
            });
          }
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: this._translateService.instant('Error'),
          text: err.message,
          confirmButtonText: this._translateService.instant('OK'),
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      });
  }

  // on selected
  onSelected(event) {
    let checkbox = event.target;
    let value = {
      id: checkbox.value,
      read: true,
      write: true,
      delete: true,
    };

    if (checkbox.checked) {
      this.selected.push(value);
    } else {
      // find index
      let index = this.selected.findIndex((x) => x.id == value.id);
      if (index !== -1) {
        this.selected.splice(index, 1);
      }
    }
    // set form
    this.f['permissions'].setValue(this.selected);
  }

  onSelectAll($event) {
    if ($event.target.checked) {
      this.selected = this.permissions.map((item) => {
        item.checked = true;
        return {
          id: item.value,
          read: true,
          write: true,
          delete: true,
        };
      });
    } else {
      this.permissions.forEach((item) => {
        item.checked = false;
      });
      this.selected = [];
    }
    // set form
    this.f['permissions'].setValue(this.selected);
  }
  ngOnDestroy(): void {
    console.log('RolesComponent destroy');
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    // create form data
    let formData = new FormData();
    formData.append('id', this.f['id'].value);
    formData.append('name', this.f['name'].value);
    formData.append(
      'description',
      this.f['description'].value ? this.f['description'].value : ''
    );
    formData.append(
      'permissions',
      JSON.stringify(this.form.controls['permissions'].value)
    );

    // store
    this._roleService.crudRole(formData, this.params.action).subscribe(
      (res) => {
        this.onSuccessful.emit(res);
        this._authService.getProfile().subscribe((data) => {
          // console.log('data', data);
          this._coreMenuService.unregister('main');
          this._coreMenuService.register('main', menu);
          this._coreMenuService.setCurrentMenu('main');
        });
        this._modalService.dismissAll();
      },
      (err) => {
        if (err.hasOwnProperty('errors')) {
          for (const key in err.errors) {
            if (this.f.hasOwnProperty(key)) {
              this.f[key].setErrors({ serverError: err.errors[key][0] });
            } else {
              Swal.fire({
                icon: 'error',
                title: this._translateService.instant('Warning'),
                text: err.errors[key][0],
                confirmButtonText: this._translateService.instant('OK'),
                customClass: {
                  confirmButton: 'btn btn-primary',
                },
              });
            }
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: this._translateService.instant('Error'),
            text: err.message,
            confirmButtonText: this._translateService.instant('OK'),
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });
        }
      }
    );
  }
}
