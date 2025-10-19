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
      enum: ['credit_card', 'debit_card', 'upi', 'wallet', 'cod'],
      required: true
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  },

  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  discount: Number,
  totalAmount: Number,

  orderStatus: {
    type: String,
    enum: ['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },

  statusUpdates: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }],

  deliveryExpected: Date,
  cancelReason: String
}, { timestamps: true });