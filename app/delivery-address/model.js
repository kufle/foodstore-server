const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const deliveryAddressSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name address required'],
        maxlength: [255, 'Maximum character 255 length'],
    },
    village: {
        type: String,
        required: [true, 'Village required'],
        maxlength: [255, 'Maximum character 255 length'],
    },
    district: {
        type: String,
        required: [true, 'District required'],
        maxlength: [255, 'Maximum character 255 length'],
    },
    regency: {
        type: String,
        required: [true, 'Regency required'],
        maxlength: [255, 'Maximum character 255 length'],
    },
    province: {
        type: String,
        required: [true, 'Province required'],
        maxlength: [255, 'Maximum character 255 length'],
    },
    detail: {
        type: String,
        required: [true, 'Detail address required'],
        maxlength: [1000, 'Maximum character 1000 length'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = model('DeliveryAddress', deliveryAddressSchema);