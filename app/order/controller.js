const mongoose = require('mongoose');
const Order = require('./model');
const OrderItem = require('../order-item/model');
const CartItem = require('../cart-item/model');
const DeliveryAddress = require('../delivery-address/model');
const { policyFor } = require('../policy');
const { subject } = require('@casl/ability');

async function index(req, res, next){
    let policy = policyFor(req.user);

    if(!policy.can('view', 'Order')){
        return res.json({
            error: 1,
            message: `You're not allowed to perform this action`
        });
    }

    try {
        let { limit = 10, skip = 0 } = req.query;
        let count = await Order.find({user: req.user._id}).countDocuments();
        let orders = await Order
                    .find({user: req.user._id})
                    .limit(parseInt(limit))
                    .skip(parseInt(skip))
                    .populate('order_items')
                    .sort('-createdAt');
        return res.json({
            data: orders.map(order => order.toJSON({virtuals: true})),
            count
        });
    } catch (error) {
        //cek tipe error
        if(err & err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

async function store(req, res, next){
    let policy = policyFor(req.user);
    if(!policy.can('create', 'Order')){
        return res.json({
            error: 1,
            message: `You're not allowed to perform this action`
        });
    }
    try {
        let { delivery_fee, delivery_address } = req.body;
        //mendaptkan items dari Cart / Keranjang
        let items = await CartItem.find({user: req.user._id}).populate('product');
        if(!items.length){
            return res.json({
                error: 1,
                message: `Can not create order because you have no items in cart`
            });
        }
        //mendapatkan alamat
        let address = await DeliveryAddress.findOne({_id: delivery_address});
        //membuat order
        let order = new Order({
            _id: new mongoose.Types.ObjectId,
            status: 'waiting_payment',
            delivery_fee,
            delivery_address: {
                province: address.province,
                regency: address.regency,
                district: address.district,
                village: address.village,
                detail: address.detail
            },
            user: req.user._id
        });
        //order detail
        let orderItems = await OrderItem.insertMany(
            items.map(item => ({
                ...item,
                name: item.product.name,
                qty: parseInt(item.qty),
                price: parseInt(item.price),
                order: order._id,
                product: item.product._id
            }))
        );
        orderItems.forEach(item => order.order_items.push(item));
        await order.save();
        //hapus seluruh item yang ada dikeranjang
        await CartItem.deleteMany({user: req.user._id});
        return res.json(order);
    } catch (err) {
        //cek tipe error
        if(err & err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

module.exports = {
    store,
    index
}