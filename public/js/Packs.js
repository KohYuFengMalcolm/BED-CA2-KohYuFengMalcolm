const imageUrls = {
    // Pack Images
    "Hoops Starter Pack": "/images/hoopsStarterPack.png",
    "All-Star Showcase Pack": "/images/All-starPack.png",
    "Champion Pack": "/images/championPack.png",
    // Player Images
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

// Authentication Helpers
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
};

// Utility Functions
const handleError = (error, message) => {
    console.error(message, error);
    alert(message);
};

// Pack Market Functions
const fetchPacks = async () => {
    try {
        const authHeader = getAuthHeader();
        if (!authHeader) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch('/pack-types', {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to fetch packs');
        }

        const packs = await response.json();
        displayPacks(packs);
    } catch (error) {
        handleError(error, 'Error fetching packs');
    }
};

const displayPacks = (packs) => {
    const packList = document.getElementById('packList');
    if (!packList) return;

    packList.innerHTML = '';

    if (!packs.length) {
        packList.innerHTML = '<div class="no-packs">No packs available at the moment.</div>';
        return;
    }

    packs.forEach(pack => {
        const packElement = document.createElement('div');
        packElement.className = 'pack-card';

        let rarityWeights = {};
        try {
            if (pack.rarity_weights) {
                rarityWeights = typeof pack.rarity_weights === 'string' 
                    ? JSON.parse(pack.rarity_weights.replace(/'/g, '"'))
                    : pack.rarity_weights;
            }
        } catch (e) {
            console.warn('Error parsing rarity weights', e);
        }

        packElement.innerHTML = `
            <div class="pack-content">
                <img src="${imageUrls[pack.name] || '/images/default-pack.png'}" 
                     alt="${pack.name}" class="pack-image">
                <h3>${pack.name}</h3>
                <p>${pack.description || 'No description available'}</p>
                <p>Price: ${pack.price} skillpoints</p>
                <button class="buy-button" data-pack-id="${pack.pack_type_id}">
                    Purchase Pack
                </button>
            </div>
        `;

        const buyButton = packElement.querySelector('.buy-button');
        buyButton.addEventListener('click', () => purchasePack(pack.pack_type_id));

        packList.appendChild(packElement);
    });
};

// Pack Purchase and Opening Functions
const purchasePack = async (packTypeId) => {
    try {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch('/packs/purchase', {
            method: 'POST',
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                pack_type_id: packTypeId
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to purchase pack');
        }

        const result = await response.json();
        alert('Pack purchased successfully!');
        
        await Promise.all([
            getUserPacks(),
            updateUserSkillPoints()
        ]);
    } catch (error) {
        handleError(error, 'Error purchasing pack');
    }
};

const getUserPacks = async () => {
    try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`/packs/user/${userId}`, {
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user packs');
        }

        const data = await response.json();
        displayUserPacks(data.packs);
    } catch (error) {
        handleError(error, 'Error fetching your packs');
    }
};

const displayUserPacks = (packs) => {
    const packsList = document.getElementById('userPacksList');
    if (!packsList) return;

    packsList.innerHTML = '';

    // Filter out opened packs
    const unopenedPacks = packs.filter(pack => !pack.is_opened);

    if (!unopenedPacks.length) {
        packsList.innerHTML = '<div class="no-packs">You don\'t have any packs yet. Visit the Pack Market to get some!</div>';
        return;
    }

    unopenedPacks.forEach(pack => {
        const packElement = document.createElement('div');
        packElement.className = 'pack-card';

        packElement.innerHTML = `
            <div class="pack-content">
                <img src="${imageUrls[pack.pack_name] || '/images/default-pack.png'}" 
                     alt="${pack.pack_name}" class="pack-image">
                <h3>${pack.pack_name}</h3>
                <button class="open-button" data-pack-id="${pack.user_pack_id}">
                    Open Pack
                </button>
            </div>
        `;

        const openButton = packElement.querySelector('.open-button');
        openButton.addEventListener('click', () => openPack(pack.user_pack_id));

        packsList.appendChild(packElement);
    });
};

const openPack = async (packId) => {
    try {
        const response = await fetch(`/packs/${packId}/open`, {
            method: 'POST',
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to open pack');
        }

        const result = await response.json();
        showCards(result.cards);
        await getUserPacks();
    } catch (error) {
        handleError(error, 'Error opening pack');
    }
};

const showCards = (cards) => {
    const revealDialog = document.getElementById('cardsReveal');
    const revealedCards = document.getElementById('revealedCards');

    revealedCards.innerHTML = cards.map(card => {
        const rarityStyle = rarityStyles[card.rarity.toLowerCase()];
        
        return `
            <div class="card-reveal" style="border: ${rarityStyle.border}">
                <span class="card-rating">OVR ${card.overall_rating}</span>
                <span class="card-rarity" style="background: ${rarityStyle.background}; color: white;">
                    ${card.rarity.toUpperCase()}
                </span>
                <h3 style="color: ${rarityStyle.color}">${card.player_name}</h3>
                <div class="card-details">
                    <p>Position: ${card.position}</p>
                    <p>Team: ${card.team}</p>
                </div>
            </div>
        `;
    }).join('');

    revealDialog.style.display = 'block';
    
    // Add animation to cards
    const cardElements = document.querySelectorAll('.card-reveal');
    cardElements.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, index * 200);
    });
};

const closeReveal = () => {
    const revealDialog = document.getElementById('cardsReveal');
    revealDialog.style.display = 'none';
    // Refresh the packs display after closing
    getUserPacks();
};

const updateUserSkillPoints = async () => {
    try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`/users/${userId}/skillpoints`, {
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch skill points');
        }

        const data = await response.json();
        const display = document.getElementById('skillPointsDisplay');
        if (display) {
            display.textContent = `Skill Points: ${data.skillpoints}`;
        }
    } catch (error) {
        console.error('Error updating skill points:', error);
    }
};

// Page Initialization
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    if (!token || !userId) {
        window.location.href = '/login.html';
        return;
    }

    if (document.getElementById('packList')) {
        fetchPacks();
        updateUserSkillPoints();
    } else if (document.getElementById('userPacksList')) {
        getUserPacks();
        updateUserSkillPoints();
    }
});