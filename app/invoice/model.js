const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const InvoiceSchema = Schema({
    sub_total: {
        type: Number,
        required: [true, 'Sub Total must be filled']
    },
    delivery_fee: {
        type: Number,
        required: [true, 'Delivery Fee must be filled']
    },
    delivery_address: {
        province: { 
            type: String, 
            required: [true, 'Province must be filled.']
        },
        regency: { 
            type: String, 
            required: [true, 'Regency must be filled.']
        },
        district: { 
            type: String, 
            required: [true, 'District must be filled.']
        },
        village: { 
            type: String, 
            required: [true, 'Village must be filled.']
        },
        detail: {type: String}
    },
    total: {
        type: Number,
        required: [true, 'Total must be filled.']
    },
    payment_status: {
        type: String,
        enum: ['waiting_payment', 'paid'],
        default: 'waiting_payment'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
},{timestamps: true});

module.exports = model('Invoice', InvoiceSchema);