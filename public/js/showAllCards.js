const fetchCards = async () => {
    try {
        const response = await fetch('/api/cards'); // Fetch data from the backend
        if (!response.ok) {
            throw new Error('Failed to fetch cards');
        }
        const cards = await response.json();
        displayCards(cards);
    } catch (error) {
        console.error('Error fetching cards:', error);
    }
};

const imageUrls = {
    "LeBron James": "https://img.2kdb.net/airE4k_jW78FguYrv9UMT7Nl9V04GTlFpDmWpfM9mlc/s:640:0/f:webp/q:75/cb:1731442877156/plain/https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F24%2F2462430.png",
    "Michael Jordan": "https://img.2kdb.net/Z1pCG-GppWwpmQDPkaFHMeqtyTv5NjyA5B_x1ilkZ54/s:640:0/f:webp/q:75/cb:1731442877156/plain/https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F24%2F2462382.png",
    "Kareem Abdul-Jabbar": "https://img.2kdb.net/0u0acTE2Sdcp-2qFbQ1Pe7Qn4OFXgGEGaKmoxAG9SlA/s:640:0/f:webp/q:75/cb:1731442877156/plain/https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F24%2F2462484.png",
    "Stephen Curry": "https://img.2kdb.net/xKqBEWCm43uwLcP9eA2H_cjYLIdQfy004g0hNyOGE-Y/s:640:0/f:webp/q:75/cb:1731442869137/plain/https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F24%2F2461997.png",
    "Kevin Durant": "https://img.2kdb.net/OJ06izo3AJ_VjgHpqCmWvGcrbOhKqE-2lVXgjHM42mw/s:640:0/f:webp/q:75/cb:1731442861503/plain/https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F24%2F2451411.png",
    "Giannis Antetokounmpo": "https://img.2kdb.net/mIj5pfGNZHVDbUElTfz3PH4Z-1EJ9IHzmBcFFGN9t6U/s:640:0/f:webp/q:75/cb:1731442861503/plain/https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F24%2F2461946.png",
    "Damian Lillard": "https://img.2kdb.net/adFMCyPoDJxps47ppaIjBCEqFgQHqL0gr6YMRE_u_nw/s:640:0/f:webp/q:75/cb:1731442869137/plain/https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F24%2F2461219.png",
    "Jayson Tatum": "https://img.2kdb.net/FP5zrMHd6n0rQkYrRaGYMroza5YCS-C23qzyr1AlvvQ/s:640:0/f:webp/q:75/cb:1731442869137/plain/https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F24%2F2461180.png",
    "Joel Embiid": "https://img.2kdb.net/EvCzgYEFxXwZp_CxXH7oO06O2GsntYRh-m5lSMZCwus/s:640:0/f:webp/q:75/cb:1731442869137/plain/https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F24%2F2461482.png",
    "Tyler Herro": "https://img.2kdb.net/eSsYxTToeBXcO6iSUkDNI7SUetmYg3jMNLzexWLYJ58/s:640:0/f:webp/q:75/cb:1731442861503/plain/https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F24%2F2457832.png",
    "Jordan Poole": "https://img.2kdb.net/7hYPpVyel-1maL3UdMflQ3BRyjLNwuZzgW3SjtZSAlk/s:640:0/f:webp/q:75/cb:1731442869137/plain/https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F24%2F2461318.png",
    "Tyrese Maxey": "https://img.2kdb.net/lu-6PcbzVtD2q0Tc58J2WnDBV4vab3BjnnK1RFVyWps/s:640:0/f:webp/q:75/cb:1731442869137/plain/https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F24%2F2461502.png",
};

const displayCards = (cards) => {
    const cardList = document.getElementById('cardList');
    cardList.innerHTML = ''; // Clear any existing content

    // Group cards by rarity
    const groupedCards = {
        legendary: [],
        epic: [],
        rare: [],
        common: []
    };

    cards.forEach((card) => {
        groupedCards[card.rarity].push(card);
    });

    // Display cards in rows by rarity
    for (const rarity in groupedCards) {
        const rarityCards = groupedCards[rarity];
        if (rarityCards.length > 0) {
            const rarityRow = document.createElement('div');
            rarityRow.className = 'rarity-row'; // Apply the class here

            rarityCards.forEach((card) => {
                const cardElement = document.createElement('div');
                cardElement.className = `card ${card.rarity}`;
                cardElement.innerHTML = `
                    <img src="${imageUrls[card.player_name]}" alt="${card.player_name}" class="card-image">
                    <h2>${card.player_name}</h2>
                    <p>Position: ${card.position}</p>
                    <p>Team: ${card.team}</p>
                    <p>Rarity: ${card.rarity}</p>
                    <p>Overall Rating: ${card.overall_rating}</p>
                `;
                rarityRow.appendChild(cardElement);
            });

            cardList.appendChild(rarityRow);
        }
    }
};

// Fetch and display cards when the page loads
fetchCards();