import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { RegistrationService } from 'app/services/registration.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { AppConfig } from 'app/app-config';

@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this._authService.currentUserValue) {
      let permission_page =  route.data.permissions;
      // check permissions
      let user = this._authService.currentUserValue;
      let permissions = user.role.permissions;
      // get array of permission ids
      let permissionIds = permissions.map((permission) => {
        return permission.id;
      });
      // if Appconfig.PERMISSIONS.manage_groups is in permissionIds
      if (!permissionIds.includes(permission_page)) {
        return false;
      }
      return true;
    }
    return false;
  }
}
