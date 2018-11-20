const Suggestion = require('../models/Suggestion');

module.exports = async (req, res) => {
  const result = await Suggestion.fetchSuggestions();
  res.json(result);
};
