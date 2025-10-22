const express = require('express');

const { addToCart, getCart, updateQuantity, removeFromCart } = require('../controllers/cart.controllers');
const isAuthenticated = require('../middlewares/isAuth');

const cartRouter = express.Router();

cartRouter.use(isAuthenticated);

cartRouter.get('/', getCart);
cartRouter.post('/add', addToCart);
cartRouter.put('/update/:productId', updateQuantity);
cartRouter.delete('/remove/:productId', removeFromCart);

module.exports = cartRouter;
