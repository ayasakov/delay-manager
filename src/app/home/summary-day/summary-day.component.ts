import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TimeTracking } from '../../core/interfaces/time-tracking.interface';
import { dayOfWeekMap } from '../../const/date-title';
import { DAY_HOURS, MINUTES, Time } from '../../utils/time';
import { DayOfWeekService } from '../../core/services/day-of-week.service';
import { TimeTrackingService } from '../../core/services/time-tracking.service';
import { Subscription } from 'rxjs';
import { WorkingDay } from '../../core/interfaces/day-of-week.interface';

@Component({
  selector: 'app-summary-day',
  templateUrl: './summary-day.component.html',
  styleUrls: ['./summary-day.component.scss']
})
export class SummaryDayComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  times: TimeTracking[] = [];
  dayTitle = '';
  isWorkDay = false;
  total = 0;
  dayIndex = -1;

  diff = 0;

  @Input() set data(times: TimeTracking[]) {
    if (times && times.length) {
      this.dayIndex = times[0].dayIndex;
      this.dayTitle = dayOfWeekMap[this.dayIndex];
      this.times = times;

      this.total = times.reduce((res: number, t: TimeTracking) => {
        return res + +new Time(t.from).diff(t.to);
      }, 0);

      return;
    }
    this.times = [];
  }

  constructor(
    private daysOfWeekService: DayOfWeekService,
    private timeTrackingService: TimeTrackingService,
  ) {
  }

  ngOnInit() {
    const days$ = this.daysOfWeekService.getWorkingDays().subscribe(
      (days: WorkingDay) => {
        this.isWorkDay = days[this.dayIndex] || false;
        this.diff = this.isWorkDay ? DAY_HOURS * MINUTES : 0;
      }
    );

    this.subscriptions.add(days$);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public delete(item) {
    this.timeTrackingService.deleteTime(item);
  }

  public edit(item) {
    this.timeTrackingService.requestEditTime(item);
  }

  public change() {
    this.daysOfWeekService.changeWorkingDays(this.dayIndex, this.isWorkDay);
  }
}
