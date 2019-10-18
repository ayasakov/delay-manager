import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authToken: string;
  private _interruptedUrl: string;

  constructor() {
  }

  public set interruptedUrl(url: string) {
    this._interruptedUrl = url;
  }

  public isAuthenticated() {
    return true;
  }
}
