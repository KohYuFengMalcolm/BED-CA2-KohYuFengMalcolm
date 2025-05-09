# Basketball Card Collection & Fitness Challenge Platform

A Node.js application that combines fitness challenges with a basketball card collection game. Users can earn skillpoints by completing fitness challenges and use these points to purchase card packs containing NBA players.

## Features

- **Fitness Challenges**
  - View available fitness challenges
  - Complete challenges to earn skillpoints
  - Track challenge completion history

- **Card Collection System**
  - Purchase card packs using earned skillpoints
  - Different pack types with varying rarity probabilities
  - Collection of NBA player cards with different rarities
  - View owned cards and pack history

## Prerequisites

- Node.js 
- MySQL 
- npm 
- express
- dotenv
- jsonwebtoken
- bcrypt

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/KohYuFengMalcolm/BED-CA2-KohYuFengMalcolm.git
   cd BED-CA2-KohYuFengMalcolm
   ```

2. **Install Dependencies**
   ```bash
   npm install mysql2 express dotenv jsonwebtoken bcrypt
   ```

3. **Database Setup**
   - Create a MySQL database
   - Update the database configuration in the .env with your credentials:
     ```javascript
     const pool = mysql.createPool({
       host: 'your_host',
       user: 'your_username',
       password: 'your_password',
       database: 'your_database_name'
     });
     ```
   - Run the initialization script to create tables and insert initial data:
     ```bash
     node init_tables.js
     ```

4. **Start the Server**
   ```bash
   npm start
   ```

## Database Schema

The application uses several interconnected tables:
- `users` - Store user information and skillpoints
- `FitnessChallenge` - Available fitness challenges
- `UserCompletion` - Track challenge completions
- `pack_types` - Different types of card packs
- `cards` - NBA player cards
- `user_cards` - Track card ownership
- `user_packs` - Track pack purchases and openings
