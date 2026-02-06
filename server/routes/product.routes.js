const express = require("express");

const { createProduct, getAllProducts, fetchProduct, addProductToWishlist, removeFromWishlist, getWishlist } = require('../controllers/product.controllers')
const isAuthenticated = require('../middlewares/isAuth');
const optionalAuth = require('../middlewares/optionalAuth');

const productRouter = express.Router()

productRouter.post('/create', createProduct)
productRouter.get('/fetchall', optionalAuth, getAllProducts)
productRouter.get('/fetch/:id', fetchProduct)

productRouter.post('/wishlist/:id', isAuthenticated, addProductToWishlist)
productRouter.delete('/wishlist/:id', isAuthenticated, removeFromWishlist)
productRouter.get('/wishlist', isAuthenticated, getWishlist)

module.exports = productRouter