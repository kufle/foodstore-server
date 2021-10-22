const Product = require('./model');

async function store(req, res, next){
    let payload = req.body;
    //buat product baru menggunakan data dari payload
    let product = new Product(payload);
    //simpan product yang baru dibuat ke mongoDB
    await product.save();
    //berikan response kepada client dengan mengembalikan product yang dibuat
    return res.json(product);
}

module.exports = {
    store
}