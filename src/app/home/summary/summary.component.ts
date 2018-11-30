import { Component, Input } from '@angular/core';
import { dayOfWeekMap } from '../../const/date-title';

const REQUIRED_HOURS = 9;
const MIN_IN_HOUR = 60;

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  summary = [];
  total = 0;

  @Input()
  set delayManager(summary) {
    this.summary = Object.keys(summary).sort().map(key => ({
      day: dayOfWeekMap[key],
      count: summary[key],
    }));

    const days = Object.keys(summary).length > 5 ? 5 : Object.keys(summary).length;
    this.total = this.summary.map(i => i.count).reduce((s, i) => {
      return s + i;
    }, 0) - days * REQUIRED_HOURS * MIN_IN_HOUR;
  }

  constructor() {
  }
}
