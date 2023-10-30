import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from 'app/app-config';
import { User } from 'app/interfaces/user';
import { AuthService } from 'app/services/auth.service';
import { LoadingService } from 'app/services/loading.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-twofa',
  templateUrl: './modal-twofa.component.html',
  styleUrls: ['./modal-twofa.component.scss'],
})
export class ModalTwofaComponent implements OnInit {
  constructor(
    public _authService: AuthService,
    public _loadingService: LoadingService,
    public _modalService: NgbActiveModal,
    public _trans: TranslateService
  ) {
    _authService.currentUser.subscribe((user) => {
      this.current_user = user;
      this.is2faEnabled = user.two_factor_auth;
    });
    _loadingService.show();
    this._authService.generate2faSecret().subscribe((data) => {
      this.secret = data.secret;
      this.qrCodeUrl = data.url;
    });
  }
  current_user: User;
  qrCodeUrl: string;
  secret: string;
  code: string;
  is2faEnabled = false;
  ngOnInit(): void {}

  enable2fa() {
    let data = {
      code: this.code,
      auth_code: this.secret,
      is_enabled: true,
    };
    this._loadingService.show();
    this._authService.enable2fa(data).subscribe(
      (res) => {
        let message = res.message;
        this._authService.getProfile().subscribe(
          (user) => {
            Swal.fire({
              title: this._trans.instant('Success'),
              text: message,
              icon: 'success',
            });
            this._modalService.dismiss();
          },
          (err) => {
            Swal.fire({
              title: this._trans.instant('Error'),
              text: err.message,
              icon: 'error',
            });
          }
        );
      },
      (err) => {
        Swal.fire({
          title: this._trans.instant('Error'),
          text: err.message,
          icon: 'error',
        });
      }
    );
  }
  close() {
    this._modalService.dismiss();
  }
}
