const express = require('express');
const router = express.Router();

// Import middlewares
const jwtMiddleware = require("../middlewares/jwtMiddleware");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware");

// Import controllers
const userController = require("../controllers/userController");
const exampleController = require("../controllers/exampleController");

// Import route files
const userRoutes = require('./userRoutes');
const challengeRoutes = require('./challengeRoutes');
const packTypesRoutes = require('./packTypesRoutes');
const packsRoutes = require('./packsRoutes');
const collectionRoutes = require('./collectionRoutes');
const reviewRoutes = require('./reviewRoutes');

//reviews
router.use("/review", reviewRoutes);

// Define routes from the second file
router.post("/register", userController.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, userController.register, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
router.post("/login", userController.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);

router.post("/jwt/generate", exampleController.preTokenGenerate, jwtMiddleware.generateToken, exampleController.beforeSendToken, jwtMiddleware.sendToken);
router.get("/jwt/verify", jwtMiddleware.verifyToken, exampleController.showTokenVerified);
router.post("/bcrypt/compare", exampleController.preCompare, bcryptMiddleware.comparePassword, exampleController.showCompareSuccess);
router.post("/bcrypt/hash", bcryptMiddleware.hashPassword, exampleController.showHashing);

// Use routes from the first file
router.use("/users", userRoutes);
router.use("/challenges", challengeRoutes);
router.use("/pack-types", packTypesRoutes);
router.use("/packs", packsRoutes);
router.use("/collection", collectionRoutes);

// Export the combined router
module.exports = router;