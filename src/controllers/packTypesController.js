const model = require('../models/packTypesModel');

exports.getAllPackTypes = (req, res) => {
    model.getAllPackTypes((error, results) => {
        if (error) {
            console.error('Error fetching pack types:', error);
            return res.status(500).json({ message: 'Error fetching pack types' });
        }
        
        if (!results || !Array.isArray(results)) {
            return res.status(500).json({ message: 'Invalid pack types data' });
        }
        
        res.json(results);
    });
};

exports.getPackTypeById = (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Pack type ID is required' });
    }

    model.getPackTypeById(req.params.id, (error, results) => {
        if (error) {
            console.error('Error fetching pack type:', error);
            return res.status(500).json({ message: 'Error fetching pack type' });
        }
        
        if (!results || !results.length) {
            return res.status(404).json({ message: 'Pack type not found' });
        }
        
        res.json(results[0]);
    });
};