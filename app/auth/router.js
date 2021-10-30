const router = require('express').Router();
const multer = require('multer');

const authController = require('./controller');
router.post('/register', multer().none(), authController.register);

module.exports = router;