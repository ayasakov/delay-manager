import * as moment from 'moment';

const FORMAT = 'HH:mm';
const MILLISECONDS = 1000;
const SECONDS = 60;
const MINUTES = 60;
const DAY_HOURS = 9;

export class Time {
  static getTime(time: string) {
    return moment(time, FORMAT);
  }

  static getDiff(a, b): number {
    const diff: number = b.diff(a); // ms
    return diff / MILLISECONDS / SECONDS;
  }

  static getHumanFormat(minutes: number) {
    const h = Math.floor(minutes / MINUTES);
    const m = minutes % MINUTES;
    return `${h}h ${m}m`;
  }
}
