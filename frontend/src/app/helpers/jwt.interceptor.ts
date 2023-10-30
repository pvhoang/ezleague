import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from './../app-config';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { AuthService } from 'app/services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   *
   * @param {AuthenticationService} _authService
   */
  constructor(
    private _authService: AuthService,
    private _translateService: TranslateService
  ) {}

  /**
   * Add auth header with jwt if user is logged in and request is to api url
   * @param request
   * @param next
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentUser = this._authService.currentUserValue;
    const isLoggedIn = currentUser && currentUser.token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    const isWowzaUrl = request.url.startsWith(environment.wowzaApi);
    const currentLang = this._translateService.currentLang
      ? this._translateService.currentLang
      : 'en';
      
    if (isApiUrl) {
      request = request.clone({
        setHeaders: {
          'X-localization': currentLang,
          'X-project-id': AppConfig.PROJECT_ID,
          'X-time-zone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });

      if (isLoggedIn && isApiUrl) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
      }
    }

    if (isLoggedIn && isWowzaUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${environment.wowzaToken}`,
        },
      });
    }

    return next.handle(request);
  }
}
