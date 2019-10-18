import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getUrlForEndpoint } from '../../utils/url-for-endpoint';
import { ISlackToken, ISlackUser } from '../interfaces/slack-token.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticateStream = new BehaviorSubject<boolean>(false);

  private _interruptedUrl: string;
  private _user: ISlackUser;

  constructor(private http: HttpClient) {
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

  public login(params: { [key: string]: string }): Observable<ISlackToken> {
    return this.http.get<ISlackToken>(getUrlForEndpoint('/api/token'), {params, withCredentials: true}).pipe(
      tap((response: ISlackToken) => {
        this._user = response.user;
        this.authenticateStream.next(true);
      })
    );
  }

  public getUserInfo(): Observable<ISlackUser> {
    return this._user ?
      of(this._user) :
      this.http.get<ISlackUser>(getUrlForEndpoint('/api/user'), {withCredentials: true})
        .pipe(tap(
          () => this.authenticateStream.next(true),
          () => this.authenticateStream.next(false),
        ));
  }
}
