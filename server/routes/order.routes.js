const express = require('express');

const { createOrder, getUserOrders, getOrderById, cancelOrder, getUserOrderStats } = require('../controllers/order.controllers');
const isAuth = require('../middlewares/isAuth');

const orderRouter = express.Router();

orderRouter.use(isAuth);

orderRouter.get('/', getUserOrders);
orderRouter.post('/', createOrder);
orderRouter.get('/stats', getUserOrderStats);
orderRouter.get('/:id', getOrderById);
orderRouter.put('/:id/cancel', cancelOrder);

module.exports = orderRouter;

