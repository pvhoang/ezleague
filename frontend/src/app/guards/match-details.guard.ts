import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { TournamentService } from 'app/services/tournament.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MatchDetailsGuard implements CanActivate {
  match_id: any;
  constructor(
    public _tournamentService: TournamentService,
    public router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.match_id = route.paramMap.get('match_id');
    console.log('match_id', this.match_id);
    this._tournamentService
      .checkMatchExist(this.match_id)
      .toPromise()
      .then(
        (res) => {
          console.log('res: ', res);
          // if !res or {}
          if (res == false) {
            this.router.navigate(['/home']);
            return false;
          }
          return true;
        },
        (err) => {
          this.router.navigate(['/home']);
          return false;
        }
      );
    return true;
  }
}
