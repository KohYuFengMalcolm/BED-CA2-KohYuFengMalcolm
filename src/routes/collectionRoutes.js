const express = require('express');
const router = express.Router();
const controller = require('../controllers/collectionController');

router.get('/user/:user_id', controller.readAllCollection);
router.get('/', controller.readAllCards);

module.exports = router;
