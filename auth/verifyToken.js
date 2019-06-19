const jwt = require('jsonwebtoken');
const cfg = require('../config/bcrypt-password');
const statusController = require('../controllers/status');

function verifyToken(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = JSON.parse(req.headers['current-user']);
  if (!token) {
    let rs = statusController.forbidden();
    return res.status(rs.status).send(rs);
  }

  // verifies secret and checks exp
  jwt.verify(token.token, cfg.secret, function (err, decoded) {
    if (err) {
      let rs = statusController.forbidden();
      return res.status(rs.status).send(rs);
    }

    req.token = {
      email: decoded.email,
      company: decoded.company,
      role: decoded.role
    };
    
    next();
  });
};

module.exports = verifyToken;