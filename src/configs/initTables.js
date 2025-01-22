const pool = require("../services/db");

const SQLSTATEMENT = `
CREATE TABLE user (
   user_id INT AUTO_INCREMENT PRIMARY KEY,
   username VARCHAR(255),
   skillpoints INT DEFAULT 0
);

CREATE TABLE FitnessChallenge (
   challenge_id INT AUTO_INCREMENT PRIMARY KEY, 
   creator_id INT NOT NULL,
   challenge TEXT NOT NULL,
   skillpoints INT NOT NULL
);

CREATE TABLE UserCompletion (
   complete_id INT AUTO_INCREMENT PRIMARY KEY,
   challenge_id INT NOT NULL,
   user_id INT NOT NULL,
   completed BOOLEAN NOT NULL,
   creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   notes TEXT
);

CREATE TABLE pack_types (
   pack_type_id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255),
   description TEXT,
   price INT,
   rarity_weights TEXT,
   guaranteed_rarity VARCHAR(50),
   is_available BOOLEAN DEFAULT true
);

CREATE TABLE user_packs (
   user_pack_id INT AUTO_INCREMENT PRIMARY KEY,
   user_id INT,
   pack_type_id INT,
   is_opened BOOLEAN DEFAULT false
);

CREATE TABLE cards (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL,
    position VARCHAR(50),
    team VARCHAR(255),
    rarity VARCHAR(50),
    overall_rating INT
);

CREATE TABLE user_cards (
    user_card_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    card_id INT,
    obtained_from_pack INT,
    obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Now insert the fitness challenges
INSERT INTO FitnessChallenge (creator_id, challenge, skillpoints) VALUES
(1, 'Complete 2.4km within 15 minutes', 50),
(1, 'Cycle around the island for at least 50km', 100),
(2, 'Complete a full marathon (42.2km)', 200),
(2, 'Hold a plank for 5 minutes', 50),
(2, 'Perform 100 push-ups in one session', 75);

-- Insert cards data
INSERT INTO cards (player_name, position, team, rarity, overall_rating) VALUES
('LeBron James', 'SF', 'Los Angeles Lakers', 'legendary', 99),
('Michael Jordan', 'SG', 'Chicago Bulls', 'legendary', 99),
('Kareem Abdul-Jabbar', 'C', 'Los Angeles Lakers', 'legendary', 98);

INSERT INTO cards (player_name, position, team, rarity, overall_rating) VALUES
('Stephen Curry', 'PG', 'Golden State Warriors', 'epic', 96),
('Kevin Durant', 'SF', 'Phoenix Suns', 'epic', 95),
('Giannis Antetokounmpo', 'PF', 'Milwaukee Bucks', 'epic', 95);

INSERT INTO cards (player_name, position, team, rarity, overall_rating) VALUES
('Damian Lillard', 'PG', 'Milwaukee Bucks', 'rare', 90),
('Jayson Tatum', 'SF', 'Boston Celtics', 'rare', 89),
('Joel Embiid', 'C', 'Philadelphia 76ers', 'rare', 91);

INSERT INTO cards (player_name, position, team, rarity, overall_rating) VALUES
('Tyler Herro', 'SG', 'Miami Heat', 'common', 85),
('Jordan Poole', 'SG', 'Washington Wizards', 'common', 82),
('Tyrese Maxey', 'PG', 'Philadelphia 76ers', 'common', 84);`;


pool.query(SQLSTATEMENT, (error, results, fields) => {
   if (error) {
       console.error("Error creating tables:", error);
   } else {
       console.log("Tables created successfully:", results);
   }
   process.exit();
});