const undefinedSession = (req, res, next) => {
  if (req.cookies['connect.sid'] && !req.session.user) {
    res.clearCookie('connect.sid');
  }
  next();
};

module.exports = undefinedSession;
