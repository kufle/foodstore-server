const Category = require('./model');
const { policyFor } = require('../policy');

async function store(req, res, next){
    try {

        let policy = policyFor(req.user);
        if(!policy.can('create', 'Category')){
            return res.json({
                error: 1,
                message: 'You do not have access to create Category'
            });
        }

        let payload = req.body;
        let category = new Category(payload);
        await category.save();
        return res.json(category);
    } catch (err) {
        if(err && err.name === "ValidationError"){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

async function update(req, res, next){
    try {

        let policy = policyFor(req.user);
        if(!policy.can('update', 'Category')){
            return res.json({
                error: 1,
                message: 'You do not have access to update Category'
            });
        }

        let payload = req.body;
        let category = await Category.findOneAndUpdate({_id: req.params.id}, payload, {new: true, runValidators: true});
        return res.json(category);
    } catch (err) {
        if(err && err.name === "ValidationError"){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

async function destroy(req, res, next){
    try {
        let policy = policyFor(req.user);
        if(!policy.can('delete', 'Category')){
            return res.json({
                error: 1,
                message: 'You do not have access to delete Category'
            });
        }

        let category = await Category.findOneAndDelete({_id: req.params.id});
        res.json(category);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    store,
    update,
    destroy
}