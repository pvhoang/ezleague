import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private _http: HttpClient) {}

  getAllRole() {
    return this._http
    .get<any>(`${environment.apiUrl}/roles/index`)
    .pipe( map((data) => {
      return data;
    } ));
  }

  crudRole(data,action='create') {
    return this._http
    .post<any>(`${environment.apiUrl}/roles/${action}`, data)
    .pipe( map((data) => {
      return data;
    } ));
  }
}
