const pool = require('../services/db');

module.exports.selectAll = (userId, callback) => {
    const SQLSTATMENT = `
    SELECT * FROM user_cards 
    WHERE user_id = ?;
    `;

    pool.query(SQLSTATMENT, [userId], callback);
}
module.exports.selectAllcards = (callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM cards;
        `;
    
    pool.query(SQLSTATMENT, callback)
}

