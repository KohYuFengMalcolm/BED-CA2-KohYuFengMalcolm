// Retrieve current user ID from token
let currentUserId = null;

// Function to decode JWT token and extract user ID
function decodeToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to leave a review');
        window.location.href = 'login.html';
        return null;
    }

    try {
        // Assuming the token is a JWT with the user ID in its payload
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const payload = JSON.parse(window.atob(base64));
        
        return payload.userId || payload.id; // Adjust based on your token structure
    } catch (error) {
        console.error('Error decoding token:', error);
        alert('Invalid authentication token. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
        return null;
    }
}

// Star rating functionality
const starRating = document.getElementById('starRating');
let selectedRating = 0;

starRating.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        selectedRating = parseInt(e.target.dataset.rating);
        updateStarDisplay();
    }
});

function updateStarDisplay() {
    const stars = starRating.getElementsByClassName('star');
    for (let i = 0; i < stars.length; i++) {
        stars[i].classList.toggle('active', i < selectedRating);
    }
}

// Format timestamp
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Submit review
document.getElementById('submitReview').addEventListener('click', async () => {
    // Ensure user is logged in and has a valid user ID
    currentUserId = decodeToken();
    if (!currentUserId) return;

    if (selectedRating === 0) {
        alert('Please select a rating');
        return;
    }

    try {
        const response = await fetch('/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                user_id: currentUserId,
                review_amt: selectedRating
            })
        });

        if (response.ok) {
            selectedRating = 0;
            updateStarDisplay();
            loadReviews(); // Refresh the reviews list
        } else {
            throw new Error('Failed to submit review');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit review');
    }
});

// Load all reviews
async function loadReviews() {
    // Ensure user is logged in and has a valid user ID
    currentUserId = decodeToken();
    if (!currentUserId) return;

    try {
        const response = await fetch('/review', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const reviews = await response.json();
        displayReviews(reviews);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load reviews');
    }
}

// Display reviews
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '<h2>All Reviews</h2>';
    
    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'reviews-grid';

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = `review-card ${review.user_id === currentUserId ? 'own-review' : ''}`;
        
        const stars = '★'.repeat(review.review_amt) + '☆'.repeat(5 - review.review_amt);
        
        // Only show edit/delete buttons for the user's own reviews
        const actionButtons = review.user_id === currentUserId 
            ? `
            <div class="review-actions">
                <button onclick="editReview(${review.id}, ${review.review_amt})">Edit Review</button>
                <button onclick="deleteReview(${review.id})">Delete Review</button>
            </div>
            `
            : '';

        reviewElement.innerHTML = `
            <div class="star-display">${stars}</div>
            <div class="user-info">User ID: ${review.user_id}</div>
            <div class="timestamp">Posted: ${formatDate(review.created_at)}</div>
            ${actionButtons}
        `;
        
        gridContainer.appendChild(reviewElement);
    });

    reviewsList.appendChild(gridContainer);
}

// Edit review
async function editReview(reviewId, currentRating) {
    const newRating = prompt('Enter new rating (1-5):', currentRating);
    if (!newRating || isNaN(newRating) || newRating < 1 || newRating > 5) {
        alert('Please enter a valid rating between 1 and 5');
        return;
    }

    try {
        const response = await fetch(`/review/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                user_id: currentUserId,
                review_amt: parseInt(newRating)
            })
        });

        if (response.ok) {
            loadReviews(); // Refresh the reviews list
        } else {
            throw new Error('Failed to update review');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update review');
    }
}

// Delete review
async function deleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) {
        return;
    }

    try {
        const response = await fetch(`/review/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            loadReviews(); // Refresh the reviews list
        } else {
            throw new Error('Failed to delete review');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete review');
    }
}

// Load reviews when page loads
document.addEventListener('DOMContentLoaded', () => {
    currentUserId = decodeToken();
    if (currentUserId) {
        loadReviews();
    }
});