const model = require("../models/challengeModel.js");

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
    const data = {
        challenge_id: req.params.challenge_id,
        challenge: req.body.challenge,
        skillpoints: req.body.skillpoints,
    };

    console.log("Data for SQL:", data);

    const callback = (error, results, fields) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).send("Provided username is already associated with another user");
            }
        } 
        
        if (results.affectedRows === 0) {
            return res.status(404).send("Challange id does not exist");
        }

        res.status(200).json({
            user_id: data.user_id,
            username: data.username,
            skillpoints: data.skillpoints,
        });
    };

    model.updateById(data, callback);
};

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

        if (results[0].creator_id !== parseInt(data.user_id)) {
            return res.status(403).send("Creator_id is different from the user_id");
        }
        model.updateById(data, (error, updateResults) => {

            if (updateResults.affectedRows === 0) {
                return res.status(404).send("Requested challenge_id does not exist");
            }

            res.status(200).json({
                challenge_id: parseInt(data.challenge_id),
                challenge: data.challenge,
                creator_id: parseInt(data.user_id),
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
            creation_date: req.body.creation_date,
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
    
                        const rawCreationDate = new Date(data.creation_date);
                        const formattedCreationDate = rawCreationDate.toISOString().split('T')[0];
    
                        const responseBody = {
                            complete_id: results.insertId,
                            challenge_id: data.challenge_id,
                            user_id: data.user_id,
                            completed: data.completed,
                            creation_date: formattedCreationDate, 
                            notes: data.notes,
                        };
    
                        res.status(201).json(responseBody);
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