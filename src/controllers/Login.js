const bcrypt = require('bcryptjs');

const { fetchOneUser } = require('../models/User');
const Logger = require('../../src/utils/Logger');
const { signJWT } = require('../utils/JWTUtil');

// Use the old promise then for the test purpose
module.exports = (req, res) => fetchOneUser(req.query.username).then(result => {
  if (!result || result.length === 0) res.json({ isFail: true });
  else {
    const user = result[0];
    bcrypt.compare(req.query.password, user.password).then(compareResult => {
      if (compareResult) {
        // JWTUtil's signJWT will remove the password before return to the client side.
        res.json(signJWT(user));
      } else res.json({ isFail: true });
    });
  }
}).catch(err => {
  Logger.error('/fetchCandidatesInfo', err);
  res.json({ isFail: true });
});
