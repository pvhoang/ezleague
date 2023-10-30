import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthService } from 'app/services/auth.service';
import Swal from 'sweetalert2';
import { LoadingService } from 'app/services/loading.service';
import { environment } from 'environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**
   * @param {Router} _router
   * @param {AuthenticationService} _authService
   */
  constructor(
    private _authService: AuthService,
    private _translateService: TranslateService,
    public _loadingService: LoadingService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this._loadingService.dismiss();
          this._loadingService.dismissButtonLoading();
        }
        return event;
      }),
      catchError((err) => {
        this._loadingService.dismiss();
        this._loadingService.dismissButtonLoading();
        if (err.status == 0) {
          // ? Can also logout and reload if needed
          // this._authService.logout();
          err.error = {
            message: 'Connection to server failed. Please try again later.',
          };
          Swal.fire({
            title: 'Error',
            text: 'Connection error. Please try again later.',
            icon: 'error',
            confirmButtonText: this._translateService.instant('OK'),
          });
        }

        if (err.status == 500) {
          Swal.fire({
            title: 'Error',
            text: 'Internal server error. Please try again later.',
            icon: 'error',
            confirmButtonText: this._translateService.instant('OK'),
          });
        }

        if ([401, 403].indexOf(err.status) !== -1 && isApiUrl) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          this._authService.logoutNotRequest();

          // ? Can also logout and reload if needed
          // this._authService.logout();
        }
        // throwError
        const error = err.error || err.statusText;
        error.status = err?.status;

        return throwError(error);
      })
    );
  }
}
