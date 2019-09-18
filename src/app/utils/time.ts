import * as moment from 'moment';

const FORMAT = 'HH:mm';
const MILLISECONDS = 1000;
const SECONDS = 60;
export const MINUTES = 60;
export const DAY_HOURS = 9;

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
    const h = Math.floor(Math.abs(minutes) / MINUTES);
    const m = Math.abs(minutes) - h * MINUTES;

    const h_str = `${h}`.length === 1 ? `0${h}` : `${h}`;
    const m_str = `${m}`.length === 1 ? `0${m}` : `${m}`;

    const sign = minutes < 0 ? '-' : '';

    return `${sign}${h_str}:${m_str}`;
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
