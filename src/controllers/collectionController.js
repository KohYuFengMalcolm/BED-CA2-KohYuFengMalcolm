const model = require("../models/collectionModel.js");

module.exports.readAllCollection = (req, res, next) => {
    const userId = req.params.user_id;  // Get user_id from route parameter
    
    const callback = (error, results, fields) => {
        if (error) {
            console.error('Error fetching collection:', error);
            return res.status(500).json({ error: "Error fetching collection" });
        }
        res.status(200).json(results);
    }

    model.selectAll(userId, callback);
}

module.exports.readAllCards = (req, res, next) => {
    const callback = (error, results, fields) => {
        res.status(200).json(results);
    }

    model.selectAllcards(callback);
}