import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WorkingDay } from '../interfaces/day-of-week.interface';
import { DEFAULT_WORKING_DAYS } from '../../const/date-title';

@Injectable({
  providedIn: 'root'
})
export class DayOfWeekService {
  private days: BehaviorSubject<WorkingDay> = new BehaviorSubject<WorkingDay>(DEFAULT_WORKING_DAYS);

  protected keyWorkingDays = 'workingDays';

  constructor(private localStorage: LocalStorage) {
    this.init();
  }

  private init() {
    this.getFromStorage().subscribe((val: string) => {
      const value: any = JSON.parse(val);
      if (value) {
        this.days.next(value);
      }
    });
  }

  private getFromStorage(): Observable<any> {
    return this.localStorage.getItem(this.keyWorkingDays);
  }

  private setToStorage(value: string) {
    return this.localStorage.setItem(this.keyWorkingDays, value)
      .pipe(catchError(
        (err) => {
          console.log('err: error during cache update.', err);
          const prev: WorkingDay = this.days.getValue();
          return of(prev);
        })
      );
  }

  private updateWorkingDaysStorage(value: WorkingDay) {
    this.setToStorage(JSON.stringify(value))
      .subscribe(() => this.days.next(value));
  }

  public getWorkingDays(): Observable<WorkingDay> {
    return this.days.asObservable();
  }

  public changeWorkingDays(dayIndex: number, value: boolean) {
    if (!dayIndex || dayIndex > 6 || dayIndex < 0) {
      console.log('err: working days weren\'t updated');
      return;
    }

    const workingDays: WorkingDay = this.days.getValue();
    workingDays[dayIndex] = value;
    this.updateWorkingDaysStorage(workingDays);
  }

  public clearHistory() {
    this.updateWorkingDaysStorage(DEFAULT_WORKING_DAYS);
  }
}
