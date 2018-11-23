import * as moment from 'moment';

const FORMAT = 'HH:mm';
const MILLISECONDS = 1000;
const SECONDS = 60;
const MINUTES = 60;
const DAY_HOURS = 9;

export class Time {
  public time: moment.Moment;

  static getTime(time: string): moment.Moment {
    return moment(time, FORMAT);
  }

  static getDiff(a, b): number {
    const diff: number = b.diff(a); // ms
    return diff / MILLISECONDS / SECONDS;
  }

  static getHumanFormat(minutes: number) {
    const h = Math.floor(minutes / MINUTES);
    const m = minutes - h * MINUTES;
    return `${h}h ${m}m`;
  }

  constructor(time: string) {
    this.time = Time.getTime(time);
  }

  public diff(time: string, pretty?: boolean): string {
    const b = Time.getTime(time);
    const diff = Time.getDiff(this.time, b);
    return pretty ? Time.getHumanFormat(diff) : `${diff}`;
  }
}
