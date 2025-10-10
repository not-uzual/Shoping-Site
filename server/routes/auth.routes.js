const express = require('express');

const validateResponse = require('../middlewares/validateResponse');
const { signup, login, logout } = require('../controllers/auth.controllers');
const isAuthenticated = require('../middlewares/isAuth');

const authRouter = express.Router();

authRouter.post('/signup', validateResponse, signup);
authRouter.post('/login', login);
authRouter.get('/logout', logout);

module.exports = authRouter;