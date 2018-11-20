const logger = require('../utils/Logger');
const JWTUtil = require('../utils/JWTUtil');
const { fetchOneUser } = require('../models/User');

module.exports = (req, res) => fetchOneUser(JWTUtil.verifyJWT(req.query.jwtMessage, res).id)
  .then(result => {
    const returnUser = { ...result, jwt: req.query.jwtMessage };
    delete returnUser.password; // Remove password before return.
    if (!returnUser.role) returnUser.role = 3; // If the user does not have any role, give a 3 for the default role.
    res.json(returnUser);
  }).catch(err => logger.error('/jwtMessageVerify', err));
