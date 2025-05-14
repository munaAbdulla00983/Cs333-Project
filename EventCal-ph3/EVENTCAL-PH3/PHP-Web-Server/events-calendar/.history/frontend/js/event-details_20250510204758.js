// Event details page functionality
let currentEventId = null;
let currentEvent = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadEventDetails();
    setupCommentForm();
});

// Load event details
async function loadEventDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    currentEventId = urlParams.get('id');
    
    if (!currentEventId) {
        window.location.href = 'events.html';
        return;
    }
    
    try {
        // For Phase 2, using mock data. Replace with actual API call in Phase 3
        currentEvent = generateMockEvent(currentEventId);
        renderEventDetails(currentEvent);
        loadComments();
    } catch (error) {
        console.error('Error loading event details:', error);
        showError('Failed to load event details. Please try again.');
    }
}

// Generate mock event data
function generateMockEvent(eventId) {
    return {
        id: eventId,
        title: `Amazing Tech Conference ${eventId}`,
        date: '2025-05-15',
        location: 'Main Auditorium, Building A',
        category: 'Conference',
        description: `Join us for this incredible tech conference where industry leaders will share insights on the latest trends in technology. This event features keynote speakers, hands-on workshops, and networking opportunities with professionals from around the world.

This is a must-attend event for anyone interested in technology, innovation, and the future of digital transformation. Don't miss this opportunity to learn, connect, and grow your professional network.`,
        image_url: `https://picsum.photos/800/400?random=${eventId}`
    };
}

// Render event details
function renderEventDetails(event) {
    const detailsSection = document.getElementById('eventDetails');
    
    detailsSection.innerHTML = `
        <img src="${event.image_url}" alt="${event.title}" class="event-detail-image" onerror="this.src='https://via.placeholder.com/800x400?text=Event+Image'">
        <div class="event-detail-content">
            <div class="event-detail-header">
                <h2>${event.title}</h2>
                <div class="event-actions">
                    <button class="btn btn-secondary" onclick="goBack()">
                        <i class="fas fa-arrow-left"></i> Back
                    </button>
                    <button class="btn btn-primary" onclick="editEvent(${event.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteEvent(${event.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            
            <div class="event-detail-meta">
                <div class="event-meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(event.date)}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
                <div class="event-meta-item">
                    <i class="fas fa-tag"></i>
                    <span>${event.category}</span>
                </div>
            </div>
            
            <div class="event-description">
                ${event.description.split('\n').map(p => `<p>${p}</p>`).join('')}
            </div>
        </div>
    `;
}

// Setup comment form
function setupCommentForm() {
    const form = document.getElementById('commentForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        const nameInput = document.getElementById('author_name');
        const contentInput = document.getElementById('content');
        let isValid = true;
        
        if (!nameInput.value.trim()) {
            nameInput.parentElement.classList.add('error');
            isValid = false;
        } else {
            nameInput.parentElement.classList.remove('error');
        }
        
        if (!contentInput.value.trim()) {
            contentInput.parentElement.classList.add('error');
            isValid = false;
        } else {
            contentInput.parentElement.classList.remove('error');
        }
        
        if (!isValid) return;
        
        // Submit comment
        const commentData = {
            author_name: nameInput.value.trim(),
            content: contentInput.value.trim(),
            event_id: currentEventId,
            created_at: new Date().toISOString()
        };
        
        try {
            // For Phase 2, simulate API call
            console.log('Submitting comment:', commentData);
            
            // Add comment to the list
            addCommentToList(commentData);
            
            // Clear form
            form.reset();
            
            showSuccess('Comment added successfully!');
        } catch (error) {
            console.error('Error submitting comment:', error);
            showError('Failed to add comment. Please try again.');
        }
    });
}

// Load comments
async function loadComments() {
    try {
        // For Phase 2, generate mock comments
        const mockComments = generateMockComments();
        renderComments(mockComments);
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Generate mock comments
function generateMockComments() {
    return [
        {
            id: 1,
            author_name: 'John Doe',
            content: 'Looking forward to this event! It sounds amazing.',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            event_id: currentEventId
        },
        {
            id: 2,
            author_name: 'Jane Smith',
            content: 'Will there be any live streaming option for those who cannot attend in person?',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            event_id: currentEventId
        }
    ];
}

// Render comments
function renderComments(comments) {
    const commentsList = document.getElementById('commentsList');
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
        return;
    }
    
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-card" data-comment-id="${comment.id}">
            <button class="delete-comment-btn" onclick="deleteComment(${comment.id})" title="Delete comment">
                <i class="fas fa-times"></i>
            </button>
            <div class="comment-header">
                <span class="comment-author">${comment.author_name}</span>
                <span class="comment-date">${formatDateTime(comment.created_at)}</span>
            </div>
            <p class="comment-content">${comment.content}</p>
        </div>
    `).join('');
}

// Add comment to list
function addCommentToList(comment) {
    const commentsList = document.getElementById('commentsList');
    const noCommentsMessage = commentsList.querySelector('.no-comments');
    
    if (noCommentsMessage) {
        noCommentsMessage.remove();
    }
    
    const commentCard = document.createElement('div');
    commentCard.className = 'comment-card';
    commentCard.innerHTML = `
        <button class="delete-comment-btn" onclick="deleteComment(${Date.now()})" title="Delete comment">
            <i class="fas fa-times"></i>
        </button>
        <div class="comment-header">
            <span class="comment-author">${comment.author_name}</span>
            <span class="comment-date">${formatDateTime(comment.created_at)}</span>
        </div>
        <p class="comment-content">${comment.content}</p>
    `;
    
    commentsList.insertBefore(commentCard, commentsList.firstChild);
}

// Event actions
function goBack() {
    window.location.href = 'events.html';
}

function editEvent(eventId) {
    window.location.href = `create-event.html?edit=${eventId}`;
}

async function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }
    
    try {
        // For Phase 2, simulate API call
        console.log('Deleting event:', eventId);
        
        showSuccess('Event deleted successfully!');
        
        setTimeout(() => {
            window.location.href = 'events.html';
        }, 1500);
    } catch (error) {
        console.error('Error deleting event:', error);
        showError('Failed to delete event. Please try again.');
    }
}

async function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }
    
    try {
        // For Phase 2, simulate API call
        console.log('Deleting comment:', commentId);
        
        // Remove comment from DOM
        const commentCard = document.querySelector(`[data-comment-id="${commentId}"]`);
        if (commentCard) {
            commentCard.remove();
        }
        
        showSuccess('Comment deleted successfully!');
    } catch (error) {
        console.error('Error deleting comment:', error);
        showError('Failed to delete comment. Please try again.');
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message-box';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #e74c3c;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}