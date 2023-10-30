import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TeamsheetService {
  public currentTeam: any;
  public season: any = {
    name: '2020-2021',
  };
  constructor(public _http: HttpClient) {}

  getTeamSheet2Submit(team_id) {
    return this._http
      .get(`${environment.apiUrl}/team-sheets/show/${team_id}`)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }
}
