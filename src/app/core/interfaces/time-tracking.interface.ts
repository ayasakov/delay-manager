export class TimeTracking {
  constructor(public id: string,
              public from: string,
              public to: string,
              public dayIndex: number,
              public messageFrom?: string,
              public messageTo?: string) {
  }
}
