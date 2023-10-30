import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  groupStages = new Subject<any>();
  groupStages$: Observable<any> = this.groupStages.asObservable();

  constructor(private _http: HttpClient) {}

  addGroupStages(data: any): void {
    this.groupStages.next(data);
  }

  getTeamListInStage(stage_id: any) {
    let params = new HttpParams();
    params = params.append('stage_id', stage_id);
    return this._http.post(`${environment.apiUrl}/teams/in-stage`, params).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getTeamInSeasonAndClub(seasonId: any, clubId: any) {
    return this._http
      .get(`${environment.apiUrl}/teams/season/${seasonId}/club/${clubId}`)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getTeamInSeason2Manage(seasonId: any) {
    return this._http
      .get(`${environment.apiUrl}/seasons/${seasonId}/manage-teams`)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getTableTeamPlayers(teamId: any) {
    return this._http
      .get(`${environment.apiUrl}/team-players/in-team/${teamId}`)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  editorTableTeamPlayers(params) {
    return this._http
      .post(`${environment.apiUrl}/team-players/editor`, params)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  editorTableTeamCoaches(params) {
    return this._http
      .post(`${environment.apiUrl}/team-coaches/editor`, params)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getTeamById(teamId: any) {
    return this._http.get(`${environment.apiUrl}/teams/${teamId}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  submitTeamSheet(team_id: any) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('team_id', team_id);
    return this._http
      .post(`${environment.apiUrl}/team-sheets/submit`, httpParams)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getAllTeamSheet() {
    return this._http.post(`${environment.apiUrl}/team-sheets/all`, {}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  editorTeamSheet(params) {
    return this._http
      .post(`${environment.apiUrl}/team-sheets/editor`, params)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getTeamByGroup(group_id: any) {
    return this._http.get(`${environment.apiUrl}/teams/group/${group_id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getTeamNotInStage(stage_id: any, group_id) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('stage_id', stage_id);
    httpParams = httpParams.append('group_id', group_id);
    return this._http
      .post(`${environment.apiUrl}/teams/not-in-stage`, httpParams)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getOptionsPlayer(team_id) {
    return this._http
      .get(`${environment.apiUrl}/team-players/${team_id}/players`)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPlayersByTeamId(team_id) {
    return this._http
      .get(`${environment.apiUrl}/teams/${team_id}/players`)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  /**
   * Create new coach and assign to team
   * @param teamId
   * @param formData  first_name, last_name, email, phone
   */
  assignNewCoachToTeam(teamId, formData) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('team_id', teamId);
    httpParams = httpParams.append('email', formData.email);
    httpParams = httpParams.append('first_name', formData.first_name);
    httpParams = httpParams.append('last_name', formData.last_name);
    httpParams = httpParams.append(
      'phone',
      formData.phone === null ? '' : formData.phone
    );
    return this._http
      .post(`${environment.apiUrl}/team-coaches/assign-new`, httpParams)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  getTeamBySeason(seasonId: any) {
    return this._http
      .get(`${environment.apiUrl}/seasons/${seasonId}/teams`)
      .pipe(
        map(
          (res: any) => {
            return res;
          },
          (error) => {
            console.log(error);
          }
        )
      );
  }
}
