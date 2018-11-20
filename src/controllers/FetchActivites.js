const Activite = require('../models/Activite');

module.exports = async (req, res) => {
  const result = await Activite.fetchActivites();
  res.json(result);
};
