const express = require('express');

const sessionChecker = require('../middlewares/session-checker');
const tokenService = require('../services/TokenService');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('work-delay api v0.0.1');
});

router.get('/token', (req, res, next) => {
  const params = req.query;
  if ('code' in params) {
    tokenService.obtainToken(req, res, params.code);
  } else if ('error' in params) {
    res.status(401).json({ error: params.error });
  } else {
    res.status(500).json(params);
  }
});

router.get('/user', sessionChecker, (req, res, next) => {
  res.status(200).json(req.session.user);
});

module.exports = router;
