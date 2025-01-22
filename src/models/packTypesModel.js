const pool = require('../services/db');

exports.getAllPackTypes = (callback) => {
    pool.query('SELECT * FROM pack_types WHERE is_available = true', callback);
};

exports.getPackTypeById = (id, callback) => {
    pool.query('SELECT * FROM pack_types WHERE pack_type_id = ?', [id], callback);
};

exports.getPackTypePrice = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT price FROM pack_types WHERE pack_type_id = ?', [id], 
            (error, results) => {
                if (error) reject(error);
                resolve(results[0]);
            });
    });
};

exports.createPackType = (packData, callback) => {
    const query = `
        INSERT INTO pack_types 
        (name, description, price, rarity_weights, guaranteed_rarity, is_available) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
        packData.name,
        packData.description || null,
        packData.price,
        packData.rarity_weights,
        packData.guaranteed_rarity || null,
        packData.is_available !== undefined ? packData.is_available : true
    ];

    pool.query(query, values, callback);
};