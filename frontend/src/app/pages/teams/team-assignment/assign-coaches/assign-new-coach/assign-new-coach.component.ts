import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'app/services/auth.service';
import { CommonsService } from 'app/services/commons.service';
import { LoadingService } from 'app/services/loading.service';
import { TeamService } from 'app/services/team.service';
import { UserService } from 'app/services/user.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-new-coach',
  templateUrl: './assign-new-coach.component.html',
  styleUrls: ['./assign-new-coach.component.scss'],
})
export class AssignNewCoachComponent implements OnInit {
  dtOptions1: any = {};
  dtTrigger: any = {};
  public params: any;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  public submitted = false;
  public loading = false;
  // variable to show/hide form add new coach
  public showForm = false;
  private _unsubscribeAll: Subject<any>;
  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-6',
          type: 'input',
          key: 'email',
          props: {
            label: 'Email',
            placeholder: 'Enter email',
            translate: true,
            change: (field, $event) => {
              console.log('change');
              this.getUserByEmail($event.target.value);
            },
            required: true,
          },
        },
        {
          className: 'col-6',
          type: 'input',
          key: 'phone',
          props: {
            label: 'Phone',
            placeholder: 'Enter phone',
            translate: true,
            disabled: false,
            type: 'number',
          },
          expressions: {
            'props.disabled': `model.field_exist?.includes(field.key)`,
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-6',
          type: 'input',
          key: 'first_name',
          props: {
            label: 'Surname',
            placeholder: 'Enter surname',
            translate: true,
            disabled: false,
            pattern: /[\S]/,
            required: true,
          },
          expressions: {
            'props.disabled': `model.field_exist?.includes(field.key)`,
          },
        },
        {
          className: 'col-6',
          type: 'input',
          key: 'last_name',
          props: {
            label: 'Other Name',
            placeholder: 'Enter other name',
            translate: true,
            disabled: false,
            pattern: /[\S]/,
            required: true,
          },
          expressions: {
            'props.disabled': `model.field_exist?.includes(field.key)`,
          },
        },
      ],
    },
    {
      key: 'field_exist',
      type: 'input',
      props: {
        type: 'hidden',
      },
    },
  ];

  constructor(
    public modalService: NgbModal,
    public _translateService: TranslateService,
    public _commonsService: CommonsService,
    private _formBuilder: UntypedFormBuilder,
    public _http: HttpClient,
    public renderer: Renderer2,
    private _authService: AuthService,
    private _toastrService: ToastrService,
    public _teamService: TeamService,
    public loadingService: LoadingService,
    public _userService: UserService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    let params = this.params;
    console.log('params', params);

    let current_season_coach_url = `${environment.apiUrl}/clubs/${params.club_id}/coaches`;

    this.dtOptions1 = this.buildDtOptions1(current_season_coach_url, params);
  }

  get f() {
    return this.form.controls;
  }

  buildDtOptions1(url, params: any) {
    return {
      dom: this._commonsService.dataTableDefaults.dom,
      ajax: (dataTablesParameters: any, callback) => {
        if (params) {
          dataTablesParameters['team_id'] = parseInt(params.team_id);
        }
        this._http
          .post<any>(`${url}`, dataTablesParameters)
          .subscribe((resp: any) => {
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
      // fake data
      responsive: true,
      scrollX: false,
      language: this._commonsService.dataTableDefaults.lang,
      lengthMenu: this._commonsService.dataTableDefaults.lengthMenu,
      displayLength: 10,
      columnDefs: [
        { responsivePriority: 1, targets: 0 },
        { responsivePriority: 1, targets: -1 },
        { responsivePriority: 2, targets: 1 },
      ],
      columns: [
        {
          data: null,
          className: 'font-weight-bolder',
          render: (data, type, row) => {
            return `${row.first_name} ${row.last_name}`;
          },
        },
        {
          data: 'email',
        },
        {
          data: 'phone',
        },
        {
          data: null,
          render: (data, type, row) => {
            return `<button class="btn btn-primary btn-sm" 
            data-row-value = '${JSON.stringify(row)}'
            action="assign">${this._translateService.instant(
              'Assign'
            )}</button>`;
          },
        },
      ],
      buttons: [],
    };
  }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('data-row-value')) {
        let row = event.target.getAttribute('data-row-value');
        row = JSON.parse(row);

        this.editor(event.target.getAttribute('action'), row);
      }
    });
  }

  editor(action, row) {
    switch (action) {
      case 'assign':
        Swal.fire({
          title: this._translateService.instant('Are you sure?'),
          html:
            `
          <div class="text-center">
            <img src="assets/images/alerts/Frame1.svg" width="200px" height="149px">
            <p class="text-center">` +
            this._translateService.instant(
              'You want to assign this coach to this team'
            ) +
            `?
            </p>
          </div>`,
          reverseButtons: true,
          showCancelButton: true,
          confirmButtonText: this._translateService.instant('Yes'),
          confirmButtonColor: '#3085d6',
          cancelButtonText:
            '<span class="text-primary">' +
            this._translateService.instant('Cancel') +
            '</span>',
          cancelButtonColor: '#d33',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary mr-1',
            cancelButton: 'btn btn-outline-primary mr-1',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            let team_id = this.params.team_id;
            let user_id = row.id;
            let params: FormData = new FormData();
            params.append('action', 'create');
            params.append('data[0][team_id]', team_id);
            params.append('data[0][user_id]', user_id);

            this._teamService
              .editorTableTeamCoaches(params)
              .subscribe((resp: any) => {
                if (resp) {
                  this._toastrService.success(
                    this._translateService.instant(
                      'Coaches assigned successfully'
                    )
                  );

                  // disable button
                  let button = document.querySelector(
                    `button[action="assign"][data-row-value='${JSON.stringify(
                      row
                    )}']`
                  );
                  button.setAttribute('disabled', 'disabled');
                  button.classList.add('disabled');
                  // change text
                  button.innerHTML = this._translateService.instant('Assigned');
                }
              });
          }
        });
        break;
      default:
        break;
    }
  }

  onClickAddNewCoach() {
    this.form.reset();
    this.model = {};
    this.submitted = false;
    this.showForm = true;
  }

  onClickCancel() {
    this.showForm = false;
  }

  getUserByEmail(email) {
    if (!email.trim()) return;

    this._userService.getByEmail(email).subscribe(
      (resp: any) => {
        if (resp) {
          if (resp.data) {
            let data = resp.data;
            this.disableFieldByData(data);
            console.log('resp', resp);
          }
        }
      },
      (error) => {
        this.disableFieldByData();
        console.log('error', error);
      }
    );
  }

  disableFieldByData(data: any = null) {
    let field_exist = '';
    let model = {};
    if (data) {
      // pluck key data if value not null
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          field_exist += `${key}|`;
        }
      });
    }

    this.fields.forEach((field: any) => {
      console.log('field', field);
      let key;
      if (field.hasOwnProperty('fieldGroup')) {
        let fieldGroup = field.fieldGroup;
        fieldGroup.forEach((field: any) => {
          key = field.key;
          this.setDataToModel(data, key, model);
        });
      } else {
        key = field.key;
        this.setDataToModel(data, key, model);
      }
    });
    console.log('model', model);

    model['field_exist'] = field_exist;
    // merge model
    this.model = { ...this.model, ...model };
  }

  setDataToModel(data: any, key: any, model) {
    let value = '';
    if (data) {
      value = data[key];
    }
    console.log('value', value);

    if (key != 'field_exist' && key != 'email') {
      model[key] = value;
    }
  }
  onSubmit(model) {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    } else {
      // show loading spinner
      this.loading = true;

      // create new coach and assign to team
      this._teamService
        .assignNewCoachToTeam(this.params.team_id, model)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          (res: any) => {
            this.loading = false;
            // show success message
            Swal.fire({
              title: this._translateService.instant('Success'),
              text: res.message,
              // icon: "success",
              imageUrl: 'assets/images/alerts/signup.png',
              confirmButtonText: this._translateService.instant('OK'),
              customClass: {
                container: 'signup-successfull',
                confirmButton: 'btn btn-gradient-primary round-15',
              },
            });

            // hide form
            this.showForm = false;
          },
          (error) => {
            // hide loading spinner
            this.loading = false;
            // add error to form control
            let errors = error.errors;
            for (let key in errors) {
              if (errors.hasOwnProperty(key)) {
                this.form.controls[key].setErrors({
                  serverError: errors[key][0],
                });
              }
            }
            // check length of array
            if (errors.length > 0) {
              // show error message
              this._toastrService.error(error.message, 'Error', {
                closeButton: true,
                tapToDismiss: false,
              });
            }
          }
        );
    }
  }

  onClose() {
    this.modalService.dismissAll();
  }
}
