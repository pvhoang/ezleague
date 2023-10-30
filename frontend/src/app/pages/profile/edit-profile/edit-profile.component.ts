import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LoadingService } from 'app/services/loading.service';
import { UserService } from 'app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  constructor(
    public _userService: UserService,
    public _authService: AuthService,
    public _trans: TranslateService,
    public _loadingService: LoadingService
  ) {}
  @Input() user: any;
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[];

  submit() {
    if (!this.form.valid) return;
    let loading = this._loadingService.show();
    // console.log(this.model);
    this._userService
      .update(this.model)
      .toPromise()
      .then(
        (res) => {
          let message = res.message;
          // console.log(res);
          this._authService.getProfile().subscribe((res) => {
            Swal.fire({
              title: this._trans.instant('Success'),
              icon: 'success',
              text: message,
            });
          });
        },
        (err) => {
          // console.log(err);
          if (err.hasOwnProperty('errors')) {
            let errors = err.errors;
            for (let key in errors) {
              if (errors.hasOwnProperty(key)) {
                this.form.get(key).setErrors({ serverError: errors[key] });
              }
            }
          }
        }
      );
  }
  ngOnInit(): void {
    this.model = {
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      email: this.user.email,
    };

    setTimeout(() => {
      this.fields = [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              className: 'col-6',
              type: 'input',
              key: 'first_name',
              props: {
                label: this._trans.instant('Surname'),
                required: true,
              },
            },
            {
              className: 'col-6',
              type: 'input',
              key: 'last_name',
              props: {
                label: this._trans.instant('Other names'),
                required: true,
              },
            },
          ],
        },
        // {
        //   className: 'section-label',
        //   template: '<hr /><div><strong>Address:</strong></div>',
        // },
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              className: 'col col-md-6',
              type: 'input',
              key: 'email',
              props: {
                label: this._trans.instant('Email'),
                required: true,
              },
            },
          ],
        },
      ];
    }, 500);
  }
}
