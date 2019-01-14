import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dayOfWeekMap } from '../../const/date-title';
import { TimeTrackingService } from '../../core/services/time-tracking.service';
import { Subscription } from 'rxjs';
import { DayOfWeek } from '../../core/interfaces/day-of-week.interface';

@Component({
  selector: 'app-delay-manager',
  templateUrl: './delay-manager.component.html',
  styleUrls: ['./delay-manager.component.scss']
})
export class DelayManagerComponent implements OnDestroy {
  status$: Subscription;

  form: FormGroup = this.formBuilder.group({
    start: ['', Validators.required],
    end: ['', Validators.required],
    dayOfWeek: ['', Validators.required]
  });

  days: Array<DayOfWeek> = Object.keys(dayOfWeekMap)
    .map((d: string) => new DayOfWeek(d, dayOfWeekMap[d]));

  isProcessing = false;

  constructor(
    private formBuilder: FormBuilder,
    private timeTrackingService: TimeTrackingService,
  ) {
    this.status$ = this.timeTrackingService.getStatus()
      .subscribe((val: boolean) => this.isProcessing = val);
  }

  ngOnDestroy() {
    this.status$.unsubscribe();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const {start, end, dayOfWeek} = this.form.getRawValue();
      this.timeTrackingService.addTime(start, end, dayOfWeek);
    }
  }
}
