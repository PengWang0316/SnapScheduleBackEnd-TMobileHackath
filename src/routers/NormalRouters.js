const normalRouter = require('express').Router();
// const cloudinary = require('cloudinary');

require('dotenv').config(); // Loading .env to process.env

// Controllers import
const login = require('../controllers/Login');
const registerNewUser = require('../controllers/RegisterNewUser');
const loginWithGoogle = require('../controllers/LoginWithGoogle');
const jwtMessageVerify = require('../controllers/JwtMessageVerify');
const fetchEvents = require('../controllers/FetchCalendarEvents');
const fetchSuggestions = require('../controllers/FetchSuggestions');
const fetchActivites = require('../controllers/FetchActivites');

// cloudinary.config({ // confige the cloudinary library.
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

/* User login */
normalRouter.get('/login', login);

normalRouter.get('/loginWithGoogle', loginWithGoogle);

/* Register a new user */
normalRouter.post('/registerNewUser', registerNewUser);

/* Checking jwt token */
normalRouter.get('/jwtMessageVerify', jwtMessageVerify);
normalRouter.get('/fetchEvents', fetchEvents);
normalRouter.get('/fetchSuggestions', fetchSuggestions);
normalRouter.get('/fetchActivites', fetchActivites);

module.exports = normalRouter;
