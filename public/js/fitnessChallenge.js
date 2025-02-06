// Constants
const API_BASE_URL = "/challenges";

// Global state management
let userSkillpoints = 0; // This should be initialized at the top

// Token management
function getAuthToken() {
    return localStorage.getItem("token");
}

// Check if user is logged in
function checkAuthentication() {
    const token = getAuthToken();
    if (!token) {
        window.location.href = "/login.html";
        return false;
    }
    return true;
}

// Fetch and display user skillpoints
async function fetchAndDisplayUserSkillpoints() {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
        alert("User ID not found.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/skillpoints`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch skillpoints.");
        }

        const data = await response.json();

        // Log the raw response data for debugging
        console.log("Raw response data:", data);

        // Assuming the response contains the user's skillpoints
        const skillpoints = data.skillpoints || 0;  // Default to 0 if skillpoints is not found
        userSkillpoints = skillpoints;  // Set the initial value

        console.log("User skillpoints fetched:", userSkillpoints);  // Correct log to display skillpoints

        // Update the DOM to display the skillpoints
        const skillpointsElement = document.getElementById("user-skillpoints");
        if (skillpointsElement) {
            skillpointsElement.innerText = `Skillpoints: ${userSkillpoints}`;
        } else {
            console.error("Couldn't find the skillpoints element to update.");
        }
        
    } catch (error) {
        console.error("Error fetching skillpoints:", error);
        alert("Failed to fetch skillpoints. Please try again.");
    }
}


// Update skillpoints after challenge completion
function updateUserSkillpoints(skillpoints) {
    const userId = localStorage.getItem("user_id");
    
    console.log('Updating skillpoints:', { userId, skillpoints }); // Debug log
    
    if (!userId || skillpoints === undefined) {
        console.error("Missing userId or skillpoints:", { userId, skillpoints });
        return;
    }

    fetch(`${API_BASE_URL}/users/${userId}/skillpoints`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ 
            skillpoints: parseInt(skillpoints) // Ensure it's a number
        })
    })
    .then(async response => {
        const text = await response.text();
        console.log("Raw response:", text);
        
        if (!response.ok) {
            throw new Error(text || 'Error updating skillpoints');
        }
        
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Error parsing response:', e);
            return { skillpoints: parseInt(skillpoints) };
        }
    })
    .then(data => {
        console.log('Skillpoints updated:', data);
        updateSkillpointsDisplay(data.skillpoints);
        fetchAndDisplayUserSkillpoints(); // Refresh the display
    })
    .catch(error => {
        console.error('Error updating skillpoints:', error);
        alert('Failed to update skillpoints. Please try again.');
    });
}

// Update the display function to handle number formatting
function updateSkillpointsDisplay(newSkillpoints) {
    const skillpointsElement = document.getElementById("user-skillpoints");
    if (skillpointsElement) {
        skillpointsElement.innerHTML = `<strong>Skillpoints:</strong> ${Number(newSkillpoints).toLocaleString()}`;
    }
}

// State management
let challenges = [];
let completedChallenges = new Set();
let userSkillPoints = 0;

// Fetch all challenges
async function fetchChallenges() {
    if (!checkAuthentication()) return;

    try {
        const response = await fetch(API_BASE_URL, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });

        if (!response.ok) throw new Error("Failed to fetch challenges");

        challenges = await response.json();
        renderChallenges();
    } catch (error) {
        console.error("Error fetching challenges:", error);
        document.getElementById("challenges-list").innerHTML =
            '<div class="loading">Error loading challenges. Please try again later.</div>';
    }
}

// Create challenge card
function createChallengeCard(challenge) {
    const isCompleted = completedChallenges.has(challenge.challenge_id);

    const card = document.createElement("div");
    card.className = "challenge-card";

    const attemptButtonClass = isCompleted ? "completed" : "attempt";
    const attemptButtonText = isCompleted ? "Completed" : "Completed?";

    card.innerHTML = `
        <div class="challenge-info">
            <div class="challenge-name">${challenge.challenge}</div>
            <div class="skillpoints">Skillpoints: ${challenge.skillpoints}</div>
        </div>
        <button 
            class="attempt-button ${attemptButtonClass}"
            data-challenge-id="${challenge.challenge_id}"
            ${isCompleted ? "disabled" : ""}
        >
            ${attemptButtonText}
        </button>
        <button class="edit-button" onclick="editChallenge(${challenge.challenge_id}, '${challenge.challenge}', ${challenge.skillpoints})">
            ✏️ Edit
        </button>
        <button class="delete-button" onclick="deleteChallenge(${challenge.challenge_id})">
            ❌ Delete
        </button>
    `;

    // Dynamically change the button's style after completion
    const attemptButton = card.querySelector(".attempt-button");
    
    // Add event listener for the completion button
    attemptButton.addEventListener("click", () => {
        if (!isCompleted) {
            // Update the challenge completion status
            completedChallenges.add(challenge.challenge_id);
            
            // Update button text and class
            attemptButton.classList.remove("attempt");
            attemptButton.classList.add("completed");
            attemptButton.textContent = "Completed";
            attemptButton.disabled = true;

            // Update the user's skillpoints
            updateUserSkillpoints(challenge.skillpoints);
        }
    });

    return card;
}

// Render all challenges
async function renderChallenges() {
    const container = document.getElementById("challenges-list");
    container.innerHTML = "";

    // User info
    const userInfo = document.createElement("div");
    userInfo.className = "user-info";
    userInfo.innerHTML = `
        <h2 style="color: #f57c00;">Welcome!</h2>
        <p id="user-skillpoints" style="color: white;"><strong>Skillpoints:</strong> Loading...</p>
    `;
    container.appendChild(userInfo);

    challenges.forEach((challenge) => {
        container.appendChild(createChallengeCard(challenge));
    });

    fetchAndDisplayUserSkillpoints();
}

// Handle challenge attempt
async function handleChallengeCompletion(response) {
    try {
        const completionData = await response.json();

        console.log("Challenge completion response:", completionData);

        // Check if skillpoints is an array, and if so, extract the value from the first item
        let skillpoints = 0;

        if (Array.isArray(completionData.skillpoints) && completionData.skillpoints.length > 0) {
            skillpoints = completionData.skillpoints[0].value;  // Access the value from the first object
        }

        console.log("Skillpoints from challenge completion:", skillpoints);

        // Assuming you want to update skillpoints here after challenge completion
        const skillpointsElement = document.getElementById("user-skillpoints");
        if (skillpointsElement) {
            skillpointsElement.innerText = `Skillpoints: ${skillpoints}`;
        } else {
            console.error("Couldn't find the skillpoints element to update.");
        }

    } catch (error) {
        console.error("Error handling challenge completion:", error);
    }
}

async function editChallenge(challengeId, challengeName, skillpoints) {
    const newName = prompt("Enter new challenge name:", challengeName);
    const newSkillpoints = prompt("Enter new skillpoints:", skillpoints);

    if (newName === null || newSkillpoints === null) return; // User canceled

    // Validate input
    if (!newName.trim() || isNaN(newSkillpoints) || newSkillpoints < 0) {
        alert("Please provide valid input.");
        return;
    }

    const userId = localStorage.getItem("user_id"); // Get user_id from localStorage

    // Validate that user_id exists
    if (!userId) {
        alert("User ID not found.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${challengeId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId, // Add user_id to the request body
                challenge: newName,
                skillpoints: parseInt(newSkillpoints)
            })
        });

        // Log the raw response text for debugging
        const responseText = await response.text();
        console.log("Raw response:", responseText);

        if (!response.ok) {
            console.error("Error response body:", responseText);
            throw new Error("Failed to update challenge");
        }

        // Try parsing the response as JSON after checking the status
        const responseData = JSON.parse(responseText);

        alert("Challenge updated successfully!");
        fetchChallenges(); // Refresh UI
    } catch (error) {
        console.error("Error updating challenge:", error);
        alert(`Failed to update challenge. ${error.message}`);
    }
}



// ❌ Delete Challenge
async function deleteChallenge(challengeId) {
    if (!confirm("Are you sure you want to delete this challenge?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${challengeId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });

        if (!response.ok) throw new Error("Failed to delete challenge");

        alert("Challenge deleted successfully!");
        fetchChallenges(); // Refresh UI
    } catch (error) {
        console.error("Error deleting challenge:", error);
        alert("Failed to delete challenge.");
    }
}

async function createChallenge() {
    const challengeName = document.getElementById("challenge-name").value;
    const skillpoints = document.getElementById("skillpoints").value;

    // Validate input
    if (!challengeName.trim() || !skillpoints || isNaN(skillpoints) || skillpoints < 0) {
        alert("Please provide valid challenge name and skillpoints.");
        return;
    }

    const userId = localStorage.getItem("user_id");

    // Validate user ID
    if (!userId) {
        alert("User ID not found.");
        return;
    }

    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: userId, // Ensure the user_id is included in the body
                challenge: challengeName,
                skillpoints: parseInt(skillpoints), // Ensure skillpoints is an integer
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create challenge");
        }

        const responseData = await response.json();
        console.log("Challenge created:", responseData);

        alert("Challenge created successfully!");
        fetchChallenges(); // Refresh the list of challenges
    } catch (error) {
        console.error("Error creating challenge:", error);
        alert("Failed to create challenge. Please try again.");
    }
}


// Logout
function logout() {
    // Clear the token and user ID from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");

    // Reset skillpoints in the frontend
    const skillpointsElement = document.getElementById("user-skillpoints");
    if (skillpointsElement) {
        skillpointsElement.innerHTML = "<strong>Skillpoints:</strong> 0";
    }

    window.location.href = "/login.html";
}


document.addEventListener("DOMContentLoaded", () => {
    if (checkAuthentication()) {
        fetchChallenges();
        fetchAndDisplayUserSkillpoints(); // Ensure this is called on load
    }
});

