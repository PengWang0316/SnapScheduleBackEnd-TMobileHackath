const Logger = require('../utils/Logger');
const { getPool } = require('../DBHelper');

const FETCH_SUGGESTIONS_SQL = 'SELECT * FROM suggestions';

exports.fetchSuggestions = () => new Promise((resolve, reject) => {
  getPool().query(FETCH_SUGGESTIONS_SQL, (err, results, fields) => {
    if (err) {
      Logger.error(FETCH_SUGGESTIONS_SQL, err);
      reject(err);
    }
    resolve(results);
  });
});
