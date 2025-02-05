const express = require('express');
const router = express.Router();
const controller = require('../controllers/challengeController');

router.post('/', controller.createNewChallenge);
router.get('/', controller.readAllChallenge);
router.put('/:challenge_id', controller.updateChallengeById);
router.delete('/:challenge_id', controller.deleteChallengeById);

router.post('/:challenge_id', controller.createNewCompletionRecordById);
router.get('/:challenge_id', controller.readChallengeById);
router.get("/users/:user_id/skillpoints", controller.getUserSkillpoints);
router.put('/users/:user_id/skillpoints', controller.updateSkillpoints);

module.exports = router;