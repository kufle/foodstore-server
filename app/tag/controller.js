const Tag = require('./model');

async function store(req, res, next){
    try {
        let policy = policyFor(req.user);
        if(!policy.can('create', 'Tag')){
            return res.json({
                error: 1,
                message: 'You do not have access to create tag'
            });
        }

        let payload = req.body;
        let tag = new Tag(payload);
        await tag.save();

        res.json(tag);
    }catch(err){
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

async function update(req, res, next){
    try {
        let policy = policyFor(req.user);
        if(!policy.can('update', 'Tag')){
            return res.json({
                error: 1,
                message: 'You do not have access to update tag'
            });
        }
        let payload = req.body;
        let tag = await Tag.findOneAndUpdate({_id: req.params.id}, payload, {new:true , runValidators:true});

        res.json(tag);
    }catch(err){
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

async function destroy(req, res, next){
    try {
        let policy = policyFor(req.user);
        if(!policy.can('delete', 'Tag')){
            return res.json({
                error: 1,
                message: 'You do not have access to delete tag'
            });
        }
        let tag = await Tag.findOneAndDelete({_id: req.params.id});

        res.json(tag);
    }catch(err){
        next(err);
    }
}

module.exports = {
    store,
    update,
    destroy
}