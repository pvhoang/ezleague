import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private _http: HttpClient) {}

  getAll() {
    return this._http.get<any>(`${environment.apiUrl}/permissions/index`).pipe(
      map((data) => {
        // Store the data in the local variable
        // this._currentSeasons = data;
        //Return the data
        return data;
      })
    );
  }
}
