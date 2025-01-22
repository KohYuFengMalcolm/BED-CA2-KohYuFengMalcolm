const model = require("../models/userModel.js");

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