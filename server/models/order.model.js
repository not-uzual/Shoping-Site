const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['upi', 'cod'],
      required: true
    },
    transactionId: String,
  },
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  discount: Number,
  totalAmount: Number,
  orderStatus: {
    type: String,
    enum: ['processing', 'delivered', 'cancelled'],
    default: 'processing'
  },
  deliveryExpected: Date,
  cancelReason: String
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema)
module.exports = Order
