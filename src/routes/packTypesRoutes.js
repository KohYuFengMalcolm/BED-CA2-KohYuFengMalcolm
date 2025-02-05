const express = require('express');
const router = express.Router();
const controller = require('../controllers/packTypesController');
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// Add JWT verification middleware to all pack-types routes
router.use(jwtMiddleware.verifyToken);

router.get('/', controller.getAllPackTypes);
router.get('/:id', controller.getPackTypeById);

module.exports = router;