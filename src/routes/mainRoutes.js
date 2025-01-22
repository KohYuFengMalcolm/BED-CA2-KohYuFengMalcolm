const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
router.use("/users", userRoutes);

const challengeRoutes = require('./challengeRoutes');
router.use("/challenges", challengeRoutes);

const packTypesRoutes = require('./packTypesRoutes');
router.use("/pack-types", packTypesRoutes);

const packsRoutes = require('./packsRoutes');
router.use("/packs", packsRoutes);

const collectionRoutes = require('./collectionRoutes');
router.use("/collection", collectionRoutes);

module.exports = router;