const usernamePasswordRouters = require('express').Router();

const registerNewUser = require('../controllers/RegisterNewUser');
const checkUsernameAvailable = require('../controllers/CheckUsernameAvailable');
const loginWithPassword = require('../controllers/LoginWithPassword');

usernamePasswordRouters.get('/loginWithPassword', loginWithPassword);

usernamePasswordRouters.get('/checkUsernameAvailable', checkUsernameAvailable);

usernamePasswordRouters.post('/registerUser', registerNewUser);

module.exports = usernamePasswordRouters;
