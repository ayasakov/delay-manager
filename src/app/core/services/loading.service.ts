import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private status = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  public isLoading(): Observable<boolean> {
    return this.status.asObservable();
  }

  public set value(isLoading: boolean) {
    if (isLoading !== this.status.getValue()) {
      this.status.next(isLoading);
    }
  }
}
