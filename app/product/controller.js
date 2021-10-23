const fs = require('fs');
const path = require('path');

const Product = require('./model');
const config = require('../config');

//Request type GET
async function index(req, res, next){
    try {
        let { limit = 10 ,skip = 0 } = req.query;
        let products = 
            await Product
                .find()
                .limit(parseInt(limit))
                .skip(parseInt(skip));

        return res.json(products);
    } catch (err) {
        next(err);
    }
}


//Request type POST
async function store(req, res, next){
    try{
        let payload = req.body;
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

module.exports = {
    index,
    store
}