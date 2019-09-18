export class DayOfWeek {
  constructor(public code: string, public name: string) {
  }
}

export interface WorkingDay {
  [key: number]: boolean;
}
