import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Time } from '../../utils/time';
import { dayOfWeekMap } from '../../const/date-title';

class DayOfWeek {
  constructor(public code: string, public name: string) {
  }
}

@Component({
  selector: 'app-delay-manager',
  templateUrl: './delay-manager.component.html',
  styleUrls: ['./delay-manager.component.scss']
})
export class DelayManagerComponent {
  form: FormGroup = this.formBuilder.group({
    /*intervals: this.formBuilder.array([
      this.formBuilder.control('')
    ])*/
    start: ['', Validators.required],
    end: ['', Validators.required],
    dayOfWeek: ['', Validators.required]
  });

  days: Array<DayOfWeek> = Object.keys(dayOfWeekMap)
    .map((d: string) => new DayOfWeek(d, dayOfWeekMap[d]));

  delayManager = {};

  get intervals(): FormArray {
    return this.form.get('intervals') as FormArray;
  }

  constructor(private formBuilder: FormBuilder) {
  }

  addInterval(): void {
    this.intervals.push(
      this.formBuilder.control('')
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      const {start, end, dayOfWeek} = this.form.getRawValue();
      const diff: string = new Time(start).diff(end);

      this.delayManager[dayOfWeek] = this.delayManager[dayOfWeek] || 0;
      this.delayManager[dayOfWeek] += Number(diff);

      console.log(Time.getHumanFormat(this.delayManager[dayOfWeek]));
    }
  }

}
