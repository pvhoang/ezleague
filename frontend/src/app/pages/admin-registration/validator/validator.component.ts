import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from 'app/services/loading.service';
import { RegistrationService } from 'app/services/registration.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonsService } from 'app/services/commons.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { environment } from 'environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from 'app/services/settings.service';
import { _ } from 'core-js';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.scss'],
})
export class ValidatorComponent implements OnInit {
  @Input() registrations: any;
  @Input() status: any;
  @Input() dtElement: any;
  form = new FormGroup({});
  public model = {};
  fields: any[] = [
    {
      key: 'registration_id',
      type: 'input',
      props: {
        type: 'hidden',
        accepted: true,
      },
    },
  ];
  keepOrder = (a, b) => {
    return a;
  };

  customField: any[] = [];
  constructor(
    public modalService: NgbModal,
    public _registrationService: RegistrationService,
    public _loadingService: LoadingService,
    public _commonsService: CommonsService,
    public _translateService: TranslateService,
    public _settingsService: SettingsService
  ) {
    this.customField = _settingsService.customFieldsValue;
    this.customField.forEach((field) => {
      let validateField = this.conver2ValidateField(field);
      if (field.key != 'club_id') {
        this.fields.push(validateField);
      }
    });
  }

  conver2ValidateField(field) {
    switch (field.type) {
      case 'image-cropper':
        field.type = 'file';
        let props = {
          uploaded: true,
          hidden_input: true,
          upload_url: `${environment.apiUrl}/files/editor`,
          label: field.props.label,
          accept: 'image/*',
          accepted: false,
        };
        // merge field.props to props
        field.props = { ...field.props, ...props };
        break;
    }
    field.props = { ...field.props, ...{ translate: true, accepted: false } };
    let validateField = {
      key: field.key,
      type: field.type,
      wrappers: ['validate'],
      props: field.props,
      expressions: field.expressions ? field.expressions : {},
      defaultValue: field.defaultValue ? field.defaultValue : '',
    };
    return validateField;
  }

  ngOnInit(): void {
    let player = this.registrations;
    // split validated fields to array
    let validated_fields = player.validated_fields.split('|');
    // console.log('validated_fields', validated_fields);
    // if key has in validated_fields then set accepted = true
    this.fields.forEach((field) => {
      if (validated_fields.includes(field.key)) {
        field.props.accepted = true;
        // disable field
        if (field.type != 'file') field.props.disabled = true;
      }
    });
    // set model
    this.model['registration_id'] = this.registrations.id;
    for (const key in player) {
      let value = player[key];
      if (key == 'user') {
        for (const user_key in value) {
          this.model[user_key] = value[user_key];
        }
      } else if (key == 'custom_fields') {
        for (const custom_key in value) {
          this.model[custom_key] = value[custom_key];
        }
      } else {
        this.model[key] = value;
      }
    }
  }

  acceptAll() {
    this.fields.forEach((field) => {
      if (field.props.hasOwnProperty('accepted')) {
        field.props.accepted = true;
      }
    });
  }

  onSubmit() {
    let data_submit = {};
    console.log('fields', this.fields);
    this.fields.forEach((field) => {
      if (field.key != 'registration_id' && !field.props.hidden) {
        if (field.props.hasOwnProperty('accepted')) {
          data_submit[field.key] = {
            accepted: field.props.accepted,
            message: field.props.hasOwnProperty('message')
              ? field.props.message
              : '',
          };
        } else {
          data_submit[field.key] = {
            accepted: false,
            message: field.props.hasOwnProperty('message')
              ? field.props.message
              : '',
          };
        }
      }
    });
    console.log('data_submit', data_submit);

    // send to server
    this._loadingService.show();
    this._registrationService
      .validateRegistration(this.registrations.id, data_submit as any)
      .toPromise()
      .then((data) => {
        console.log('data', data);
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.ajax.reload();
          this.modalService.dismissAll();
          Swal.fire({
            title: this._translateService.instant('Success'),
            text: this._translateService.instant(
              'Validation and send email success'
            ),
            icon: 'success',
            confirmButtonText: this._translateService.instant('OK'),
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });
        });
      })
      .catch((error) => {
        console.log('error', error);
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonText: this._translateService.instant('OK'),
        });
      });
  }

  onUpdatePlayer() {
    // console.log('form', this.form);
    // console.log('fields', this.fields);
    // console.log('status', this.form.status);

    // if form is valid
    if (this.form.valid) {
      this._loadingService.show();
      this._registrationService
        .updatePlayerValidation(this.form.value as any)
        .toPromise()
        .then((data) => {
          console.log('data', data);
          Swal.fire({
            title: this._translateService.instant('Success'),
            text: data.message,
            icon: 'success',
            confirmButtonText: this._translateService.instant('OK'),
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
          });
        })
        .catch((error) => {
          console.log('error', error);
          Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonText: this._translateService.instant('OK'),
          });
        });
    } else {
      // show error message
      return;
    }
  }
}
