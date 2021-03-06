const fs = require('fs');
const path = require('path');

const Product = require('./model');
const Category = require('../category/model');
const Tag = require('../tag/model');
const config = require('../config');
const { policyFor } = require('../policy');

//Request method GET
async function index(req, res, next){
    try {
        let { limit = 10 ,skip = 0, q='', category='', tags=[] } = req.query;
        let criteria = {};
        if(q.length){
            criteria = {
                ...criteria,
                name: {$regex: `${q}`, $options: 'i'}
            }
        }
        if(category.length){
            category = await Category.findOne({name: {$regex: `${category}`, $options: 'i'}});
            if(category){
                criteria = {...criteria, category: category._id};
            }
        }
        if(tags.length){
            tags = await Tag.find({name: {$in: tags}});
            criteria = {...criteria, tags: {$in: tags.map(tag => tag._id)}};
        }
        
        let count = await Product.find(criteria).countDocuments();

        let products = 
            await Product
                .find(criteria)
                .populate('category')
                .populate('tags')
                .limit(parseInt(limit))
                .skip(parseInt(skip));

        return res.json({data: products, count});
    } catch (err) {
        next(err);
    }
}


//Request method POST
async function store(req, res, next){
    try{
        let policy = policyFor(req.user);
        if(!policy.can('create', 'Product')){
            return res.json({
                error: 1,
                message: 'You do not have access to create product'
            });
        }

        let payload = req.body;
        if(payload.category){
            let category = await Category.findOne({name: {$regex: payload.category, $options: 'i'}});

            if(category){
                payload = {...payload, category: category._id};
            }else{
                delete payload.category;
            }
        }

        if(payload.tags && payload.tags.length){
            let tags = await Tag.find({name: {$in: payload.tags}});

            if(tags.length){
                payload = {...payload, tags: tags.map( tag => tag._id)};
            }
        }
        if(req.file){
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename+ '.' +originalExt;
            let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async() => {
                try {
                    let product = new Product({...payload, image_url: filename});
                    await product.save();
                    return res.json(product);
                } catch (err) {
                    //jika error hapus file yang sudah terupload pada direktori
                    fs.unlinkSync(target_path);
                    //cek apakah error disebabkan validasi mongoDB
                    if(err && err.name === 'ValidationError'){
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        });
                    }

                    next(err);
                }
            });

            src.on('error', async() => {
                next(err);
            });
        }else{
            //buat product baru menggunakan data dari payload
            let product = new Product(payload);
            //simpan product yang baru dibuat ke mongoDB
            await product.save();
            //berikan response kepada client dengan mengembalikan product yang dibuat
            return res.json(product);
        }
    }catch(err){
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

//Request method PUT
async function update(req, res, next){
    try{
        
        let policy = policyFor(req.user);
        if(!policy.can('update', 'Product')){
            return res.json({
                error: 1,
                message: 'You do not have access to update product'
            });
        }

        let payload = req.body;
        if(payload.category){
            let category = await Category.findOne({name: {$regex: payload.category, $options: 'i'}});
            if(category){
                payload = {...payload, category: category._id};
            }else{
                delete payload.category;
            }
        }

        if(payload.tags && payload.tags.length){
            let tags = await Tag.find({
                name: {$in: payload.tags}
            });

            if(tags.length){
                payload = {...payload, tags: tags.map(tag => tag._id)};
            }
        }
        
        if(req.file){
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename+ '.' +originalExt;
            let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);

            const src = fs.createReadStream(tmp_path);
            const dest = fs.createWriteStream(target_path);
            src.pipe(dest);

            src.on('end', async() => {
                try {
                    let product = await Product.findOne({_id: req.params.id})
                    //lokasi gambar lama
                    let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;
                    //cek apakah benar file nya ada
                    if(fs.existsSync(currentImage)){
                        //hapus jika ada
                        fs.unlinkSync(currentImage);
                    }

                    product = await Product.findOneAndUpdate({_id: req.params.id}, {...payload, image_url: filename}, {new: true, runValidators: true});
                    return res.json(product);
                } catch (err) {
                    //jika error hapus file yang sudah terupload pada direktori
                    fs.unlinkSync(target_path);
                    //cek apakah error disebabkan validasi mongoDB
                    if(err && err.name === 'ValidationError'){
                        return res.json({
                            error: 1,
                            message: err.message,
                            fields: err.errors
                        });
                    }

                    next(err);
                }
            });

            src.on('error', async() => {
                next(err);
            });
        }else{
            //buat product baru menggunakan data dari payload
            let product = await Product.findOneAndUpdate({_id: req.params.id}, payload, {new: true, runValidators: true});
            //simpan product yang baru dibuat ke mongoDB
            await product.save();
            //berikan response kepada client dengan mengembalikan product yang dibuat
            return res.json(product);
        }
    }catch(err){
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


async function destroy(req, res, next){
    try {
        let policy = policyFor(req.user);
        if(!policy.can('delete', 'Product')){
            return res.json({
                error: 1,
                message: 'You do not have access to delete product'
            });
        }

        let product = await Product.findOne({_id: req.params.id})

        let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;
        if(fs.existsSync(currentImage)){
            fs.unlinkSync(currentImage);
        }

        product = await Product.findOneAndDelete({_id: req.params.id});

        return res.json(product);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    index,
    store,
    update,
    destroy
}