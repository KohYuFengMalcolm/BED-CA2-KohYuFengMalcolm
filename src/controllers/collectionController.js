const model = require("../models/collectionModel.js");

module.exports.readAllCollection = (req, res, next) => {
    const callback = (error, results, fields) => {
        res.status(200).json(results);
    }

    model.selectAll(callback);
}

module.exports.readAllCards = (req, res, next) => {
    const callback = (error, results, fields) => {
        res.status(200).json(results);
    }

    model.selectAllcards(callback);
}