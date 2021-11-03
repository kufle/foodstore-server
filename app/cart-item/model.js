const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const cartItemSchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Minimum 3 character length'],
        required: [true, 'name must be filled']
    },
    qty: {
        type: Number,
        required: [true, 'qty must be filled'],
        min: [1, 'minimum 1 qty'] 
    },
    price: {
        type: Number,
        default: 0
    },
    image_url: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
});

module.exports = model('CartItem', cartItemSchema);