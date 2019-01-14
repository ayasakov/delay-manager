import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { guid } from '../../utils/guid';
import { catchError } from 'rxjs/operators';

export class TimeTracking {
  constructor(public id: string, public from: string, public to: string, public dayIndex: number) {}
}

@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService {
  private items: BehaviorSubject<Array<TimeTracking>>;
  private processing: BehaviorSubject<boolean>;

  protected key = 'times';

  constructor(private localStorage: LocalStorage) {
    this.items = new BehaviorSubject<Array<TimeTracking>>([]);
    this.processing = new BehaviorSubject<boolean>(false);

    this.init();
  }

  private getFromStorage(key: string): Observable<any> {
    return this.localStorage.getItem(key);
  }

  private setToStorage(key: string, value: string) {
    return this.localStorage.setItem(key, value)
      .pipe(catchError(
        (err) => {
          console.log('err: error during cache update.', err);
          return of(this.items.getValue());
        })
      );
  }

  private updateStorage(values: Array<TimeTracking>) {
    this.processing.next(true);

    this.setToStorage(this.key, JSON.stringify(values))
      .subscribe(
        () => {
          this.items.next(values);
          this.processing.next(false);
        },
        () => this.processing.next(false)
      );
  }

  public init() {
    this.getFromStorage(this.key).subscribe((val: string) => {
      const items: Array<TimeTracking> = JSON.parse(val);
      this.items.next(items || []);
    });
  }

  public getStatus(): Observable<boolean> {
    return this.processing.asObservable();
  }

  public getTimeTracking(): Observable<Array<TimeTracking>> {
    return this.items.asObservable();
  }

  public addTime(from: string, to: string, dayIndex: number) {
    if (!from || !to || !dayIndex) {
      console.log('err: time track wasn\'t added');
    }

    const id: string = guid();
    const item: TimeTracking = new TimeTracking(id, from, to, dayIndex);

    const items: Array<TimeTracking> = this.items.getValue();
    items.push(item);

    this.updateStorage(items);
  }

  public deleteTime(item: TimeTracking) {
    if (!item) {
      console.log('err: time track wasn\'t deleted');
    }

    const items: Array<TimeTracking> = this.items.getValue()
      .filter((i: TimeTracking) => i.id !== item.id);

    this.updateStorage(items);
  }

  public clearHistory() {
    this.updateStorage([]);
  }
}
