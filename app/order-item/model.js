const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const OrderItemSchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Food name minimum 3 character length'],
        required: [true, 'Name must be filled']
    },
    price: {
        type: Number,
        required: [true, 'Price must be filled']
    },
    qty: {
        type: Number,
        required: [true, 'Qty must be filled'],
        min: [1, 'Minimum qty 1']
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
});

module.exports = model('OrderItem', OrderItemSchema);