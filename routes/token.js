const express = require('express');
const tokenService = require('../services/TokenService');

const router = express.Router();

router.get('/', (req, res, next) => {
  const params = req.query;
  if ('code' in params) {
    tokenService.obtainToken(req, res, params.code);
  } else {
    res.redirect('/auth/login');
  }
});

module.exports = router;
