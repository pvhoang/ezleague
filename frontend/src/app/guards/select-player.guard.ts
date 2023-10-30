import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RegistrationService } from 'app/services/registration.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SelectPlayerGuard implements CanActivate { 
  constructor(private _registrationService: RegistrationService,private _router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this._registrationService.selectedSeason) {
      this._router.navigate(['/registration/select-event']);
      return false;
    }      
    return true;
  }
  
}
