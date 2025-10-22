const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      }],
    totalAmount: {
      type: Number,
      default: 0,
    },
    couponApplied: {
      code: String,
      discountAmount: Number,
    }
  }, { timestamps: true });

cartSchema.methods.calculateTotal = function(){
  this.totalAmount = this.items.reduce((total, item) => 
    total + (item.price * item.quantity), 0);
  
  if (this.couponApplied && this.couponApplied.discountAmount) {
    this.totalAmount -= this.couponApplied.discountAmount;
    if (this.totalAmount < 0) this.totalAmount = 0;
  }
  
  return this.totalAmount;
};

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
