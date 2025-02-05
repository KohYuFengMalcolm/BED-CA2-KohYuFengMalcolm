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