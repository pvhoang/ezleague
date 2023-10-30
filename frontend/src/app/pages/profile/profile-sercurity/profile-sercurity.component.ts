import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import Swal from 'sweetalert2';
import { ModalTwofaComponent } from './modal-twofa/modal-twofa.component';

@Component({
  selector: 'profile-sercurity',
  templateUrl: './profile-sercurity.component.html',
  styleUrls: ['./profile-sercurity.component.scss'],
})
export class ProfileSercurityComponent implements OnInit {
  constructor(
    public _authService: AuthService,
    public _trans: TranslateService,
    public _modalService: NgbModal
  ) {
    _authService.currentUser.subscribe((user) => {
      this.user = user;
    });
  }
  @Input() user: any;
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  current_user;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col col-md-6',
          type: 'input',
          key: 'current_password',
          props: {
            type: 'password',
            label: this._trans.instant('Current password'),
            required: true,
            autocomplete: 'current-password',
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
          key: 'password',
          props: {
            type: 'password',
            label: this._trans.instant('Password'),
            required: true,
            minLength: 5,
            autocomplete: 'new-password',
          },
        },
        {
          className: 'col-6',
          type: 'input',
          key: 'password_confirmation',
          props: {
            type: 'password',
            label: this._trans.instant('Confirm password'),
            required: true,
            minLength: 5,
            autocomplete: 'new-password',
          },
        },
      ],
    },
  ];

  showPassword(event) {
    // get all input elements with type password

    if (event.target.checked) {
      let passwordInputs = document.querySelectorAll('input[type="password"]'); // if the checkbox is checked
      // loop through each input
      for (let i = 0; i < passwordInputs.length; i++) {
        // change the input type to text
        passwordInputs[i].setAttribute('type', 'text');
        // add a class to signify that the input type has been changed
        passwordInputs[i].classList.add('show-password');
      }
    } else {
      //  get all input elements with class show-password
      let passwordInputs = document.querySelectorAll('.show-password'); // if the checkbox is not checked

      // loop through each input
      for (let i = 0; i < passwordInputs.length; i++) {
        // change the input type to password
        passwordInputs[i].setAttribute('type', 'password');
        // remove the class that signifies that the input type has been changed
        passwordInputs[i].classList.remove('show-password');
      }
    }
  }

  submit() {
    if (this.form.valid) {
      console.log('form', this.form);

      this.changePassword();
    }
  }
  changePassword() {
    //change password
    this._authService.changePassword(this.model).subscribe(
      (data) => {
        console.log(data);
        Swal.fire({
          title: this._trans.instant('Success'),
          text: data.message,
          icon: 'success',
        });
      },
      (error) => {
        console.log(error);

        if (error.hasOwnProperty('errors')) {
          for (let key in error.errors) {
            this.form.controls[key].setErrors({
              serverError: error.errors[key][0],
            });
          }
        }
        if (error.hasOwnProperty('error')) {
          Swal.fire({
            title: this._trans.instant('Warning'),
            text: error.error,
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });
        }
      }
    );
  }
  ngOnInit(): void {
    this.model = {
      current_password: '',
      password: '',
      password_confirmation: '',
    };
  }

  // togle 2fa
  toggle2fa() {
    console.log('toggle2fa', this.user.two_factor_auth);

    if (this.user.two_factor_auth) {
      // alert confirm
      Swal.fire({
        title: this._trans.instant('Are you sure?'),
        text: this._trans.instant('Are you sure you want to disable 2FA?'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this._trans.instant('Cancel'),
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          this.disable2fa();
        }
      });
    } else {
      this.open2faModal();
    }
  }

  open2faModal() {
    let modalRef = this._modalService.open(ModalTwofaComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.user = this.user;
  }

  disable2fa() {
    this._authService.disable2fa().subscribe(
      (data) => {
        let message = data.message;
        this._authService.getProfile().subscribe((data) => {
          Swal.fire({
            title: this._trans.instant('Success'),
            text: message,
            icon: 'success',
          });
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
