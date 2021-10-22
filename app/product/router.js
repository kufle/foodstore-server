//import router dari express router
const router = require('express').Router();
//import product controller
const productController = require('./controller');
//pasangkan route endpoint dengan method store
router.post('/products', productController.store);

module.exports = router;