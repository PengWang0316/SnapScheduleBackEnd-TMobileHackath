const Logger = require('../utils/Logger');
const { fetchOrCreateUser } = require('../models/User');

module.exports = async (req, res) => {
  try {
    res.json(await fetchOrCreateUser({ googleId: req.query.googleId }));
  } catch (err) {
    Logger.error('/loginWithGoogle', err);
    res.end();
  }
};
