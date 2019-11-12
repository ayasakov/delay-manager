import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { getUrlForEndpoint } from '../../utils/url-for-endpoint';
import { ISlackToken } from '../interfaces/slack-token.interface';
import { TimeTracking } from '../interfaces/time-tracking.interface';
import { Profile } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticateStream = new BehaviorSubject<boolean>(false);

  private _interruptedUrl: string;
  private _user: Profile;

  constructor(private http: HttpClient) {
  }

  static toFixed(value) {
    return ('0' + `${value}`).slice(-2);
  }

  static convertDate(date: Date) {
    return `${AuthService.toFixed(date.getHours())}:${AuthService.toFixed(date.getMinutes())}`;
  }

  public set interruptedUrl(url: string) {
    this._interruptedUrl = url;
  }

  public isAuthenticated(): boolean {
    return this.authenticateStream.getValue();
  }

  public getAuthenticateStream(): Observable<boolean> {
    return this.authenticateStream.asObservable();
  }

  public getLoginStatus(): Observable<boolean> {
    if (this.isAuthenticated()) {
      return of(true);
    }

    return this.http.get<boolean>(getUrlForEndpoint('/api/is-authenticated'), {withCredentials: true}).pipe(
      map(() => true),
      catchError(() => of(false)),
      tap(status => this.authenticateStream.next(status)),
    );
  }

  public login(params: { [key: string]: string }): Observable<ISlackToken> {
    return this.http.get<ISlackToken>(getUrlForEndpoint('/api/token'), {params, withCredentials: true}).pipe(
      tap(
        () => this.authenticateStream.next(true),
        () => this.authenticateStream.next(false),
      )
    );
  }

  public getUserInfo(): Observable<Profile> {
    return this._user ?
      of(this._user) :
      this.http.get<Profile>(getUrlForEndpoint('/api/user'), {withCredentials: true})
        .pipe(tap((user) => this._user = user));
  }

  public getMessages(): Observable<TimeTracking[]> {
    return this.http.get<TimeTracking[]>(getUrlForEndpoint('/api/message'), {withCredentials: true}).pipe(
      map((times: TimeTracking[]) => {
        times.forEach((t: TimeTracking) => {
          t.from = AuthService.convertDate(new Date(t.from));
          t.to = AuthService.convertDate(new Date(t.to));
        });
        return times;
      })
    );
  }
}
