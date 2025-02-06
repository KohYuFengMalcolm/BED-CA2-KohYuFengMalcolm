// First, add the image URLs
const playerImages = {
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
    "Tyrese Maxey": "https://img.2kdb.net/lu-6PcbzVtD2q0Tc58J2WnDBV4vab3BjnnK1RFVyWps/s:640:0/f:webp/q:75/cb:1731442869137/plain/https%3A%2F%2F2kdb.net%2Fstorage%2Fimages%2Fplayers%2F24%2F2461502.png"
};

const rarityStyles = {
    'common': { color: '#00a600', border: '2px solid #00a600', background: 'linear-gradient(145deg, #008800, #00a600)' },
    'rare': { color: '#0070dd', border: '2px solid #0070dd', background: 'linear-gradient(145deg, #0055aa, #0070dd)' },
    'epic': { color: '#a335ee', border: '2px solid #a335ee', background: 'linear-gradient(145deg, #8228bd, #a335ee)' },
    'legendary': { color: '#ff8000', border: '2px solid #ff8000', background: 'linear-gradient(145deg, #cc6600, #ff8000)' }
};


// Authentication helper
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
};

// Fetch and display collection
const fetchCollection = async () => {
    try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch(`/collection/user/${userId}`, {
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch collection');
        }

        const cards = await response.json();
        
        if (!cards.length) {
            // Display message for users with no cards
            const collectionDiv = document.getElementById('collection');
            collectionDiv.innerHTML = `
                <div class="collection-stats">
                    <h2>Collection Stats</h2>
                    <p>Total Unique Cards: 0</p>
                    <p>Total Cards: 0</p>
                </div>
                <div class="no-cards">
                    <h3>No cards in your collection yet!</h3>
                    <p>Visit the Pack Market to get some cards.</p>
                </div>
            `;
            return;
        }

        displayCollection(groupCards(cards));
    } catch (error) {
        console.error('Error fetching collection:', error);
        alert('Error loading collection');
    }
};

// Group identical cards and count quantities
const groupCards = (cards) => {
    const groupedCards = cards.reduce((acc, card) => {
        const key = `${card.player_name}-${card.rarity}-${card.position}-${card.team}-${card.overall_rating}`;
        
        if (!acc[key]) {
            acc[key] = {
                ...card,
                quantity: 1
            };
        } else {
            acc[key].quantity += 1;
        }
        
        return acc;
    }, {});

    return Object.values(groupedCards);
};

const displayCollection = (groupedCards) => {
    const collectionDiv = document.getElementById('collection');
    if (!collectionDiv) return;

    const sortedCards = groupedCards.sort((a, b) => {
        const rarityOrder = { 'legendary': 0, 'epic': 1, 'rare': 2, 'common': 3 };
        if (rarityOrder[a.rarity.toLowerCase()] !== rarityOrder[b.rarity.toLowerCase()]) {
            return rarityOrder[a.rarity.toLowerCase()] - rarityOrder[b.rarity.toLowerCase()];
        }
        return b.overall_rating - a.overall_rating;
    });

    collectionDiv.innerHTML = `
        <div class="collection-stats">
            <h2>Collection Stats</h2>
            <p>Total Unique Cards: ${groupedCards.length}</p>
            <p>Total Cards: ${groupedCards.reduce((sum, card) => sum + card.quantity, 0)}</p>
        </div>
        <div class="collection-grid">
            ${sortedCards.map(card => {
                const style = rarityStyles[card.rarity.toLowerCase()];
                const playerImage = playerImages[card.player_name];
                return `
                    <div class="card" style="border: ${style.border}">
                        <div class="card-quantity">${card.quantity}×</div>
                        <div class="card-rarity" style="background: ${style.background}">
                            ${card.rarity.toUpperCase()}
                        </div>
                        <div class="card-image">
                            <img src="${playerImage}" alt="${card.player_name}">
                        </div>
                        <div class="card-name" style="color: #ff8000;">${card.player_name}</div>
                        <div class="card-team">OVR: ${card.overall_rating}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    if (!token || !userId) {
        window.location.href = '/login.html';
        return;
    }

    fetchCollection();
});