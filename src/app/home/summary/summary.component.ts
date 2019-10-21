import { Component, HostBinding, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimeTrackingService } from '../../core/services/time-tracking.service';
import { TimeTracking } from '../../core/interfaces/time-tracking.interface';
import { DAY_HOURS, MINUTES, Time } from '../../utils/time';
import { isWorkingDay } from '../../utils/working-day';
import { DayOfWeekService } from '../../core/services/day-of-week.service';
import { WorkingDay } from '../../core/interfaces/day-of-week.interface';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnDestroy {
  subscriptions: Subscription = new Subscription();

  summary = {};
  workingDays = {};
  total = 0;

  get days() {
    return Object.keys(this.summary);
  }

  @HostBinding('class.opened') opened = false;

  constructor(private timeTrackingService: TimeTrackingService, private dayOfWeekService: DayOfWeekService) {
    const items$ = this.timeTrackingService.getTimeTracking()
      .subscribe((items: TimeTracking[]) => this.timeTrackingProcess(items || []));
    const days$ = this.dayOfWeekService.getWorkingDays()
      .subscribe((value: WorkingDay) => this.workingDaysProcess(value));

    this.subscriptions.add(items$);
    this.subscriptions.add(days$);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private timeTrackingProcess(items: Array<TimeTracking>) {
    this.summary = items.reduce((result, item: TimeTracking) => {
      result[item.dayIndex] = result[item.dayIndex] || [];
      result[item.dayIndex].push(item);
      return result;
    }, {});
    this.calculateTotal();
  }

  private workingDaysProcess(value: any) {
    this.workingDays = value;
    this.calculateTotal();
  }

  private calculateTotal() {
    this.total = this.days.reduce((result: number, key: string) => {
      const times: Array<TimeTracking> = this.summary[key] || [];

      const totalTimes = times.reduce((res: number, t: TimeTracking) => {
        return res + +new Time(t.from).diff(t.to);
      }, 0);

      const dayIndex = times.length ? times[0].dayIndex : -1;
      const workHours = isWorkingDay(dayIndex, this.workingDays) ? totalTimes - DAY_HOURS * MINUTES : totalTimes;

      return result + workHours;
    }, 0);
  }

  public clear() {
    this.timeTrackingService.clearHistory();
  }

  public panel() {
    this.opened = !this.opened;
  }
}
