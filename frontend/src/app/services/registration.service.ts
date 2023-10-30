import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const optHeaders = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded',
});

const httpOptions = {
  headers: optHeaders,
};

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  // public variables
  private _currentSeasons: any;
  private _selectedSeason: any;
  private _allClubs: any;

  constructor(private _http: HttpClient) {}

  getSeason($seasonId: number) {
    return this._http
      .get<any>(`${environment.apiUrl}/seasons/${$seasonId}`)
      .pipe(
        map((data) => {
          // Store the data in the local variable
          this._selectedSeason = data;
          //Return the data
          return data;
        })
      );
  }

  getCurrentSeason() {
    return this._http
      .get<any>(`${environment.apiUrl}/seasons/current-season`)
      .pipe(
        map((data) => {
          // Store the data in the local variable
          this._currentSeasons = data;
          //Return the data
          return data;
        })
      );
  }

  approve($registration_id: number) {
    let formData = new FormData();
    formData.append('registration_id', $registration_id.toString());
    return this._http
      .post<any>(`${environment.apiUrl}/registrations/approve`, formData)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  // Getter for the currentSeasons variable
  get currentSeasons(): any {
    return this._currentSeasons;
  }

  set selectedSeason(season: any) {
    this._selectedSeason = season;
  }

  get selectedSeason(): any {
    return this._selectedSeason;
  }

  get allClubs(): any {
    return this._allClubs;
  }

  set allClubs(clubs: any) {
    this._allClubs = clubs;
  }

  getSeasonByID(season_id: number) {
    return this._http
      .get<any>(`${environment.apiUrl}/seasons/${season_id}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  registerNewPlayer(form, season_id: number) {
    const params = new FormData();
    params.append('season_id', season_id.toString());
    //  loop through the form and append the data to the params
    for (let key in form) {
      params.append(key, form[key]);
    }

    return this._http
      .post<any>(
        `${environment.apiUrl}/registrations/add-new-player`,
        params,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getAllPlayers() {
    return this._http.get<any>(`${environment.apiUrl}/players/of-user`).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getPlayersBySeason(season_id: number) {
    return this._http
      .get<any>(`${environment.apiUrl}/players/of-user-season/${season_id}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getPlayerRegistered(season_id: number) {
    return this._http
      .get<any>(`${environment.apiUrl}/players/season/${season_id}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  registerOldPlayer(season_id: number, club_id: number, player_id: string) {
    const params = new FormData();
    params.append('season_id', season_id.toString());
    params.append('club_id', club_id.toString());
    params.append('player_id', player_id.toString());

    return this._http
      .post<any>(`${environment.apiUrl}/registrations/create`, params, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  // get all seasons is active
  getAllSeasonActive() {
    return this._http.get<any>(`${environment.apiUrl}/seasons/all-active`).pipe(
      map((data) => {
        return data;
      })
    );
  }

  validateRegistration(registration_id: number, validate_fields: JSON) {
    const params = new FormData();
    params.append('registration_id', registration_id.toString());
    params.append('validate_fields', JSON.stringify(validate_fields));

    return this._http
      .post<any>(
        `${environment.apiUrl}/registrations/validate-player`,
        params,
        {}
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  //updatePlayer
  updatePlayer(form, player_id: number, season_id: number) {
    const params = new FormData();
    params.append('player_id', player_id.toString());
    params.append('season_id', season_id.toString());
    //  loop through the form and append the data to the params
    for (let key in form) {
      params.append(key, form[key]);
    }
    return this._http
      .post<any>(`${environment.apiUrl}/players/update-information`, params, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updatePlayerValidation(data: FormData) {
    return this._http
      .post<any>(`${environment.apiUrl}/players/update-by-admin`, data, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  storePayment(data: FormData) {
    return this._http
      .post<any>(`${environment.apiUrl}/registrations/store-payment`, data, {})
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  // Only for admin
  syncPaymentStatusStripeBySeason(season_id) {
    return this._http
      .post<any>(`${environment.apiUrl}/stripe/sync-invoices-registration`, {
        season_id: season_id,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
