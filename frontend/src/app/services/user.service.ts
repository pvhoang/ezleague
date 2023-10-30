import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient) {}

  getAllUser() {
    return this._http.get<any>(`${environment.apiUrl}/users/all`).pipe(
      map((data) => {
        return data;
      })
    );
  }
  resetData() {
    return this._http.get<any>(`${environment.apiUrl}/users/reset-db`).pipe(
      map((data) => {
        return data;
      })
    );
  }

  update(data) {
    return this._http.put<any>(`${environment.apiUrl}/users/update`, data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  // get favourite clubs
  getFavouriteClubs(season_id?: number) {
    return this._http
      .get<any>(`${environment.apiUrl}/users/favourite-clubs`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  // toggle favourite club
  toggleFavouriteClub(clubId: number) {
    return this._http
      .post<any>(`${environment.apiUrl}/users/toggle-follow-club`, {
        club_id: clubId,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  // get favourite teams
  getFavouriteTeams(season_id?: number) {
    return this._http
      .get<any>(`${environment.apiUrl}/users/favourite-teams`, {
        params: { season_id: season_id ? season_id.toString() : '' },
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  // toggle favourite team
  toggleFavouriteTeam(teamId: number) {
    return this._http
      .post<any>(`${environment.apiUrl}/users/toggle-follow-team`, {
        team_id: teamId,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getByEmail(email: string) {
    return this._http
      .get<any>(`${environment.apiUrl}/users/by-email`, {
        params: { email },
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
