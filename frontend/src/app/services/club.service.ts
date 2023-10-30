import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClubService {
  constructor(private _http: HttpClient) {}

  getAllClubs() {
    return this._http.post<any>(`${environment.apiUrl}/clubs/all`, {}).pipe(
      map((data) => {
        // console.log(data);
        return data;
      })
    );
  }

  getAllClubsIsActive() {
    return this._http.get<any>(`${environment.apiUrl}/clubs/all-active`).pipe(
      map((data) => {
        // console.log(data);
        return data;
      })
    );
  }

  toggleIsActive(id: number) {
    return this._http
      .post<any>(`${environment.apiUrl}/clubs/toggle-active`, { id })
      .pipe(
        map((data) => {
          // console.log(data);
          return data;
        })
      );
  }

  // get club by user
  getClubByUser() {
    return this._http.get<any>(`${environment.apiUrl}/clubs/by-user`).pipe(
      map((data) => {
        // console.log(data);
        return data;
      })
    );
  }

  // get group by club
  getGroupByClub(clubId: number) {
    return this._http
      .get<any>(`${environment.apiUrl}/groups/club/${clubId}`)
      .pipe(
        map((data) => {
          // console.log(data);
          return data;
        })
      );
  }

  // get club manager by club
  getClubManagerByClub(clubId: number) {
    return this._http
      .get<any>(`${environment.apiUrl}/clubs/${clubId}/users`)
      .pipe(
        map((data) => {
          // console.log(data);
          return data;
        })
      );
  }

  // create user club
  createClubManager(club_id = 0, email = '') {
    // form data
    const formData = new FormData();
    formData.append('club_id', club_id.toString());
    formData.append('email', email);
    return this._http
      .post<any>(`${environment.apiUrl}/clubs/users/create`, formData)
      .pipe(
        map((data) => {
          // console.log(data);
          return data;
        })
      );
  }

  // remove user club
  removeClubManager(club_id:number, user_id: number) {
    // form data
    const formData = new FormData();
    formData.append('club_id', club_id.toString());
    formData.append('user_id', user_id.toString());
    return this._http
      .post<any>(`${environment.apiUrl}/clubs/users/destroy`, formData)
      .pipe(
        map((data) => {
          // console.log(data);
          return data;
        })
      );
  }
}
