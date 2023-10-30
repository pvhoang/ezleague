import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { EditorSidebarParams } from 'app/interfaces/editor-sidebar';
import { LoadingService } from 'app/services/loading.service';
import moment from 'moment';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-editor-sidebar',
  templateUrl: './editor-sidebar.component.html',
  styleUrls: ['./editor-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
// get form directive
export class EditorSidebarComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  constructor(
    public _coreSidebarService: CoreSidebarService,
    public _http: HttpClient,
    public _translateService: TranslateService,
    public _loading: LoadingService
  ) {}

  public onCloseEvent = new EventEmitter();
  public onOpenEvent = new EventEmitter();

  form = new FormGroup({});
  model: any = {};
  @Input() new_model: any = {};

  @Output() onSuccess: EventEmitter<any> = new EventEmitter();
  @Input() fields: FormlyFieldConfig[];
  @Input() fields_subject: Subject<FormlyFieldConfig[]>;
  @Input() table: any;
  @Input() onSubmit: Function;
  @Input() params: any;
  @Input() paramsToPost: Object;
  defaultParams: EditorSidebarParams = {
    editor_id: 'editor-sidebar',
    title: {
      create: 'Create new record',
      edit: 'Edit record',
      remove: 'Delete record',
    },
    button: {
      create: {
        submit: 'Create',
        cancel: 'Cancel',
      },
      edit: {
        submit: 'Update',
        cancel: 'Cancel',
      },
      remove: {
        submit: 'Delete',
        cancel: 'Cancel',
      },
    },
    url: '',
    method: 'POST',
    action: 'create',
    row: null,
  };
  @Output()
  formChange: EventEmitter<any> = new EventEmitter();

  @Output()
  responseData: EventEmitter<any> = new EventEmitter();

  public rows_selected = [{ id: '0' }];
  public new_params: any = {};
  ngOnInit(): void {
    $.fx.off = true;
    // merge default params with input params
    this.new_params = { ...this.defaultParams, ...this.params };
    if (this.fields_subject) {
      this.fields_subject.subscribe((fields) => {
        this.fields = fields;
        // sync form with fields, remove controls that not in fields
        const controls = this.form.controls;
        for (const key in controls) {
          if (controls.hasOwnProperty(key)) {
            if (!fields.find((field) => field.key === key)) {
              this.form.removeControl(key);
            }
          }
        }
      });
    }
    this._coreSidebarService.setOverlayClickEvent(
      this.new_params.editor_id,
      this.onCloseEvent
    );

    this._coreSidebarService.setOnOpenEvent(
      this.new_params.editor_id,
      this.onOpenEvent
    );
    this.onCloseEvent.subscribe(() => {
      this.reset();
    });

    this.onOpenEvent.subscribe(() => {
      this.new_params = { ...this.defaultParams, ...this.params };

      switch (this.new_params.action) {
        case 'create':
          if (
            this.new_params.hasOwnProperty('use_data') &&
            this.new_params.use_data
          ) {
            this.getSelectedRows(this.new_params.action);
          } else {
            this.rows_selected = [{ id: '0' }];
          }
          break;
        case 'edit':
          this.getSelectedRows(this.new_params.action);
          break;
        case 'remove':
          this.close();
          if (this.getSelectedRows(this.new_params.action)) {
            // Show alert to confirm delete
            Swal.fire({
              title: this._translateService.instant('Are you sure to delete?'),
              text: this._translateService.instant(
                "You won't be able to revert this!"
              ),
              icon: 'warning',
              showCancelButton: true,
              cancelButtonText: this._translateService.instant('Cancel'),
              confirmButtonText: this._translateService.instant('OK'),
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            }).then((result) => {
              if (result.value) {
                this.submit(this.rows_selected[0]);
              } else {
                return;
              }
            });
          }
          break;
        default:
          break;
      }
      // merge model with input model
      this.model = { ...this.model, ...this.new_model };
      // console.log('fields', this.fields);
      // console.log('form', this.form);
    });
    // form change event
    this.form.valueChanges.subscribe((value) => {
      this.formChange.emit(this.form);
    });
  }

  submit(model) {
    console.log('submit', model);
    console.log('form', this.form);
    
    let controls_value = this.form.value;
    if (this.onSubmit) {
      this.onSubmit(model);
    }

    const formData = new FormData();
    formData.append('action', this.new_params.action);
    // const row_id = this.rows_selected.length > 0 ? this.rows_selected[0].id : 0;

    for (const key in controls_value) {
      if (controls_value.hasOwnProperty(key)) {
        for (let i = 0; i < this.rows_selected.length; i++) {
          if (this.rows_selected[i].id) {
            let row_id = this.rows_selected[i].id;
            const newKey = this.convertKey2Editor(key, row_id);
            // if value is FileList object
            if (controls_value[key] instanceof FileList) {
              // get file from FileList object
              const file = controls_value[key].item(0);
              // append file to formData
              formData.append(newKey, file);
            } else {
              formData.append(newKey, this.parseNull(controls_value[key]));
            }
          }
        }
      }
    }

    if (this.paramsToPost) {
      for (const key in this.paramsToPost) {
        if (this.paramsToPost[key] instanceof FileList) {
          const file = this.paramsToPost[key].item(0);
          formData.append(key, file);
        } else {
          formData.append(key, this.paramsToPost[key]);
        }
      }
    }

    // if form is valid
    if (this.form.valid || (this.new_params.action == 'remove' && model.id)) {
      this._loading.show();
      // send data to server
      switch (this.new_params.method) {
        case 'POST':
          this._http.post(this.new_params.url, formData).subscribe(
            (res: any) => {
              if (res.data) {
                let data = res.data;
                switch (this.new_params.action) {
                  case 'create':
                    this.table.dt.row.add(data[0]).draw().node();
                    break;
                  case 'edit':
                    // update all rows with new data
                    data.forEach((row) => {
                      this.table.dt.row('#' + row.id).data(row);
                    });
                    this.table.dt.draw();
                    break;
                  case 'remove':
                    this.table.dt
                      .row('#' + data[0].id)
                      .remove()
                      .draw();
                    break;
                  default:
                    break;
                }
              }
              // run callback function
              this.onSuccess.emit(res);
              return res;
            },
            (error) => {
              console.log(error);
              if (error.hasOwnProperty('fieldErrors')) {
                error.fieldErrors.forEach((error) => {
                  this.form.controls[error.name].setErrors({
                    serverError: error.status,
                  });
                });
              }
              if (error.hasOwnProperty('error')) {
                Swal.fire({
                  title: this._translateService.instant('Warning'),
                  html: error.error,
                  icon: 'warning',
                  customClass: {
                    confirmButton: 'btn btn-primary',
                  },
                });
                this.responseData.emit(error.error);
              }
              switch (this.new_params.action) {
                case 'create':
                  break;
                case 'edit':
                  break;
                case 'remove':
                  this.close();
                  break;
                default:
                  break;
              }
            },
            () => {
              this.close();
            }
          );
          break;
        default:
          break;
      }
    }
  }

  reset() {
    // reset form directives
    this.rows_selected = [];
    this.form.reset();
    this.model = {};
    this.formDirective.resetForm();
  }

  convertKey2Editor(key: string, row_id: string) {
    if (
      this.new_params.action == 'create' &&
      this.new_params.hasOwnProperty('use_data') &&
      this.new_params.use_data
    ) {
      // set  row_id to 0
      row_id = '0';
    }
    // convert key to array
    const keyArr = key.split('.');
    let result = `data[${row_id}]`;
    keyArr.forEach((key) => {
      result += `[${key}]`;
    });
    return result;
  }

  close() {
    this._coreSidebarService
      .getSidebarRegistry(this.new_params.editor_id)
      .toggleOpen(false);
  }
  // ondestroy unsubscribe events
  ngOnDestroy() {
    this.onCloseEvent.unsubscribe();
    this.onOpenEvent.unsubscribe();
  }

  getSelectedRows(action) {
    let model = {};
    this.rows_selected = this.table.dt.rows({ selected: true }).data();

    if (
      this.rows_selected.length == 0 &&
      !this.new_params.row &&
      !this.new_params.row_id
    ) {
      this.close();
      let message = '';
      switch (action) {
        case 'edit':
          message = this._translateService.instant(
            'Please select a row to edit'
          );
          break;
        case 'remove':
          message = this._translateService.instant(
            'Please select a row to remove'
          );
          break;
        case 'create':
          message = this._translateService.instant(
            'Please select a row to use data'
          );
          break;
        default:
          break;
      }
      Swal.fire({
        title: this._translateService.instant('Warning'),
        text: message,
        icon: 'warning',
        confirmButtonText: this._translateService.instant('OK'),
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      }).then((result) => {
        return false;
      });
      return false;
    }

    if (this.new_params.row || this.new_params.row_id) {
      let selector = this.new_params.row
        ? `#${this.new_params.row.id}`
        : `#${this.new_params.row_id} `;
      let row = this.table.dt.row(selector).data();

      //  if found row
      if (row) {
        this.rows_selected = [row];
        this.fields.forEach((field: any) => {
          let value = row[field.key];
          if (
            field.props &&
            field.props.hasOwnProperty('type') &&
            field.props.type == 'date'
          ) {
            value = moment(value).format('YYYY-MM-DD');
          }
          if(!value) value = this.parseNull(field.defaultValue);
          model[field.key] = value;
        });
      }
    } else {
      this.fields.forEach((field: any) => {
        let value = this.rows_selected[0][field.key];
        if (!value) value = this.parseNull(field.defaultValue);
        model[field.key] = value;
        // if field props has key hideOnMultiple and value is true and rows_selected.length > 1 then hide field
        if (
          field.props &&
          field.props.hideOnMultiple &&
          this.rows_selected.length > 1
        ) {
          field.hide = true;
        } else {
          if (field.expressions) {
            // console.log(field.key, eval(field.expressions.hide));
            if (eval(field.expressions.hide)) {
              field.hide = true;
            } else {
              field.hide = false;
            }
          }
        }
      });
    }
    // merge model with new_model
    this.model = model;
    console.log(this.model);
    return true;
  }

  parseNull(value) {
    if (value == null || value == undefined || value == 'TBD') {
      return '';
    } else {
      return value;
    }
  }
}
