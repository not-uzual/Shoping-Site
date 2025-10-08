const express = require('express');

const validateResponse = require('../middlewares/validateResponse');
const { signup, login } = require('../controllers/auth.contollers');

const authRouter = express.Router();

authRouter.post('/signup', validateResponse, signup);
authRouter.post('/login', login);

module.exports = authRouter;