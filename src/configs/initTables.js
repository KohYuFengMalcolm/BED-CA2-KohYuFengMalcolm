const pool = require("../services/db");

const SQLSTATEMENT = `

DROP TABLE IF EXISTS user;

DROP TABLE IF EXISTS FitnessChallenge;

DROP TABLE IF EXISTS UserCompletion;

DROP TABLE IF EXISTS pack_types;

DROP TABLE IF EXISTS user_packs;

DROP TABLE IF EXISTS user_cards;

DROP TABLE IF EXISTS Reviews;

DROP TABLE IF EXISTS cards;

CREATE TABLE Reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  review_amt INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Reviews (review_amt, user_id) VALUES
  (5, 1),
  (4, 2),  
  (3, 3);
  
CREATE TABLE user (
   id INT PRIMARY KEY AUTO_INCREMENT,
   username VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL,
   skillpoints INT DEFAULT 0,
   created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   last_login_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
   is_available BOOLEAN DEFAULT true
);

-- Hoops Starter Pack (Higher chance for common cards)
INSERT INTO pack_types (name, description, price, rarity_weights, is_available)
VALUES 
('Hoops Starter Pack', 'An entry-level hoops pack perfect for new collectors and players, with more common base cards.', 
50, '{"Common": 80, "Rare": 15, "Epic": 5, "Legendary": 0}', true);

-- All-Star Showcase Pack (Balanced chances for rare and epic players)
INSERT INTO pack_types (name, description, price, rarity_weights, is_available)
VALUES 
('All-Star Showcase Pack', 'A pack featuring top rising stars and established players with a higher 
chance for rare and epic cards.', 120, '{"Common": 50, "Rare": 20, "Epic": 30, "Legendary": 0}', true);

-- Champion Pack (Higher chances for epic and legendary players)
INSERT INTO pack_types (name, description, price, rarity_weights, is_available)
VALUES 
('Champion Pack', 'A premium pack featuring legendary players from the 
basketball world, with a high chance of epic and legendary cards.', 200, 
'{"Common": 20, "Rare": 25, "Epic": 35, "Legendary": 20}', true);

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
    card_id INT ,
    player_name VARCHAR(255) NOT NULL,
    position VARCHAR(50),
    team VARCHAR(255),
    rarity VARCHAR(50),
    overall_rating INT,
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
('Kevin Durant', 'PF', 'Phoenix Suns', 'epic', 95),
('Giannis Antetokounmpo', 'PF', 'Milwaukee Bucks', 'epic', 95);

INSERT INTO cards (player_name, position, team, rarity, overall_rating) VALUES
('Damian Lillard', 'PG', 'Milwaukee Bucks', 'rare', 90),
('Jayson Tatum', 'SF', 'Boston Celtics', 'rare', 91),
('Joel Embiid', 'C', 'Philadelphia 76ers', 'rare', 93);

INSERT INTO cards (player_name, position, team, rarity, overall_rating) VALUES
('Tyler Herro', 'SG', 'Miami Heat', 'common', 84),
('Jordan Poole', 'SG', 'Washington Wizards', 'common', 85),
('Tyrese Maxey', 'SG', 'Philadelphia 76ers', 'common', 87);`;


pool.query(SQLSTATEMENT, (error, results, fields) => {
   if (error) {
       console.error("Error creating tables:", error);
   } else {
       console.log("Tables created successfully:", results);
   }
   process.exit();
});