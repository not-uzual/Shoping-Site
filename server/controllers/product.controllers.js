const Product = require('../models/product.model')

async function createProduct(req, res) {
    try {
        const { name, price, image, discount } = req.body;

        const newProduct = new Product({name, price, image, discount})

        await newProduct.save()

        return res.status(201).json({
            "message": "Product created successfully",
            "product": newProduct
        })
        
    } catch (error) {
        return res.sendStatus(500)
    }
}

async function getAllProducts(req, res) {
    try {
        const allProducts = await Product.find({});
        
        res.status(200).json(allProducts)
    } catch (error) {
        return res.sendStatus(500)
    }
}

async function fetchProduct(req, res) {
    try {
        const product = await Product.findById(req.params.id)
        
        res.status(200).json(product)
    } catch (error) {
        return res.sendStatus(500)
    }
}

module.exports = { createProduct, getAllProducts, fetchProduct };