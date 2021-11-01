const DeliveryAddress = require('./model');
const { policyFor } = require('../policy');

async function store(req, res, next){
    let policy = policyFor(req.user);
    if(!policy.can('create', 'DeliveryAddress')){
        return res.json({
            error: 1,
            message: `You're not allowed to perform this action`
        });
    }

    try {
        let payload = req.body;
        let user = req.user;
    } catch (err) {
        if(err && err.name === 'ValidationError'){
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
    store
}