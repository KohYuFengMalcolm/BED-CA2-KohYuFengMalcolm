const pool = require('../services/db');

module.exports.insertSingle = (data, callback) => {
    const SQLSTATMENT = `
        INSERT INTO fitnesschallenge (creator_id, challenge, skillpoints)
        VALUES (?, ?, ?);
    `;
    const VALUES = [data.creator_id, data.challenge, data.skillpoints];
    
    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.selectAll = (callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM fitnesschallenge;
        `;
    
    pool.query(SQLSTATMENT, callback)
}

module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE fitnesschallenge 
        SET challenge = ?, skillpoints = ?
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge, data.skillpoints, data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.checkCreator = (challenge_id, callback) => {
    const SQLSTATEMENT = `
        SELECT creator_id 
        FROM fitnesschallenge 
        WHERE challenge_id = ?
    `;
    const VALUES = [challenge_id];
    
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteById = (data, callback) =>
    {
        const SQLSTATMENT = `
        DELETE FROM fitnesschallenge
        WHERE challenge_id = ?;
        `;
    const VALUES = [data.challenge_id];
    
    pool.query(SQLSTATMENT, VALUES, callback);
    }

module.exports.insertSingle2 = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO UserCompletion (challenge_id, user_id, completed, creation_date, notes)
        VALUES (?, ?, ?, ?, ?);
    `;
    const VALUES = [
        data.challenge_id,
        data.user_id,
        data.completed,
        data.creation_date,
        data.notes,
    ];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.validateIds = (userId, challengeId, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            (SELECT COUNT(*) FROM User WHERE user_id = ?) as userExists,
            (SELECT COUNT(*) FROM FitnessChallenge WHERE challenge_id = ?) as challengeExists;
    `;
    pool.query(SQLSTATEMENT, [userId, challengeId], (error, results) => {
        if (error) return callback(error);

        const valid = results[0].userExists > 0 && results[0].challengeExists > 0;
        callback(null, valid);
    });
};

module.exports.getChallengeSkillpoints = (challengeId, callback) => {
    const SQLSTATEMENT = "SELECT skillpoints FROM FitnessChallenge WHERE challenge_id = ?";
    pool.query(SQLSTATEMENT, [challengeId], (error, results) => {
        if (error) return callback(error);

        const skillpoints = results.length > 0 ? results[0].skillpoints : 0;
        callback(null, skillpoints);
    });
};

module.exports.updateUserSkillpoints = (userId, skillpoints, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET skillpoints = skillpoints + ?
        WHERE user_id = ?;
    `;
    pool.query(SQLSTATEMENT, [skillpoints, userId], callback);
};

module.exports.selectById = (data, callback) =>
    {
        const SQLSTATMENT = `
        SELECT * FROM usercompletion
        WHERE challenge_id = ?;
        `;
    const VALUES = [data.challenge_id];
    
    pool.query(SQLSTATMENT, VALUES, callback);
    }