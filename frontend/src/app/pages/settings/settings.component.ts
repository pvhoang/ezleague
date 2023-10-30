import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from 'app/app-config';
import { AuthService } from 'app/services/auth.service';
import { SettingsService } from 'app/services/settings.service';
import { UpdateService } from 'app/services/update.service';
import Stepper from 'bs-stepper';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
// import { version } from './../../../../../server/vendor/swagger-api/swagger-ui/src/core/plugins/spec/selectors';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  settings: any;
  public contentHeader: object;
  message_check_update = '';
  available_versions = [];
  current_version = '';
  updated_at = '';
  AppConfig = AppConfig;
  constructor(
    public settingsService: SettingsService,
    public _trans: TranslateService,
    private _toastrService: ToastrService,
    public _authService: AuthService,
    public _updateService: UpdateService
  ) {
    this.contentHeader = {
      headerTitle: 'Settings',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/',
          },
          {
            name: 'Settings',
            isLink: false,
          },
        ],
      },
    };
    this.settingsService.getSettingsData().subscribe((res) => {
      this.settings = res;
      // find settings has key "smtp_account"
      let smtp_account = this.settings.find(
        (element) => element.key == AppConfig.SETTINGS_KEYS.SMTP
      );
      this.smtp_model = smtp_account.value;
      // find settings has key "r_version"
      let r_version = this.settings.find(
        (element) => element.key == AppConfig.SETTINGS_KEYS.REQUIRED_VERSIONS
      );
      this.version_model = r_version.value;
      console.log(this.settings);
    });
    if (this._authService.isAdmin()) {
      this.settingsService.getSettings();
    }
  }
  private verticalWizardStepper: Stepper;
  smtp_form = new FormGroup({});
  smtp_model: any = {};
  smtp_options: FormlyFormOptions = {};
  smtp_fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-md-6',
          type: 'input',
          key: 'smtp_account',
          props: {
            translate: true,
            label: 'Account',
            required: true,
            placeholder: 'account@example.com',
            type: 'email',
            pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
          },
        },
        {
          className: 'col-md-6',
          type: 'input',
          key: 'smtp_password',
          props: {
            translate: true,
            label: 'Password',
            required: true,
            placeholder: '********',
            type: 'password',
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-md-6',
          type: 'input',
          key: 'smtp_host',
          props: {
            translate: true,
            label: 'Host',
            required: true,
            placeholder: 'smtp.example.com',
          },
        },
        {
          className: 'col-md-6',
          type: 'input',
          key: 'smtp_port',
          props: {
            translate: true,
            label: 'Port',
            required: true,
            placeholder: '123',
            type: 'number',
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-md-6',
          type: 'input',
          key: 'from_email',
          props: {
            translate: true,
            label: 'From Email',
            required: true,
            placeholder: 'account@example.com',
            type: 'email',
            pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
          },
        },
        {
          className: 'col-md-6',
          type: 'input',
          key: 'from_name',
          props: {
            translate: true,
            label: 'From Name',
            required: true,
            placeholder: 'Example',
          },
        },
      ],
    },
  ];

  version_form = new FormGroup({});
  version_model: any = {};
  version_options: FormlyFormOptions = {};
  version_fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-md-6',
          type: 'input',
          key: 'i_version',
          props: {
            translate: true,
            label: 'iOS Version',
            required: true,
            placeholder: '1.0.0',
          },
        },
        {
          className: 'col-md-6',
          type: 'input',
          key: 'a_version',
          props: {
            translate: true,
            label: 'Android Version',
            required: true,
            placeholder: '1.0.0',
          },
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.verticalWizardStepper = new Stepper(
      document.querySelector('#stepper2'),
      {
        linear: false,
        animation: true,
      }
    );
  }

  saveSetting(key, model, form) {
    console.log(key, model);
    if (form.invalid) {
      return;
    }
    this.settingsService.updateSettings(key, model).subscribe(
      (res) => {
        this._toastrService.success(
          this._trans.instant('Update successfully'),
          this._trans.instant('Success'),
          {
            toastClass: 'toast ngx-toastr',
            closeButton: true,
          }
        );
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: this._trans.instant('Error'),
          text: err.message,
        });
      }
    );
  }
}
