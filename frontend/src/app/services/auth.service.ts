import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/interfaces/user';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { FcmService } from './fcm.service';
import { UserService } from './user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VerifyTwofaComponent } from 'app/components/verify-twofa/verify-twofa.component';
import { AppConfig } from 'app/app-config';

const optHeader = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded',
});

const httpOptions = {
  headers: optHeader,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  constructor(
    private _http: HttpClient,
    private _toastrService: ToastrService,
    private _router: Router,
    public _loadingService: LoadingService,
    public _fcmService: FcmService,
    public _userService: UserService,
    public _modalService: NgbModal
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('EZLEAGUE_USER'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string, code?: string) {
    let data = code ? { email, password, code } : { email, password };
    return this._http.post<any>(`${environment.apiUrl}/auth/login`, data).pipe(
      map((data) => {
        // login successful if there's a jwt token in the response
        if (data) {
          if (data.two_factor_auth) {
            this.openModal2FA(email, password);
          } else {
            if (data.auth_token) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              let user = data.user;
              user.token = data.auth_token;

              localStorage.setItem('EZLEAGUE_USER', JSON.stringify(user));
              this.currentUserSubject.next(user);
              // get fcm token
              let fcm_token = this._fcmService.getToken();
              if (!fcm_token) {
                fcm_token = null;
              }
              this._userService
                .update({ firebase_token: fcm_token })
                .subscribe((res) => {
                  console.log('res: ', res);
                });
              this._router.navigate(['/home']);
            }
          }
        }

        return data;
      })
    );
  }

  openModal2FA(email, password) {
    let modalRef = this._modalService.open(VerifyTwofaComponent, {
      size: 'md',
      centered: true,
    });
    modalRef.dismissed.subscribe((res) => {
      this._loadingService.dismissButtonLoading();
    });
    modalRef.componentInstance.email = email;
    modalRef.componentInstance.password = password;
  }

  register(form): Observable<Response> {
    let params = new HttpParams();

    // add form data to params
    params = params.append('first_name', form.first_name);
    params = params.append('last_name', form.last_name);
    params = params.append('email', form.email);

    // send request
    return this._http
      .post<any>(`${environment.apiUrl}/auth/register`, params, httpOptions)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  logout() {
    this._loadingService.show();
    // remove firebase token
    this._userService.update({ firebase_token: null }).subscribe((res) => {
      console.log('res: ', res);
    });

    // logout from server
    return this._http
      .post<any>(`${environment.apiUrl}/auth/logout`, {})
      .toPromise()
      .then((data) => {
        // remove user from local storage to log user out
        localStorage.removeItem('EZLEAGUE_USER');
        this.currentUserSubject.next(null);
        this._router.navigate(['/auth/login']);
        return data;
      })
      .catch((err) => {
        console.log('error: ', err);
        return err;
      });
  }

  logoutNotRequest() {
    // remove user from local storage to log user out
    localStorage.removeItem('EZLEAGUE_USER');
    this.currentUserSubject.next(null);
    this._router.navigate(['/auth/login']);
  }

  forgotPassword(email: string) {
    return this._http
      .post<any>(`${environment.apiUrl}/auth/forgot-password`, { email })
      .pipe(
        map((data) => {
          if (data) {
            console.log('success');
          }
          return data;
        })
      );
  }

  resetPassword(
    password: string,
    password_confirmation: string,
    token: string,
    email: string
  ) {
    return this._http
      .post<any>(`${environment.apiUrl}/auth/reset-password`, {
        password,
        password_confirmation,
        token,
        email,
      })
      .pipe(
        map((data) => {
          // login successful if there's a jwt token in the response
          if (data) {
            console.log('success');
            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'Your password has been reset successfully.',
                '👋 Welcome, ' + email + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
              this._router.navigate(['/auth/login']);
            }, 2500);
          }

          return data;
        })
      );
  }

  updateUserLanguage(lang: string) {
    let params = new HttpParams();

    // add form data to params
    params = params.append('language', lang);
    return this._http
      .post<any>(`${environment.apiUrl}/users/update-language`, params)
      .pipe(
        map((data) => {
          if (data.lang) {
            let user = this.currentUserValue;
            user.language = data.lang;
            localStorage.setItem('EZLEAGUE_USER', JSON.stringify(user));
            // notify
            this.currentUserSubject.next(user);
          }

          return data;
        })
      );
  }

  //subscribe to this to get the user
  getProfile(): Observable<User> {
    return this._http.get<User>(`${environment.apiUrl}/auth/get-info`).pipe(
      tap((user: User) => {
        // update the user in the service
        user.token = this.currentUserValue.token;
        this.currentUserSubject.next(user);
        // update the user in local storage
        localStorage.setItem('EZLEAGUE_USER', JSON.stringify(user));
        // update the user in the service
        this.currentUserSubject.next(user);
      }),
      catchError((err) => {
        // if there is a problem we'll log it to the console
        console.error(err);
        return of(null);
      })
    );
  }

  changePassword(data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) {
    return this._http
      .post<any>(`${environment.apiUrl}/auth/change-password`, data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  generate2faSecret() {
    return this._http
      .get<any>(`${environment.apiUrl}/auth/generate-2fa-secret`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  enable2fa(data: { code: string; auth_code: string; is_enabled: any }) {
    return this._http
      .post<any>(`${environment.apiUrl}/auth/enable-2fa`, data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  disable2fa() {
    return this._http
      .post<any>(`${environment.apiUrl}/auth/disable-2fa`, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  verify2fa(code: string) {
    return this._http
      .post<any>(`${environment.apiUrl}/auth/verify-2fa`, {
        code,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  resetCode2fa(email, password) {
    return this._http
      .post<any>(`${environment.apiUrl}/auth/reset-2fa`, {
        email,
        password,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  isAdmin() {
    return this.currentUserValue?.role.id === AppConfig.USER_ROLES.admin;
  }
}
