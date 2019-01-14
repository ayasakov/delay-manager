import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TimeTrackingService } from '../../core/services/time-tracking.service';
import { TimeTracking } from '../../core/interfaces/time-tracking.interface';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnDestroy {
  items$: Subscription;

  summary = {};
  total = 0;

  /*@Input()
  set delayManager(summary) {
    this.summary = Object.keys(summary).sort().map(key => ({
      day: dayOfWeekMap[key],
      count: summary[key],
    }));

    const days = Object.keys(summary).length > 5 ? 5 : Object.keys(summary).length;
    this.total = this.summary.map(i => i.count).reduce((s, i) => {
      return s + i;
    }, 0) - days * REQUIRED_HOURS * MIN_IN_HOUR;
  }*/

  get days() {
    return Object.keys(this.summary);
  }

  constructor(private timeTrackingService: TimeTrackingService) {
    this.items$ = this.timeTrackingService.getTimeTracking()
      .subscribe((items: Array<TimeTracking>) => this.timeTrackingProcess(items || []));
  }

  ngOnDestroy() {
    this.items$.unsubscribe();
  }

  private timeTrackingProcess(items: Array<TimeTracking>) {
    this.summary = items.reduce((result, item: TimeTracking) => {
      result[item.dayIndex] = result[item.dayIndex] || [];
      result[item.dayIndex].push(item);
      return result;
    }, {});
  }

  public clear() {
    this.timeTrackingService.clearHistory();
  }
}
