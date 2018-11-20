const jwt = require('jsonwebtoken');
require('dotenv').config(); // Loading .env to process.env

/** Verify and return user object from jwt message
 * @param { string } message is the JWT message
 * @param {object} res is a http response object
 * @return { object } return the user object that was verified by jsonwebtoken
 */
const verifyJWT = (message, res) => {
  try {
    res.status(200);
    return jwt.verify(message, process.env.JWT_SECERT);
  } catch (e) {
    res.status(200);
    res.end();
    throw Error('No authority.');
    // return null;
  }
};

/** This function return a non-password user object with a jwt property.
 * @param {object} user contains all information that retrieved from the database.
 * @return {object} Return an user object that includes a user objcet without password and a JWT.
*/
const signJWT = user => {
  const signInfo = { id: user.id, googleToken: user.googleToken };
  const returnUser = { // Do not need return all user's information.
    ...signInfo,
    displayName: user.displayName,
    photo: user.photo,
    jwt: jwt.sign(signInfo, process.env.JWT_SECERT),
  };
  // delete returnUser.password; // delete user.password;
  return returnUser;
};

module.exports = {
  verifyJWT,
  signJWT,
};
