const express = require('express')

const { getCurrentUser, addNewAddress, } = require('../controllers/user.controllers')
const isAuthenticated = require('../middlewares/isAuth')

const userRouter = express.Router()

userRouter.get('/current', isAuthenticated, getCurrentUser)
userRouter.post('/address', isAuthenticated, addNewAddress)

module.exports = userRouter;

