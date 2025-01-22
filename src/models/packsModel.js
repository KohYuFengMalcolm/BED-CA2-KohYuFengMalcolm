const pool = require('../services/db');

exports.generatePackContents = (callback) => {
    pool.query(
        'SELECT * FROM cards ORDER BY RAND() LIMIT 5', 
        (error, results) => {
            if (error) return callback(error);
            callback(null, results);
        }
    );
};

exports.getPackType = (packTypeId, callback) => {
    pool.query(
        'SELECT * FROM pack_types WHERE pack_type_id = ? AND is_available = true',
        [packTypeId],
        callback
    );
};

exports.getUserById = (userId, callback) => {
    pool.query(
        'SELECT skillpoints FROM user WHERE user_id = ?',
        [userId],
        callback
    );
};

exports.deductSkillPoints = (userId, amount, callback) => {
    pool.query(
        'UPDATE user SET skillpoints = skillpoints - ? WHERE user_id = ?',
        [amount, userId],
        callback
    );
};

exports.createUserPack = (userId, packTypeId, callback) => {
    pool.query(
        'INSERT INTO user_packs (user_id, pack_type_id) VALUES (?, ?)',
        [userId, packTypeId],
        callback
    );
};

exports.insertCardsToUserCards = (userId, cards, packId, callback) => {
    let counter = 0;

    cards.forEach((card) => {
        pool.query(
            'INSERT INTO user_cards (user_id, card_id, obtained_from_pack) VALUES (?, ?, ?)',
            [userId, card.card_id, packId],
            (insertErr) => {
                if (insertErr) return callback(insertErr);

                counter++;

                if (counter === cards.length) {
                    callback(null);
                }
            }
        );
    });
};
