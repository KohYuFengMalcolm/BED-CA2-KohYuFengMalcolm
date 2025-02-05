const pool = require('../services/db'); 
const model = require('../models/packsModel');

exports.purchasePack = (req, res) => {
    const { user_id, pack_type_id } = req.body;

    // Validate input
    if (!user_id || !pack_type_id) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    model.getPackType(pack_type_id, (error, packResults) => {
        if (error) {
            console.error('Error fetching pack type:', error);
            return res.status(500).json({ message: "Error fetching pack type" });
        }

        if (!packResults || packResults.length === 0) {
            return res.status(404).json({ message: "Pack type not found or unavailable" });
        }

        const packType = packResults[0];

        model.getUserById(user_id, (error, userResults) => {
            if (error) {
                console.error('Error fetching user:', error);
                return res.status(500).json({ message: "Error fetching user data" });
            }

            if (!userResults || userResults.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const user = userResults[0];
            if (user.skillpoints < packType.price) {
                return res.status(400).json({ message: "Insufficient skill points" });
            }

            model.deductSkillPoints(user_id, packType.price, (error) => {
                if (error) {
                    console.error('Error deducting skill points:', error);
                    return res.status(500).json({ message: "Error processing purchase" });
                }

                model.createUserPack(user_id, pack_type_id, (error, insertResults) => {
                    if (error) {
                        console.error('Error creating user pack:', error);
                        return res.status(500).json({ message: "Error creating pack" });
                    }

                    res.json({
                        message: "Pack purchased successfully",
                        user_pack_id: insertResults.insertId,
                    });
                });
            });
        });
    });
};

exports.openPack = (req, res) => {
    const { pack_id } = req.params;

    pool.query('SELECT * FROM user_packs WHERE user_pack_id = ?', [pack_id], (err, results) => {
        if (err) {
            console.error('Error fetching pack:', err);
            return res.status(500).json({ error: "Error fetching pack" });
        }

        if (!results || !results.length) {
            return res.status(404).json({ message: "Pack not found" });
        }

        const pack = results[0];
        if (pack.is_opened) {
            return res.status(400).json({ message: "Pack already opened" });
        }

        model.generatePackContents(pack.pack_type_id, (error, cards) => {
            if (error) {
                console.error('Error generating cards:', error);
                return res.status(500).json({ error: "Error generating cards" });
            }

            if (!cards || cards.length !== 5) {
                console.error('Invalid card count:', cards ? cards.length : 0);
                return res.status(500).json({ error: "Error generating correct number of cards" });
            }

            // Begin transaction
            pool.getConnection((connErr, connection) => {
                if (connErr) {
                    console.error('Connection error:', connErr);
                    return res.status(500).json({ error: "Database connection error" });
                }

                connection.beginTransaction(err => {
                    if (err) {
                        connection.release();
                        return res.status(500).json({ error: "Transaction error" });
                    }

                    connection.query(
                        'UPDATE user_packs SET is_opened = true WHERE user_pack_id = ?',
                        [pack_id],
                        (updateErr) => {
                            if (updateErr) {
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ error: "Error updating pack status" });
                                });
                            }

                            model.insertCardsToUserCards(pack.user_id, cards, pack_id, (insertErr) => {
                                if (insertErr) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        res.status(500).json({ error: "Error inserting cards" });
                                    });
                                }

                                connection.commit(err => {
                                    connection.release();
                                    if (err) {
                                        return res.status(500).json({ error: "Error completing transaction" });
                                    }
                                    res.json({
                                        message: "Pack opened successfully",
                                        cards: cards
                                    });
                                });
                            });
                        }
                    );
                });
            });
        });
    });
};

exports.getUserPacks = (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ message: "User ID is required" });
    }

    pool.query(
        `SELECT up.user_pack_id, pt.name AS pack_name, up.is_opened 
         FROM user_packs up
         JOIN pack_types pt ON up.pack_type_id = pt.pack_type_id
         WHERE up.user_id = ?`,
        [user_id],
        (err, results) => {
            if (err) {
                console.error('Error fetching user packs:', err);
                return res.status(500).json({ message: "Error fetching packs" });
            }

            res.json({ packs: results || [] });
        }
    );
};