const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const mongoose = require('mongoose');

async function createOrder(req, res) {
    const userId = req.userId;
    const { shippingAddress, paymentInfo } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        
        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            image: item.product.image,
            price: item.price,
            quantity: item.quantity
        }));

        const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08; 
        const shippingCost = subtotal > 100 ? 0 : 10; 
        const totalAmount = subtotal + tax + shippingCost;

        const newOrder = new Order({
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentInfo,
            subtotal,
            tax,
            shippingCost,
            discount: 0, 
            totalAmount,
            statusUpdates: [{
                status: 'processing',
                note: 'Order received'
            }]
        });

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        newOrder.deliveryExpected = deliveryDate;

        await newOrder.save();

        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: newOrder
        });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({
            message: "Failed to create order",
            error: error.message
        });
    }
}

async function getUserOrders(req, res) {
    const userId = req.userId;

    try {
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('items.product', 'name price image');

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error("Get user orders error:", error);
        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message
        });
    }
}


async function getOrderById(req, res) {
    const { id } = req.params;
    const userId = req.userId;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID format" });
        }

        const order = await Order.findById(id)
            .populate('items.product', 'name price image description');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You don't have permission to view this order" });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Get order error:", error);
        res.status(500).json({
            message: "Failed to fetch order details",
            error: error.message
        });
    }
}


async function cancelOrder(req, res) {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.userId;
    

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid order ID format" });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You don't have permission to cancel this order" });
        }

        if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
            return res.status(400).json({
                message: `Order cannot be cancelled as it is already ${order.orderStatus}`
            });
        }

        order.orderStatus = 'cancelled';
        order.cancelReason = reason || 'No reason provided';

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        });
    } catch (error) {
        console.error("Cancel order error:", error);
        res.status(500).json({
            message: "Failed to cancel order",
            error: error.message
        });
    }
}


async function getUserOrderStats(req, res) {
    const userId = req.userId;

    try {
        const totalOrders = await Order.countDocuments({ user: userId });

        const totalAmountResult = await Order.aggregate([
            { $match: { user: mongoose.Types.ObjectId.createFromHexString(userId.toString()) } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const totalAmount = totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;

        const ordersByStatus = await Order.aggregate([
            { $match: { user: mongoose.Types.ObjectId.createFromHexString(userId.toString()) } },
            { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
        ]);

        const statusCounts = {};
        ordersByStatus.forEach(item => {
            statusCounts[item._id] = item.count;
        });

        res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                totalAmount,
                ordersByStatus: statusCounts
            }
        });
    } catch (error) {
        console.error("Order stats error:", error);
        res.status(500).json({
            message: "Failed to fetch order statistics",
            error: error.message
        });
    }
}

module.exports = { createOrder, getUserOrders, getOrderById, cancelOrder, getUserOrderStats };
