import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  constructor(public _http: HttpClient) {}
  getTournament(id) {
    return this._http.get(`${environment.apiUrl}/tournaments/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  getTournamentMatches(id) {
    return this._http
      .get(`${environment.apiUrl}/tournaments/${id}/matches`)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  getMatchesWithQuery(season_id: number, query = '') {
    return this._http
      .get(
        `${environment.apiUrl}/tournaments/season/${season_id}/matches-user${query}`
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

  getMatchById(id) {
    return this._http.get(`${environment.apiUrl}/stage-matches/${id}`).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  updateMatch(data) {
    // console.log(data);
    if (data.id) {
      // new form data
      const formData = new FormData();
      for (const key in data) {
        let value = data[key];
        if (value === null) value = '';
        formData.append(`data[${data.id}][${key}]`, value);
      }
      formData.append('action', 'edit');
      return this._http
        .post(`${environment.apiUrl}/stage-matches/editor`, formData)
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

  getMatchDetails(match_id) {
    return this._http
      .get(`${environment.apiUrl}/stage-matches/${match_id}/details`)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  updateMatchDetails(data) {
    if (data.match_id) {
      return this._http
        .put(
          `${environment.apiUrl}/stage-matches/${data.match_id}/details`,
          data
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
  }

  deleteMatchDetails(match_detail_id) {
    return this._http
      .delete(`${environment.apiUrl}/stage-matches/details/${match_detail_id}`)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  showMatchesFixturesBySeason(season_id, params = {}) {
    // remove null params
    for (const key in params) {
      if (params[key] === null) {
        delete params[key];
      }
    }
    return this._http
      .get(`${environment.apiUrl}/tournaments/season/${season_id}/fixtures`, {
        params,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  checkMatchExist(match_id) {
    return this._http
      .get(`${environment.apiUrl}/stage-matches/${match_id}/exist`)
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
