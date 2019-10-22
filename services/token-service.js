const axios = require('axios');

const OBTAIN_TOKEN_ENDPOINT = (clientId, clientSecret, userCode) =>
  `https://slack.com/api/oauth.access?client_id=${clientId}&client_secret=${clientSecret}&code=${userCode}`;

class TokenService {
  constructor() {
    this.clientId = process.env.SLACK_CLIENT_ID || '';
    this.clientSecret = process.env.SLACK_CLIENT_SECRET || '';
  }

  obtainToken(req, res, code) {
    if (!this.clientId || !this.clientSecret) {
      console.log('Err: do not fill slack client id and secret');
      res.status(500).json({ error: 'do not fill slack client id and secret' });
      return;
    }

    axios.get(OBTAIN_TOKEN_ENDPOINT(this.clientId, this.clientSecret, code))
      .then((data) => {
        if (data.data.ok) {
          req.session.user = data.data;
          res.status(200).json(data.data);
        } else {
          res.status(401).json(data.data);
        }
      })
      .catch((error) => {
        res.status(500).json(error);
      })
  }
}

const tokenService = new TokenService();
module.exports = tokenService;
