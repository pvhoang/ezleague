import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/services/auth.service';
import { LoadingService } from 'app/services/loading.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-twofa',
  templateUrl: './verify-twofa.component.html',
  styleUrls: ['./verify-twofa.component.scss'],
})
export class VerifyTwofaComponent implements OnInit {
  constructor(
    public _modalService: NgbActiveModal,
    public _authService: AuthService,
    public _translateService: TranslateService,
    public _loadingService: LoadingService
  ) {}
  code: string;
  err_message: string;
  submitted = false;
  @Input() email: string;
  @Input() password: string;
  ngOnInit(): void {}
  close() {
    this._modalService.dismiss();
  }

  verifyCode() {
    this.submitted = true;
    if (!this.code) {
      this.err_message = this._translateService.instant('Code is required');
      return;
    }
    this._authService.login(this.email, this.password, this.code).subscribe(
      (res) => {
        if (res) {
          this.close();
        }
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: this._translateService.instant('Error'),
          text: err.message,
        });
      }
    );
  }

  resetCode() {
    Swal.fire({
      title: this._translateService.instant('Are you sure?'),
      text: this._translateService.instant(
        'We will send secret key to your email. Please check and verify again'
      ),
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        this._loadingService.show();
        this._authService.resetCode2fa(this.email, this.password).subscribe(
          (res) => {
            if (res) {
              Swal.fire({
                icon: 'success',
                title: this._translateService.instant('Success'),
                text: this._translateService.instant(
                  'Secret key has been sent to your email'
                ),
              });
            }
          },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: this._translateService.instant('Error'),
              text: err.message,
            });
          }
        );
      }
    });
  }
}
