const pool = require('../services/db');

module.exports.selectAll = (callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM user_cards;
        `;
    
    pool.query(SQLSTATMENT, callback)
}

module.exports.selectAllcards = (callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM cards;
        `;
    
    pool.query(SQLSTATMENT, callback)
}

