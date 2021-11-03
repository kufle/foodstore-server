const router = require('express').Router();

const invoiceController = require('../invoice/controller');

router.get('/invoices/:order_id', invoiceController.show);

module.exports = router;