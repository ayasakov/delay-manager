import { Component, Input } from '@angular/core';
import { TimeTracking } from '../../core/interfaces/time-tracking.interface';
import { TimeTrackingService } from '../../core/services/time-tracking.service';
import { dayOfWeekMap } from '../../const/date-title';
import { Time } from '../../utils/time';

const REQUIRED_HOURS = 9;
const MIN_IN_HOUR = 60;

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

  @Input() set data(times: Array<TimeTracking>) {
    if (times && times.length) {
      const dayIndex = times[0].dayIndex;

      this.isWorkDay = dayIndex !== 0 && dayIndex !== 6; // Sunday and Saturday
      this.dayTitle = dayOfWeekMap[dayIndex];
      this.times = times;

      this.total = times.reduce((res: number, t: TimeTracking) => {
        return res + +new Time(t.from).diff(t.to);
      }, 0);
    }
    this.times = [];
  }

  get formattedTotal(): number {
    return this.isWorkDay ? this.total - REQUIRED_HOURS * MIN_IN_HOUR : this.total;
  }

  constructor(private timeTrackingService: TimeTrackingService) { }

  public delete(item) {
    this.timeTrackingService.deleteTime(item);
  }
}
