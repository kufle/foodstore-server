const os = require('os');
//import router dari express router
const router = require('express').Router();
//import multer agar bisa request melalui form/data
const multer = require('multer');
//import product controller
const productController = require('./controller');

//menampilkan daftar product
//pasangkan route endpoint dengan function index
router.get('/products', productController.index);
//Membuat Product baru
//pasangkan route endpoint dengan method store
router.post('/products', multer({dest: os.tmpdir()}).single('image'),productController.store);
//mengupdate product
//pasangkan route endpoint dengan method update
router.put('/products/:id', multer({dest: os.tmpdir()}).single('image'), productController.update);
//delete product
//pasangkan route endpoint dengan method destroy
router.delete('/products/:id',productController.destroy);

module.exports = router;