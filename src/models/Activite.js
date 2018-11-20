const Logger = require('../utils/Logger');
const { getPool } = require('../DBHelper');

const FETCH_ACTIVITES_SQL = 'SELECT * FROM activites';

exports.fetchActivites = () => new Promise((resolve, reject) => {
  getPool().query(FETCH_ACTIVITES_SQL, (err, results, fields) => {
    if (err) {
      Logger.error(FETCH_ACTIVITES_SQL, err);
      reject(err);
    }
    resolve(results);
  });
});
