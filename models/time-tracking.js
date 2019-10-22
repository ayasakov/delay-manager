class TimeTracking {
  constructor(messageFrom, messageTo, dayIndex) {
    const dateFrom = new Date(messageFrom.ts * 1000);
    this.from = `${TimeTracking.toFixed(dateFrom.getHours())}:${TimeTracking.toFixed(dateFrom.getMinutes())}`;
    this.messageFrom = messageFrom.text;

    const dateTo = new Date(messageTo.ts * 1000);
    this.to = `${TimeTracking.toFixed(dateTo.getHours())}:${TimeTracking.toFixed(dateTo.getMinutes())}`;
    this.messageTo = messageTo.text;

    this.dayIndex = `${dayIndex}`;
  }

  static toFixed(value) {
    return ('0' + `${value}`).slice(-2);
  }
}

module.exports = TimeTracking;
