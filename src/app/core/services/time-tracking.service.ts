import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { guid } from '../../utils/guid';
import { catchError } from 'rxjs/operators';
import { TimeTracking } from '../interfaces/time-tracking.interface';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService {
  private items: BehaviorSubject<TimeTracking[]>;
  private processing: BehaviorSubject<boolean>;
  private workingDays: BehaviorSubject<any>;

  protected keyTimes = 'times';
  protected keyWorkingDays = 'workingDays';

  constructor(private localStorage: LocalStorage) {
    this.items = new BehaviorSubject<TimeTracking[]>([]);
    this.processing = new BehaviorSubject<boolean>(false);
    this.workingDays = new BehaviorSubject<any>({});

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
          const prev: any = this.keyTimes === key ? this.items.getValue() : this.workingDays.getValue();
          return of(prev);
        })
      );
  }

  private updateWorkingDaysStorage(value: any) {
    this.processing.next(true);

    this.setToStorage(this.keyWorkingDays, JSON.stringify(value))
      .subscribe(
        () => {
          this.workingDays.next(value);
          this.processing.next(false);
        },
        () => this.processing.next(false)
      );
  }

  private updateTimesStorage(values: TimeTracking[]) {
    this.processing.next(true);

    this.setToStorage(this.keyTimes, JSON.stringify(values))
      .subscribe(
        () => {
          this.items.next(values);
          this.processing.next(false);
        },
        () => this.processing.next(false)
      );
  }

  public init() {
    this.getFromStorage(this.keyTimes).subscribe((val: string) => {
      const items: TimeTracking[] = JSON.parse(val);
      this.items.next(items || []);
    });
    this.getFromStorage(this.keyWorkingDays).subscribe((val: string) => {
      const value: any = JSON.parse(val);
      this.workingDays.next(value || {});
    });
  }

  public getWorkingDays(): Observable<any> {
    return this.workingDays.asObservable();
  }

  public getStatus(): Observable<boolean> {
    return this.processing.asObservable();
  }

  public getTimeTracking(): Observable<TimeTracking[]> {
    return this.items.asObservable();
  }

  public changeWorkingDays(dayIndex: number, value: boolean) {
    if (!dayIndex || dayIndex > 6 || dayIndex < 0) {
      console.log('err: working days weren\'t updated');
      return;
    }

    const workingDays: any = this.workingDays.getValue();
    workingDays[dayIndex] = value;
    this.updateWorkingDaysStorage(workingDays);
  }

  public addTime(from: string, to: string, dayIndex: number) {
    if (!from || !to || !dayIndex) {
      console.log('err: time track wasn\'t added');
      return;
    }

    const id: string = guid();
    const item: TimeTracking = new TimeTracking(id, from, to, dayIndex);

    const items: TimeTracking[] = this.items.getValue();
    items.push(item);

    this.updateTimesStorage(items);
  }

  public deleteTime(item: TimeTracking) {
    if (!item) {
      console.log('err: time track wasn\'t deleted');
      return;
    }

    const items: TimeTracking[] = this.items.getValue()
      .filter((i: TimeTracking) => i.id !== item.id);

    this.updateTimesStorage(items);
  }

  public clearHistory() {
    this.updateTimesStorage([]);
    this.updateWorkingDaysStorage({});
  }
}
