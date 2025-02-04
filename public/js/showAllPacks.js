const fetchPacks = async () => {
    try {
        const response = await fetch('/pack-types'); // Fetch data for packs from the backend
        if (!response.ok) {
            throw new Error('Failed to fetch packs');
        }
        const packs = await response.json();
        displayPacks(packs);
    } catch (error) {
        console.error('Error fetching packs:', error);
    }
};

const imageUrls = {
    "Hoops Starter Pack": "images/hoopsStarterPack.png",
    "All-Star Showcase Pack": "images/All-starPack.png",
    "Champion Pack": "images/championPack.png"
}

const displayPacks = (packs) => {
    const packList = document.getElementById('packList');
    packList.innerHTML = ''; // Clear any existing content

    // Display packs in a grid layout
    packs.forEach((pack) => {
        const packElement = document.createElement('div');
        packElement.className = 'pack-card'; // Apply a custom class for each pack

        // Create HTML content for the pack
        packElement.innerHTML = `
            <div class="pack" style="width: 18rem;">
                <div class="pack-body">
                    <img src="${imageUrls[pack.name]}" alt="${pack.name}" class="card-image">
                    <h5 class="pack-title">${pack.name}</h5>
                    <p class="pack-text">${pack.description}</p>
                    <p class="pack-text"><strong>Price:</strong> ${pack.price} skillpoints</p>
                    <p class="pack-text"><strong>Rarity Weights:</strong> ${pack.rarity_weights}</p>
                    <p class="pack-text"><strong>Guaranteed Rarity:</strong> ${pack.guaranteed_rarity}</p>
                    <a href="#" class="btn btn-primary">Buy for ${pack.price} skillpoints</a>
                </div>
            </div>
        `;
        
        // Add the pack element to the packList container
        packList.appendChild(packElement);
    });
};

// Fetch and display packs when the page loads
fetchPacks();
