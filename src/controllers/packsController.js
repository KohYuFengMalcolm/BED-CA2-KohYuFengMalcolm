const pool = require('../services/db'); 
const model = require('../models/packsModel');

exports.openPack = (req, res) => {
    const { pack_id } = req.params;

    pool.query('SELECT * FROM user_packs WHERE user_pack_id = ?', [pack_id], (err, results) => {
        const pack = results[0];
        if (!pack) return res.status(404).json({ message: "Pack not found" }); // 404 if no pack found
        if (pack.is_opened) return res.status(400).json({ message: "Pack already opened" }); // 400 if already opened

        model.generatePackContents((error, cards) => {
            pool.query(
                'UPDATE user_packs SET is_opened = true WHERE user_pack_id = ?',
                [pack_id],
                () => {
                    model.insertCardsToUserCards(pack.user_id, cards, pack_id, () => {
                        res.json({
                            message: "Pack opened successfully",
                            cards: cards, 
                        });
                    });
                }
            );
        });
    });
};


exports.purchasePack = (req, res) => {
    const { user_id, pack_type_id } = req.body;

    model.getPackType(pack_type_id, (error, packResults) => {
        if (packResults.length === 0) {
            return res.status(404).json({ message: "Pack type not found or unavailable" });
        }

        const packType = packResults[0];

        model.getUserById(user_id, (error, userResults) => {
            if (userResults.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }

            const user = userResults[0];
            if (user.skillpoints < packType.price) {
                return res.status(400).json({ message: "Insufficient skill points" });
            }

            model.deductSkillPoints(user_id, packType.price, (error) => {
                model.createUserPack(user_id, pack_type_id, (error, insertResults) => {
                    res.json({
                        message: "Pack purchased successfully",
                        user_pack_id: insertResults.insertId,
                    });
                });
            });
        });
    });
};

exports.getUserPacks = (req, res) => {
    const { user_id } = req.params;

    pool.query(
        `SELECT up.user_pack_id, pt.name AS pack_name, up.is_opened 
         FROM user_packs up
         JOIN pack_types pt ON up.pack_type_id = pt.pack_type_id
         WHERE up.user_id = ?`,
        [user_id],
        (err, results) => {
            if (results.length === 0) return res.status(404).json({ message: "No packs found" });

            res.json({ packs: results });
        }
    );
};
