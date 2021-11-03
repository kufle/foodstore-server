const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Invoice = require('../invoice/model');

const OrderSchema = Schema({
    status: {
        type: String,
        enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
        default: 'waiting_payment'
    },
    delivery_fee: {
        type: Number,
        default: 0
    },
    delivery_address: {
        province: {
            type: String,
            required: [true, 'Province must be filled']
        },
        regency: {
            type: String,
            required: [true, 'Regency must be filled']
        },
        district: {
            type: String,
            required: [true, 'District must be filled']
        },
        village: {
            type: String,
            required: [true, 'Village must be filled']
        },
        detail: {
            type: String
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    order_items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'OrderItem'
        }
    ]
}, {timestamps: true});

//agar field order_number menjadi auto increment
OrderSchema.plugin(AutoIncrement, {inc_field: 'order_number'});

//virtual Field, jadi nanti kita bisa dapet total Qty dari semua barang yang dipesan
OrderSchema.virtual('items_count').get(function(){
    return this.order_items.reduce((total, item) => {
        return total + parseInt(item.qty);
    }, 0);
});

OrderSchema.post('save', async function(){
    let sub_total = this.order_items.reduce((sum, item) => sum += (item.price*item.qty), 0);

    let invoice = new Invoice({
        user: this.user,
        order: this._id,
        sub_total: sub_total,
        delivery_fee: parseInt(this.delivery_fee),
        total: parseInt(sub_total+this.delivery_fee),
        delivery_address: this.delivery_address
    });

    await invoice.save();
});

module.exports = model('Order', OrderSchema);