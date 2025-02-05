const pool = require('../services/db');

exports.generatePackContents = (packTypeId, callback) => {
    pool.query(
        'SELECT rarity_weights FROM pack_types WHERE pack_type_id = ? AND is_available = true',
        [packTypeId],
        (error, results) => {
            if (error) return callback(error);
            if (results.length === 0) return callback(new Error("Pack type not found or unavailable"));

            let rarityWeights;
            try {
                rarityWeights = JSON.parse(results[0].rarity_weights);
            } catch (parseError) {
                return callback(new Error("Invalid rarity weights format"));
            }

            // Always generate exactly 5 cards
            let selectedCards = [];
            let currentIndex = 0;

            function getNextCard() {
                if (currentIndex >= 5) {
                    // Only finish if we have exactly 5 cards
                    if (selectedCards.length === 5) {
                        return callback(null, selectedCards);
                    } else {
                        return callback(new Error(`Invalid card count: ${selectedCards.length}`));
                    }
                }

                const rarity = selectRarity(rarityWeights);
                
                pool.query(
                    'SELECT * FROM cards WHERE rarity = ? ORDER BY RAND() LIMIT 1',
                    [rarity],
                    (error, results) => {
                        if (error) return callback(error);
                        if (!results || !results.length) {
                            // Try again if no card found
                            getNextCard();
                            return;
                        }

                        selectedCards.push(results[0]);
                        currentIndex++;
                        getNextCard();
                    }
                );
            }

            // Start generating cards
            getNextCard();
        }
    );
};

const selectRarity = (weights) => {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const [rarity, weight] of Object.entries(weights)) {
        if (random < weight) return rarity;
        random -= weight;
    }
    return Object.keys(weights)[0];
};

exports.insertCardsToUserCards = (userId, cards, packId, callback) => {
    if (!cards || cards.length !== 5) {
        return callback(new Error(`Invalid number of cards: ${cards ? cards.length : 0}`));
    }

    let insertedCount = 0;
    let hasError = false;

    cards.forEach((card) => {
        pool.query(
            'INSERT INTO user_cards (user_id, card_id, player_name, position, team, rarity, overall_rating, obtained_from_pack) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                userId, 
                card.card_id,
                card.player_name,
                card.position,
                card.team,
                card.rarity,
                card.overall_rating,
                packId
            ],
            (insertErr) => {
                if (hasError) return; // Skip if we already had an error

                if (insertErr) {
                    hasError = true;
                    return callback(insertErr);
                }

                insertedCount++;
                
                // Only call callback when all 5 cards are inserted
                if (insertedCount === 5) {
                    callback(null);
                }
            }
        );
    });
};

exports.getPackType = (packTypeId, callback) => {
    pool.query(
        'SELECT * FROM pack_types WHERE pack_type_id = ? AND is_available = true',
        [packTypeId],
        callback
    );
};

exports.getUserById = (userId, callback) => {
    // Changed user_id to id to match your table schema
    pool.query(
        'SELECT skillpoints FROM user WHERE id = ?',
        [userId],
        callback
    );
};

exports.deductSkillPoints = (userId, amount, callback) => {
    // Changed user_id to id to match your table schema
    pool.query(
        'UPDATE user SET skillpoints = skillpoints - ? WHERE id = ?',
        [amount, userId],
        callback
    );
};

exports.createUserPack = (userId, packTypeId, callback) => {
    // Keep user_id here as it's the foreign key name in user_packs table
    pool.query(
        'INSERT INTO user_packs (user_id, pack_type_id) VALUES (?, ?)',
        [userId, packTypeId],
        callback
    );
};

// Additional utility functions
exports.getAllPackTypes = (callback) => {
    pool.query('SELECT * FROM pack_types WHERE is_available = true', callback);
};

exports.getPackTypeById = (id, callback) => {
    pool.query('SELECT * FROM pack_types WHERE pack_type_id = ?', [id], callback);
};