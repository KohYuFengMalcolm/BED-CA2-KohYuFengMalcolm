const model = require("../models/challengeModel.js");
const pool = require('../services/db');

module.exports.createNewChallenge = (req, res, next) => {
    if(!req.body.challenge || !req.body.user_id || !req.body.skillpoints) {
        res.status(400).send("Request body is missing challenge and/or user_id and/or skillpoints");
        return;
    }

    const data = {
        creator_id: req.body.user_id,
        challenge: req.body.challenge,
        skillpoints: req.body.skillpoints
    }

    const callback = (error, results, fields) => {

        const responseBody = {
            challenge_id: results.insertId, 
            challenge: req.body.challenge,   
            creator_id: req.body.user_id,
            skillpoints: req.body.skillpoints
        };

        res.status(201).json(responseBody);
    }

    model.insertSingle(data, callback);
}

module.exports.readAllChallenge = (req, res, next) => {
    const callback = (error, results, fields) => {
        res.status(200).json(results);
    }

    model.selectAll(callback);
}

module.exports.updateChallengeById = (req, res, next) => {
    if(!req.body.challenge || !req.body.user_id || !req.body.skillpoints) {
        return res.status(400).send("Request body is missing challenge and/or user_id and/or skillpoints");
    }

    const data = {
        challenge_id: req.params.challenge_id,
        challenge: req.body.challenge,
        user_id: req.body.user_id,
        skillpoints: req.body.skillpoints
    };

    model.checkCreator(data.challenge_id, (error, results) => {
        if (results.length === 0) {
            return res.status(404).send("Requested challenge_id does not exist");
        }

        // Remove the creator_id check and proceed directly to update
        model.updateById(data, (error, updateResults) => {
            if (updateResults.affectedRows === 0) {
                return res.status(404).send("Requested challenge_id does not exist");
            }

            res.status(200).json({
                challenge_id: parseInt(data.challenge_id),
                challenge: data.challenge,
                creator_id: results[0].creator_id, // Keep original creator_id
                skillpoints: data.skillpoints
            });
        });
    });
};

module.exports.deleteChallengeById = (req, res, next) =>
    {
        const data = {
            challenge_id: req.params.challenge_id
        }
    
        const callback = (error, results, fields) => {
                if(results.affectedRows == 0){
                    res.status(404).send("Requested challenge_id does not exist")
                }
                else res.status(204).send();          
            
        }
    
        model.deleteById(data, callback);
    }


    module.exports.createNewCompletionRecordById = (req, res, next) => {
        const challenge_id = parseInt(req.params.challenge_id, 10);
    
        if (!req.body.user_id) {
            return res.status(400).send("Bad Request: user_id is required");
        }
    
        const data = {
            challenge_id: challenge_id,
            user_id: req.body.user_id,
            completed: req.body.completed || false,
            creation_date: req.body.creation_date || new Date().toISOString().split("T")[0],
            notes: req.body.notes || "",
        };
    
        model.validateIds(data.user_id, data.challenge_id, (error, valid) => {
            if (error) return next(error);
    
            if (!valid) {
                return res.status(404).send("Not Found: user_id or challenge_id does not exist");
            }
    
            model.getChallengeSkillpoints(data.challenge_id, (error, skillpoints) => {
                if (error) return next(error);
    
                const pointsToAward = data.completed ? skillpoints : 5;
    
                model.insertSingle2(data, (error, results) => {
                    if (error) return next(error);
    
                    model.updateUserSkillpoints(data.user_id, pointsToAward, (error) => {
                        if (error) return next(error);
    
                        // ✅ Fetch updated skillpoints
                        model.getSkillpoints(data.user_id, (error, updatedSkillpoints) => {
                            if (error) return next(error);
    
                            const responseBody = {
                                complete_id: results.insertId,
                                challenge_id: data.challenge_id,
                                user_id: data.user_id,
                                completed: data.completed,
                                creation_date: data.creation_date,
                                notes: data.notes,
                                skillpoints: updatedSkillpoints, // ✅ Send updated skillpoints
                            };
    
                            res.status(201).json(responseBody);
                        });
                    });
                });
            });
        });
    }; 

module.exports.readChallengeById = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id,
    };

    const callback = (error, results, fields) => {
        if (results.length === 0) {
            res.status(404).send("Requested challenge_id not found")
        } else {
            const responseBody = results.map(row => ({
                user_id: row.user_id,
                completed: row.completed === 1,
                creation_date: row.creation_date.substring(0, 10), 
                notes: row.notes,
            }));
            res.status(200).json(responseBody);
        }
    };

    model.selectById(data, callback);
};

module.exports.getUserSkillpoints = (req, res, next) => {
    const userId = req.params.user_id;

    model.getSkillpoints(userId, (error, results) => {
        if (error) return next(error);

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ skillpoints: results[0].skillpoints });
    });
};

module.exports.updateSkillpoints = (req, res) => {
    console.log('Starting updateSkillpoints...'); // Debug log
    console.log('Params:', req.params);
    console.log('Body:', req.body);
    
    const userId = req.params.user_id;
    const { skillpoints } = req.body;

    if (!userId || skillpoints === undefined) {
        console.log('Validation failed:', { userId, skillpoints });
        return res.status(400).send('User ID and skillpoints are required');
    }

    // First, verify the user exists
    const checkUserQuery = 'SELECT skillpoints FROM user WHERE id = ?';
    pool.query(checkUserQuery, [userId], (checkError, checkResults) => {
        if (checkError) {
            console.error('Error checking user:', checkError);
            return res.status(500).send('Database error while checking user');
        }

        if (checkResults.length === 0) {
            return res.status(404).send('User not found');
        }

        // Now update the skillpoints
        const updateQuery = 'UPDATE user SET skillpoints = skillpoints + ? WHERE id = ?';
        pool.query(updateQuery, [skillpoints, userId], (updateError, updateResult) => {
            if (updateError) {
                console.error('Error updating skillpoints:', updateError);
                return res.status(500).send('Database error while updating skillpoints');
            }

            // Get the updated skillpoints
            pool.query(checkUserQuery, [userId], (fetchError, fetchResults) => {
                if (fetchError) {
                    console.error('Error fetching updated skillpoints:', fetchError);
                    return res.status(500).send('Database error while fetching updated skillpoints');
                }

                res.status(200).json({
                    message: 'Skillpoints updated successfully',
                    skillpoints: fetchResults[0].skillpoints
                });
            });
        });
    });
};