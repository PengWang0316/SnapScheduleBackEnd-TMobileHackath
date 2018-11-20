const Logger = require('../utils/Logger');
const { getPool } = require('../DBHelper');

const FETCH_ONE_USER_SQL = 'SELECT * FROM users WHERE username = ? LIMIT 1';
const REGISTER_NEW_USER_SQL = 'INSERT INTO users (username, password, name, photo) VALUES (?, ?, ?, ?)';
const FETCH_USER_SQL = 'SELECT id FROM users WHERE googleId = ? LIMIT 1';
const INSERT_USER = 'INSERT INTO users (googleId, displayName, avatar, email) VALUES (?, ?, ?, ?)';

/* Fetching one user based on its id */
exports.fetchOneUser = username => new Promise((resolve, reject) => {
  // Return the password to allow bcrybt checking. It has to be deleted before return a user object to the user's browser.
  getPool().query(FETCH_ONE_USER_SQL, [username], (err, results, fields) => {
    if (err) {
      Logger.error(FETCH_ONE_USER_SQL, err);
      reject(err);
    }
    resolve(results);
  });
});

// exports.findUserWithUsername = username => promiseFindResult(db => db.collection(COLLECTION_USER)
//   .find({ username }, {
//     email: 0, facebookId: 0, googleId: 0,
//   }));

/* Registering a new user */
exports.registerNewUser = user => new Promise((resolve, reject) => {
  getPool().query(REGISTER_NEW_USER_SQL, [user.username, user.password, user.name, user.photo], (err, results, fields) => {
    if (err) {
      Logger.error(REGISTER_NEW_USER_SQL, err);
      reject(err);
    }
    resolve(results);
  });
});

exports.fetchOrCreateUser = user => new Promise((resolve, reject) => {
  getPool().query(FETCH_USER_SQL, [user.googleId], (err, results, fields) => {
    if (err) {
      Logger.error(REGISTER_NEW_USER_SQL, err);
      reject(err);
    }
    if (results.length === 0) {
      getPool().query(INSERT_USER, [user.googleId, user.displayName, user.avatar, user.email], (errA, resultA) => {
        resolve(resultA.insertId);
      });
    } else resolve(results[0].id);
  });
});
