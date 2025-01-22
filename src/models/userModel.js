const pool = require('../services/db');

module.exports.insertSingle = (data, callback) =>
    {
        const SQLSTATMENT = `
        INSERT INTO User (user_id, username, skillpoints)
        VALUES (?, ?, ?);
        `;
        
    const VALUES = [data.user_id, data.username, data.skillpoints];
    
    pool.query(SQLSTATMENT, VALUES, callback);
    }

    
module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM User;
    `;

pool.query(SQLSTATMENT, callback);
    
}

module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET username = ?, skillpoints = ?
        WHERE user_id = ?;
    `;
    const VALUES = [data.username, data.skillpoints, data.user_id];

    console.log("Executing SQL:", SQLSTATEMENT, VALUES);

    pool.query(SQLSTATEMENT, VALUES, callback);
};
