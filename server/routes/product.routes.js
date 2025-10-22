const express = require("express");

const { createProduct, getAllProducts, fetchProduct } = require('../controllers/product.controllers')

const productRouter = express.Router()

productRouter.post('/create', createProduct)
productRouter.get('/fetchall', getAllProducts)
productRouter.get('/fetch/:id', fetchProduct)

module.exports = productRouter