const userModel = require("../models/userModel.js");

module.exports.createNewUser = (req, res, next) => {
    if (!req.body.username) {
        return res.status(400).send("Request body is missing username");
    }

    const data = {
        username: req.body.username
    }

    const callback = (error, results, fields) => {
    if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).send("Provided username is already associated with another user");
        }
    } else {
        const responseBody = {
            user_id: results.insertId, 
            username: req.body.username, 
            skillpoints: 0
        };

        res.status(201).json(responseBody); 
    }
};

    model.insertSingle(data, callback);
}

module.exports.readAllUser = (req, res, next) => {
    const callback = (error, results, fields) => {
        res.status(200).json(results);
    }

    model.selectAll(callback);
}

module.exports.updateUserById = (req, res, next) => {
    const data = {
        user_id: req.params.user_id,
        username: req.body.username,
        skillpoints: req.body.skillpoints,
    };

    const callback = (error, results, fields) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).send("Provided username is already associated with another user");
            }
        } 
        
        if (results.affectedRows === 0) {
            return res.status(404).send("User id not found");
        }

        res.status(200).json({
            user_id: data.user_id,
            username: data.username,
            skillpoints: data.skillpoints,
        });
    };

    model.updateById(data, callback);
};

//////////////////////////////////////////////////////
// CONTROLLER FOR LOGIN
//////////////////////////////////////////////////////
const jwt = require("jsonwebtoken"); // Ensure JWT is required
const secretKey = "aiufhybdieoruwvfhnzdopw"; // Replace with your actual secret key

module.exports.login = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    userModel.getUserByUsername(username, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        const user = result[0];
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.locals.hash = user.password;
        res.locals.userId = user.id;
        res.locals.username = user.username;  

        // ✅ Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: "1h" });

        // ✅ Return both token & user_id
        return res.json({
            token: token,
            id: user.id
        });
    });
};

//////////////////////////////////////////////////////
// CONTROLLER FOR REGISTER
//////////////////////////////////////////////////////
module.exports.register = (req, res, next) => {
    const { username, email, password } = req.body;

    userModel.insertUser(
        [username, email, res.locals.hash],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.locals.userId = result.insertId;
            res.locals.username = username;  // Store username for token generation
            res.locals.message = `User ${username} created successfully.`;
            next();
        }
    );
};


//////////////////////////////////////////////////////
// MIDDLEWARE FOR CHECK IF USERNAME OR EMAIL EXISTS
//////////////////////////////////////////////////////
module.exports.checkUsernameOrEmailExist = (req, res, next) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({
            message: "Username and email are required"
        });
    }

    userModel.checkUsernameOrEmail(username, email, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }

        next();
    });
};


//////////////////////////////////////////////////////
// MIDDLEWARE FOR CHECK IF PLAYER BELONGS TO USER
//////////////////////////////////////////////////////
module.exports.checkPlayerBelongsToUser = (req, res, next) => {
    const userId = res.locals.userId;
    const playerId = req.params.playerId || req.body.playerId;

    if (!playerId) {
        return res.status(400).json({
            message: "Player ID is required"
        });
    }

    userModel.getPlayer(userId, playerId, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        if (!result || result.length === 0) {
            return res.status(403).json({
                message: "Player does not belong to user"
            });
        }

        next();
    });
};

