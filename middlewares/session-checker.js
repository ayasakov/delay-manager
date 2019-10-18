const sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    next();
  } else {
    res.status(401).send({ error: 'unauthorized' })
  }
};

module.exports = sessionChecker;
