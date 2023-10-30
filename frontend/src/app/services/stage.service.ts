import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StageService {
  constructor(public _http: HttpClient) {}

  getStage(id) {
    return this._http.get(`${environment.apiUrl}/stages/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getDataByTournament(tournament_id) {
    return this._http
      .post(
        `${environment.apiUrl}/stages/all-in-tournament/${tournament_id}`,
        {}
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getTeamsInStage(id) {
    // POST /stage-teams/all-in-stage/1
    return this._http
      .post(`${environment.apiUrl}/stage-teams/all-in-stage/${id}`, {})
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  addTeamToStage(data) {
    return this._http
      .post(`${environment.apiUrl}/stage-teams/editor`, data)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  createTeamMultiple(params: FormData) {
    return this._http
      .post(`${environment.apiUrl}/stage-teams/create`, params)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  editGroup(params: FormData) {
    return this._http
      .post(`${environment.apiUrl}/stage-teams/edit-group`, params)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  removeTeamMultiple(params: FormData) {
    return this._http
      .post(`${environment.apiUrl}/stage-teams/delete`, params)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  removeTeamFromStage(params: FormData) {
    return this._http
      .post(`${environment.apiUrl}/stage-teams/editor`, params)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  changeTeamInStage(params: FormData) {
    // stage-team/editor

    return this._http
      .post(`${environment.apiUrl}/stage-teams/editor`, params)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getTableData(id) {
    return this._http.get(`${environment.apiUrl}/stages/${id}/table`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  updateStage(data: FormData) {
    return this._http.post(`${environment.apiUrl}/stages/editor`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  autoGenerateMatches(stage_id: number) {
    const data = new FormData();
    data.append('stage_id', stage_id.toString());
    return this._http
      .post(`${environment.apiUrl}/stages/auto-generate`, data)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getMatchesInStage(id) {
    return this._http
      .post(`${environment.apiUrl}/stage-matches/all-in-stage/${id}`, {})
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  hasMatches(id) {
    return this._http
      .get(`${environment.apiUrl}/stages/has-matches/${id}`, {})
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  deleteMatchesInStage(ids: number[], stage_id: number) {
    let formData = new FormData();
    formData.append('action', 'remove');
    ids.forEach((id) => {
      formData.append(`data[${id}][stage_id]`, stage_id.toString());
    });

    return this._http
      .post(`${environment.apiUrl}/stage-matches/editor`, formData)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getLiveMatchesAvailable() {
    return this._http
      .get(`${environment.apiUrl}/stage-matches/live-matches`)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getStreamingMatches(status: string = null) {
    return this._http
    .get(`${environment.apiUrl}/stage-matches/streaming/${status}`)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  updateBroadcastId(match_id: number, broadcast_id: string, broadcast_status: string) {
    return this._http
      .post(`${environment.apiUrl}/stage-matches/update-broadcast`, {
        broadcast_id: broadcast_id,
        broadcast_status: broadcast_status,
        match_id: match_id,
      })
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
