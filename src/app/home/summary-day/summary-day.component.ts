import { Component, Input } from '@angular/core';
import { TimeTracking } from '../../core/interfaces/time-tracking.interface';
import { TimeTrackingService } from '../../core/services/time-tracking.service';
import { dayOfWeekMap } from '../../const/date-title';
import { DAY_HOURS, MINUTES, Time } from '../../utils/time';
import { isWorkingDay } from '../../utils/working-day';

@Component({
  selector: 'app-summary-day',
  templateUrl: './summary-day.component.html',
  styleUrls: ['./summary-day.component.scss']
})
export class SummaryDayComponent {
  times: Array<TimeTracking> = [];
  dayTitle = '';
  isWorkDay = false;
  total = 0;
  dayIndex = -1;

  @Input() set workingDays(days: any) {
    this.isWorkDay = isWorkingDay(this.dayIndex, days);
  }

  @Input() set data(times: Array<TimeTracking>) {
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

  get formattedTotal(): number {
    return this.isWorkDay ? this.total - DAY_HOURS * MINUTES : this.total;
  }

  constructor(private timeTrackingService: TimeTrackingService) { }

  public delete(item) {
    this.timeTrackingService.deleteTime(item);
  }

  public change() {
    this.timeTrackingService.changeWorkingDays(this.dayIndex, this.isWorkDay);
  }
}
