const bcrypt = require('bcryptjs');
const logger = require('../utils/Logger');

const { registerNewUser } = require('../models/User');

module.exports = (req, res) => bcrypt.hash(req.body.password, process.env.SALT_ROUNDS * 1)
  .then(hash => {
    registerNewUser({
      username: req.body.username,
      password: hash,
      name: req.body.name,
      photo: req.body.photo,
    }).then(result => {
      res.json(result);
    }).catch(err => logger.error('/registerNewUser', err));
  }).catch(err => logger.error('/registerNewUser', err));
