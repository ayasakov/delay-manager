import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dayOfWeekMap } from '../../const/date-title';
import { TimeTrackingService } from '../../core/services/time-tracking.service';
import { Subscription } from 'rxjs';
import { DayOfWeek } from '../../core/interfaces/day-of-week.interface';
import { TimeTracking } from '../../core/interfaces/time-tracking.interface';
import { AuthService } from '../../core/services/auth.service';
import { ISlackUser } from '../../core/interfaces/slack-token.interface';

@Component({
  selector: 'app-delay-manager',
  templateUrl: './delay-manager.component.html',
  styleUrls: ['./delay-manager.component.scss']
})
export class DelayManagerComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  form: FormGroup = this.formBuilder.group({
    id: [''],
    start: ['', Validators.required],
    end: ['', Validators.required],
    dayOfWeek: ['', Validators.required]
  });

  days: Array<DayOfWeek> = Object.keys(dayOfWeekMap)
    .map((d: string) => new DayOfWeek(d, dayOfWeekMap[d]));

  user: ISlackUser;

  isProcessing = false;

  constructor(
    private formBuilder: FormBuilder,
    private timeTrackingService: TimeTrackingService,
    private authService: AuthService,
  ) {
    const status$ = this.timeTrackingService.getStatus()
      .subscribe((val: boolean) => this.isProcessing = val);
    const editFlow$ = this.timeTrackingService.getEditFlow()
      .subscribe((time: TimeTracking) => {
        this.form.patchValue({
          id: time.id,
          start: time.from,
          end: time.to,
          dayOfWeek: time.dayIndex,
        });
      });

    this.subscriptions.add(status$);
    this.subscriptions.add(editFlow$);
  }

  ngOnInit() {
    const user$ = this.authService.getUserInfo().subscribe((user: ISlackUser) => this.user = user);
    this.subscriptions.add(user$);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const {id, start, end, dayOfWeek} = this.form.getRawValue();
      this.form.reset();

      if (id) {
        this.timeTrackingService.editTime({
          id,
          dayIndex: dayOfWeek,
          from: start,
          to: end,
        });

        return;
      }
      this.timeTrackingService.addTime(start, end, dayOfWeek);
    }
  }
}
