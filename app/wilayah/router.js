const router = require('express').Router();

const controller = require('./controller');

router.get('/region/provinces',controller.getProvinces);
router.get('/region/regencies', controller.getRegencies);
router.get('/region/districts', controller.getDistricts);
router.get('/region/villages', controller.getVillages);

module.exports = router;