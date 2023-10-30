import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Season } from 'app/interfaces/season';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SeasonService {
  _currentSeasons = null;
  private season: Season; // current season

  constructor(private _http: HttpClient) {}

  getCurrentSeason() {
    return this._http
      .get<any>(`${environment.apiUrl}/seasons/current-season`)
      .pipe(
        map(
          (data) => {
            // Store the data in the local variable
            this._currentSeasons = data;
            //Return the data
            return data;
          },
          (error) => {
            console.log(error);
          }
        )
      );
  }

  getTournamentOptions(
    season_id: number,
    group_id: number = 0,
    check_user: boolean = false
  ) {
    return this._http
      .get<any>(
        `${environment.apiUrl}/seasons/${season_id}/tournament-options/${group_id}?check_user=${check_user}`
      )
      .pipe(
        map(
          (data) => {
            return data;
          },
          (error) => {
            console.log(error);
          }
        )
      );
  }

  /**
   * GET seasons from the server by status
   * @param status - status of the season
   * @returns - array of seasons
   * @example - getSeasonsByStatus() - get all seasons
   * @example - getSeasonsByStatus('active') - get all active seasons
   *
   */
  getSeasons(status: string = ''): Observable<Season[]> {
    return this._http
      .get<Season[]>(`${environment.apiUrl}/seasons`, {
        params: { status: status },
      })
      .pipe(
        map((res: Season[]) => {
          return res;
        }),
        tap((_) => console.log('fetched active seasons')),
        catchError(this.handleError<Season[]>('getActiveSeasons', []))
      );
  }

  /**
   * Get season by id
   * @param id - id of the season
   * */
  getSeason(id: number): Observable<Season> {
    const url = `${environment.apiUrl}/seasons/${id}`;
    return this._http.get<Season>(url).pipe(
      map((res: Season) => {
        return res;
      }),
      tap((_) => this.log(`fetched season id=${id}`)),
      catchError(this.handleError<Season>(`getSeason id=${id}`))
    );
  }

  getGroupsBySeason(season_id: number) {
    return this._http
      .get<any>(`${environment.apiUrl}/seasons/${season_id}/groups`)
      .pipe(
        map((data) => {
          // Store the data in the local variable
          //Return the data
          return data;
        })
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a SeasonService message with the MessageService */
  private log(message: string) {
    console.log(`SeasonService: ${message}`);
  }
}
