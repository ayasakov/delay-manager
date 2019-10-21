const axios = require('axios');

const OBTAIN_TOKEN_ENDPOINT = (clientId, clientSecret, userCode) =>
  `https://slack.com/api/oauth.access?client_id=${clientId}&client_secret=${clientSecret}&code=${userCode}`;

class TokenService {
  constructor() {
    this.clientId = '3800862307.723008059171';
    this.clientSecret = '1043583f26cc42fc456509cc0495504e';
  }

  obtainToken(req, res, code) {
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
