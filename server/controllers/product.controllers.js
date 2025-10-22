const Product = require('../models/product.model')
const User = require('../models/user.model')

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

async function addProductToWishlist(req, res){
    try {
        const productId = req.params.id;
        const userId = req.userId;
        
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({ message: "Product not found" });
        }
        
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        
        if(user.wishlist.includes(productId)){
            return res.status(400).json({ message: "Product already in wishlist" });
        }
        
        user.wishlist.push(productId);
        await user.save();

        return res.status(201).json({ 
            message: "Product added to wishlist successfully",
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

async function removeFromWishlist(req, res){
    try {
        const productId = req.params.id;
        const userId = req.userId;
        
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        
        if(!user.wishlist.includes(productId)){
            return res.status(400).json({ message: "Product not in wishlist" });
        }
        
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        return res.status(200).json({ 
            message: "Product removed from wishlist successfully",
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

async function getWishlist(req, res){
    try {
        const userId = req.userId;
        
        const user = await User.findById(userId).populate('wishlist');
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({ 
            wishlist: user.wishlist 
        });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return res.status(500).json({ message: "Server error" });
    }
}


module.exports = { createProduct, getAllProducts, fetchProduct, addProductToWishlist, removeFromWishlist, getWishlist };