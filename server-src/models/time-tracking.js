class TimeTracking {
  constructor(messageFrom, messageTo, dayIndex) {
    const dateFrom = new Date(messageFrom.ts * 1000);
    this.from = TimeTracking.getUtcDate(dateFrom);
    this.messageFrom = messageFrom.text;

    const dateTo = new Date(messageTo.ts * 1000);
    this.to = TimeTracking.getUtcDate(dateTo);
    this.messageTo = messageTo.text;

    this.dayIndex = `${dayIndex}`;
  }

  static toFixed(value) {
    return ('0' + `${value}`).slice(-2);
  }

  static getUtcDate(date) {
    return `${date.getUTCFullYear()}-${TimeTracking.toFixed(date.getUTCMonth() + 1)}-${TimeTracking.toFixed(date.getUTCDate())}` +
      ' ' + `${TimeTracking.toFixed(date.getUTCHours())}:${TimeTracking.toFixed(date.getUTCMinutes())}` + 'Z';
  }
}

module.exports = TimeTracking;
