const router = require('express').Router();
const multer = require('multer');

const deliveryController = require('./controller');

router.get('/delivery-addresses', deliveryController.index);
router.post('/delivery-addresses', multer().none(), deliveryController.store);
router.put('/delivery-addresses/:id', multer().none(), deliveryController.update);
router.delete('/delivery-addresses/:id', deliveryController.destroy);

module.exports = router;