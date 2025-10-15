const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
    },
    image: {
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    tags: {
        type: [String], 
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;