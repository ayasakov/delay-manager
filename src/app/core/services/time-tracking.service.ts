import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { guid } from '../../utils/guid';
import { catchError, filter } from 'rxjs/operators';
import { TimeTracking } from '../interfaces/time-tracking.interface';
import { DayOfWeekService } from './day-of-week.service';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService {
  private items: BehaviorSubject<TimeTracking[]>;
  private processing: BehaviorSubject<boolean>;
  private editFlow: Subject<TimeTracking>;

  protected keyTimes = 'times';

  constructor(private localStorage: LocalStorage, private dayOfWeekService: DayOfWeekService) {
    this.items = new BehaviorSubject<TimeTracking[]>([]);
    this.editFlow = new Subject<TimeTracking>();
    this.processing = new BehaviorSubject<boolean>(false);

    this.init();
  }

  private init() {
    this.getFromStorage().subscribe((val: string) => {
      const items: TimeTracking[] = JSON.parse(val);
      this.items.next(items || []);
    });
  }

  private getFromStorage(): Observable<any> {
    return this.localStorage.getItem(this.keyTimes);
  }

  private setToStorage(value: string) {
    return this.localStorage.setItem(this.keyTimes, value)
      .pipe(catchError(
        (err) => {
          console.log('err: error during cache update.', err);
          const prev: TimeTracking[] = this.items.getValue();
          return of(prev);
        })
      );
  }

  private updateTimesStorage(values: TimeTracking[]) {
    this.processing.next(true);

    this.setToStorage(JSON.stringify(values))
      .subscribe(
        () => {
          this.items.next(values);
          this.processing.next(false);
        },
        () => this.processing.next(false)
      );
  }

  public getStatus(): Observable<boolean> {
    return this.processing.asObservable();
  }

  public getTimeTracking(): Observable<TimeTracking[]> {
    return this.items.asObservable();
  }

  public getEditFlow(): Observable<TimeTracking> {
    return this.editFlow.asObservable()
      .pipe(filter(time => !!time));
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

  public requestEditTime(time: TimeTracking) {
    this.editFlow.next(time);
  }

  public editTime(time: TimeTracking) {
    const times: TimeTracking[] = [...this.items.getValue()];
    const idx = times.findIndex(t => t.id === time.id);
    if (idx > -1) {
      times.splice(idx, 1, time);
      this.updateTimesStorage(times);
      this.requestEditTime(null);
      return;
    }
    console.log('err: something went wrong. There are no time with id=' + time.id);
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
    this.dayOfWeekService.clearHistory();
  }
}
