import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class SendMessagesService {
  constructor(
    public _translateService: TranslateService,
    public _http: HttpClient
  ) {}

  sendMessage(data) {
    return this._http
      .post<any>(`${environment.apiUrl}/send-messages/send`, data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getMessageById(message_id: number) {
    return this._http
      .get<any>(`${environment.apiUrl}/send-messages/${message_id}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
