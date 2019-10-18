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
  } else {
    res.redirect('/auth/login');
  }
});

router.get('/user', sessionChecker, (req, res, next) => {
  res.status(200).json(req.session.user);
});

module.exports = router;
