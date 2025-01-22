const express = require('express');
const router = express.Router();
const controller = require('../controllers/packsController');

router.post('/purchase', controller.purchasePack);
router.get('/user/:user_id', controller.getUserPacks);
router.post('/:pack_id/open', controller.openPack);

module.exports = router;