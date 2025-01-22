const express = require('express');
const router = express.Router();
const controller = require('../controllers/packTypesController');

router.get('/', controller.getAllPackTypes);
router.get('/:id', controller.getPackTypeById);
router.post('/', controller.createPackType);

module.exports = router;