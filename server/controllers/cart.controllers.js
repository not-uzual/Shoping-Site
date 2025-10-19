const User = require('../models/user.model')
const Product = require('../models/product.model')
const Cart = require('../models/cart.model')

async function addToCart(req, res) {
    try {
        const userId = req.userId;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [],
                totalAmount: 0
            });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += Number(quantity);
        } else {
            cart.items.push({
                product: productId,
                quantity: Number(quantity),
                price: product.price
            });
        }

        cart.calculateTotal();

        await cart.save();
        
        return res.status(200).json({ 
            message: "Product added to cart successfully",
            cart
        });
    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({ message: "Failed to add product to cart" });
    }
}


async function getCart(req, res) {
    try {
        const userId = req.userId;
        
        const cart = await Cart.findOne({ user: userId })
            .populate('items.product', 'name price image description');
        
        if (!cart) {
            return res.status(200).json({ 
                message: "Cart is empty", 
                cart: { items: [], totalAmount: 0 } 
            });
        }
        
        return res.status(200).json({ cart });
    } catch (error) {
        console.error("Get cart error:", error);
        return res.status(500).json({ message: "Failed to retrieve cart" });
    }
}

async function updateQuantity(req, res) {
    try {
        const userId = req.userId;
        const { productId } = req.params;
        const { quantity } = req.body;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Valid quantity is required" });
        }
        
        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        
        cart.items[itemIndex].quantity = Number(quantity);
        
        cart.calculateTotal();
        
        await cart.save();
        
        return res.status(200).json({
            message: "Cart updated successfully",
            cart
        });
    } catch (error) {
        console.error("Update cart error:", error);
        return res.status(500).json({ message: "Failed to update cart" });
    }
}


async function removeFromCart(req, res) {
    try {
        const userId = req.userId;
        const { productId } = req.params;
        
        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        
        cart.items.splice(itemIndex, 1);

        cart.calculateTotal();
        
        if (cart.items.length === 0) {
            await Cart.findByIdAndDelete(cart._id);
            return res.status(200).json({ 
                message: "Product removed and cart is now empty"
            });
        } else {
            await cart.save();
            return res.status(200).json({
                message: "Product removed from cart",
                cart
            });
        }
    } catch (error) {
        console.error("Remove from cart error:", error);
        return res.status(500).json({ message: "Failed to remove product from cart" });
    }
}

module.exports = { addToCart, getCart, updateQuantity, removeFromCart }