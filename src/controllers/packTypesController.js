const model = require('../models/packTypesModel');

exports.getAllPackTypes = (req, res) => {
    model.getAllPackTypes((error, results) => {
        res.json(results);
    });
};

exports.getPackTypeById = (req, res) => {
    model.getPackTypeById(req.params.id, (error, results) => {
        if (!results.length) return res.status(404).send("Pack type not found" );
        res.json(results[0]);
    });
};

exports.createPackType = (req, res) => {
    // Validate required fields
    const requiredFields = ['name', 'price', 'rarity_weights'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length) {
        return res.status(400).send("Missing required fields, please re-enter")
    }

    // Validate price is a positive number
    if (req.body.price < 0) {
        return res.status(400).send("Price must be a positive number")
    }

    model.createPackType(req.body, (error, results) => {
        res.status(201).json({
            message: 'Pack type created successfully',
            id: results.insertId
        });
    });
};