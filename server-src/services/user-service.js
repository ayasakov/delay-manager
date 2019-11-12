const axios = require('axios');

const USER_ENDPOINT = (token, userId) =>
  `https://slack.com/api/users.profile.get?token=${token}&user=${userId}`;

class UserService {
  getUser(req, res) {
    const token = req.session.user.access_token;
    const userId = req.session.user.user_id;

    if (!token || !userId) {
      console.log('Err: do not fill access token');
      res.status(500).json({ error: 'do not fill access token' });
      return;
    }

    axios.get(USER_ENDPOINT(token, userId))
      .then((data) => {
        if (data.data.ok) {
          res.status(200).json(data.data.profile);
        } else {
          res.status(500).json(data.data);
        }
      })
      .catch((error) => {
        res.status(500).json(error);
      })
  }
}

const userService = new UserService();
module.exports = userService;
