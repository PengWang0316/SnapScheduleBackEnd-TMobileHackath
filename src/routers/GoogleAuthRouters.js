const googleAuthRouter = require('express')();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const jwt = require('jsonwebtoken');
// const winston = require('winston');

// const mongodb = require('../MongoDB');
// const loginWithGoogle = require('../controllers/LoginWithGoogle');
const { fetchOrCreateUser } = require('../models/User');
const Logger = require('../utils/Logger');

require('dotenv').config(); // Loading .env to process.env

/** Setting up the Winston logger.
  * Under the development mode log to console.
*/
const logger = require('../utils/Logger');
const JWTUtil = require('../utils/JWTUtil');
// const logger = new winston.Logger({
//   level: process.env.LOGGING_LEVEL,
//   transports: [
//     new (winston.transports.Console)()
//   ]
// });

/** Replaces the previous transports with those in the
new configuration wholesale.
  * When under the production mode, log to a file.
*/
// if (process.env.NODE_ENV === 'production')
//   logger.configure({
//     level: 'error',
//     transports: [
//       new (winston.transports.File)({ filename: 'error.log' })
//     ]
//   });

googleAuthRouter.use(passport.initialize());
// googleAuthRouter.use(passport.session());

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.GOOGLE_CALLBACK_URL}/api/v1/auth/google/callback`,
  },
  (accessToken, refreshToken, profile, done) => {
    const user = {
      googleId: profile.id,
      facebookId: '',
      displayName: profile.displayName,
      avatar: profile.photos[0] ? profile.photos[0].value : '',
      email: profile.emails[0] ? profile.emails[0].value : '',
      accessToken,
    };
    if (!user.displayName) user.displayName = profile.emails[0] ? profile.emails[0].value : 'Google User'; // Check whether the user has a display name. If not, try to use the email address as the display name.
    return done(null, user);
  /* User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       }); */
  },
));

passport.serializeUser((user, done) => {
  // console.log('serializeUser: ', user);
  done(null, user);
});

passport.deserializeUser((id, done) => {
  // console.log('deserializeUser');
  done(null, null);
});

googleAuthRouter.get(
  '/googleLogin',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read', 'https://www.googleapis.com/auth/calendar', 'openid'],
  }),
);

googleAuthRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.GOOGLE_FAILURE_REDIRECT }),
  async (req, res) => {
    let result;
    // Fetch or create a user from database.
    try {
      result = await fetchOrCreateUser(req.user);
    } catch (err) {
      Logger.error('/loginWithGoogle', err);
      res.end();
    }
    res.redirect(`${process.env.REACT_LOGIN_CALLBACK_RUL}?jwt=${JWTUtil.signJWT({ id: result, googleToken: req.user.accessToken }).jwt}`);

    // fetchOrCreateUser(req.user).then(({ value }) => res.redirect(`${process.env.REACT_LOGIN_CALLBACK_RUL}?jwt=${JWTUtil.signJWT(value).jwt}`))
    //   .catch(err => logger.error('GoogleAuthRouters => /google/callback', err));
  },
);

// googleAuthRouter.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: process.env.GOOGLE_FAILURE_REDIRECT }),
//   (req, res) => {
//     // Fetch or create a user from database.
//     mongodb.fetchOrCreateUser(req.user).then(({ value }) => res.redirect(`${process.env.REACT_LOGIN_CALLBACK_RUL}?jwt=${JWTUtil.signJWT(value).jwt}`))
//       .catch(err => logger.error('GoogleAuthRouters => /google/callback', err));
//   },
// );

module.exports = googleAuthRouter;
