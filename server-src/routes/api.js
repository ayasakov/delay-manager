const express = require('express');

const sessionChecker = require('../middlewares/session-checker');

const tokenService = require('../services/token-service');
const messageService = require('../services/message-service');
const userService = require('../services/user-service');

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

router.get('/is-authenticated', sessionChecker, (req, res, next) => {
  res.status(200).json({ ok: true });
});

router.get('/user', sessionChecker, (req, res, next) => {
  userService.getUser(req, res);
});

router.get('/message', sessionChecker, (req, res, next) => {
  messageService.getMessages(req, res);
});

module.exports = router;
