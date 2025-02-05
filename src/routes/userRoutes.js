const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/', controller.createNewUser);
router.get('/', controller.readAllUser);
router.put('/:user_id', controller.updateUserById);
router.get('/:user_id/skillpoints', controller.getUserSkillpoints);


module.exports = router;