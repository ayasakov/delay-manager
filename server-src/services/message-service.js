const axios = require('axios');
const TimeTracking = require('../models/time-tracking');

const MESSAGE_ENDPOINT = (token, channelId, oldest) =>
  `https://slack.com/api/conversations.history?token=${token}&channel=${channelId}&oldest=${oldest}&limit=200`;

const getStartWeekDayUnix = () => {
  const date = new Date();

  date.setHours(1);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  const day = date.getDay();
  if (day !== 1) {
    date.setHours(-24 * (day - 1));
  }

  // one more week for debug
  if (process.env.PRODUCTION !== 'true') {
    date.setHours(-24 * 7);
  }

  return +date / 1000;
};

class MessageService {
  constructor() {
    this.channelId = process.env.TIMETRACKING_CHANNEL_ID || '';
  }

  static comparator(a, b) {
    if (a.ts > b.ts) { return -1; }
    if (a.ts < b.ts) { return 1; }
    return 0;
  }

  getMessages(req, res) {
    if (!this.channelId) {
      console.log('Err: do not fill slack channel id');
      res.status(500).json({ error: 'do not fill slack channel id' });
      return;
    }

    axios.get(MESSAGE_ENDPOINT(req.session.user.access_token, this.channelId, getStartWeekDayUnix()))
      .then((data) => {
        if (data.data.ok) {
          const messages = this.convertMessageEntity(data.data.messages
            .filter(m => m.user === req.session.user.user_id)
            .sort(MessageService.comparator));
          res.status(200).json(messages);
        } else {
          res.status(500).json(data.data);
        }
      })
      .catch((error) => {
        res.status(500).json(error);
      })
  }

  convertMessageEntity(messages) {
    const dayMap = messages.reduce((r, m) => {
      const date = new Date(m.ts * 1000);
      r[date.getDay()] = r[date.getDay()] || [];
      r[date.getDay()].push(m);
      return r;
    }, {});

    return Object.keys(dayMap).reduce((r, dayIndex) => {
      if (dayMap[dayIndex].length < 2) {
        return r;
      }

      while (dayMap[dayIndex].length >= 2) {
        const messageFrom = dayMap[dayIndex].pop();
        const messageTo = dayMap[dayIndex].pop();
        const timeTracking = new TimeTracking(messageFrom, messageTo, dayIndex);
        r.push(timeTracking);
      }

      return r;
    }, []);
  }
}

const messageService = new MessageService();
module.exports = messageService;
