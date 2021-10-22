const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const productSchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Product name minimum 3 character'],
        maxlength: [255, 'Product name maximum 255 character'],
        required: [true, 'Product name required']
    },
    description: {
        type: String,
        maxlength: [1000, 'Description length maximum 1000 character']
    },
    price: {
        type: Number,
        default: 0
    },
    image_url: String
}, {timestamps: true});

module.exports = model('Product', productSchema);