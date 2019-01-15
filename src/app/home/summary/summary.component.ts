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
  days$: Subscription;

  summary = {};
  workingDays = {};
  total = 0;

  get days() {
    return Object.keys(this.summary);
  }

  constructor(private timeTrackingService: TimeTrackingService) {
    this.items$ = this.timeTrackingService.getTimeTracking()
      .subscribe((items: Array<TimeTracking>) => this.timeTrackingProcess(items || []));
    this.days$ = this.timeTrackingService.getWorkingDays()
      .subscribe((value: any) => this.workingDays = value);
  }

  ngOnDestroy() {
    this.items$.unsubscribe();
    this.days$.unsubscribe();
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
