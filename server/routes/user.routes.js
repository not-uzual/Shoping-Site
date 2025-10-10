const express = require('express')

const getCurrentUser = require('../controllers/user.controllers')
const isAuthenticated = require('../middlewares/isAuth')

const userRouter = express.Router()

userRouter.get('/current', isAuthenticated, getCurrentUser)

module.exports = userRouter;

