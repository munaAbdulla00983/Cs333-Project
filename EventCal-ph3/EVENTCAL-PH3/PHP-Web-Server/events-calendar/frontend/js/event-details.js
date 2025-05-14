// Event details page functionality
const API_BASE_URL = 'https://2bf4af21-20f6-44fe-ba66-948fd0375fc2-00-3ha7g7ere36hw.sisko.replit.dev/events-calendar/backend/api';
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
        // Use the correct API endpoint structure
        const response = await fetch(`${API_BASE_URL}/events/${currentEventId}`);
        
        if (!response.ok) {
            throw new Error('Event not found');
        }
        
        currentEvent = await response.json();
        renderEventDetails(currentEvent);
        loadComments();
    } catch (error) {
        console.error('Error loading event details:', error);
        showError('Failed to load event details. Please try again.');
    }
}

// Render event details
function renderEventDetails(event) {
    const detailsSection = document.getElementById('eventDetails');
    
    detailsSection.innerHTML = `
        <img src="${event.image_url || 'https://via.placeholder.com/800x400?text=Event+Image'}" 
             alt="${event.title}" 
             class="event-detail-image" 
             onerror="this.src='https://via.placeholder.com/800x400?text=Event+Image'">
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
            event_id: currentEventId
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Clear form and reload comments
                form.reset();
                showSuccess('Comment added successfully!');
                loadComments();
            } else {
                throw new Error(result.message || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            showError('Failed to add comment. Please try again.');
        }
    });
}

// Load comments
async function loadComments() {
    try {
        const response = await fetch(`${API_BASE_URL}/comments?event_id=${currentEventId}`);
        const data = await response.json();
        
        if (response.ok) {
            renderComments(data.comments);
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Render comments
function renderComments(comments) {
    const commentsList = document.getElementById('commentsList');
    
    if (!comments || comments.length === 0) {
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
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showSuccess('Event deleted successfully!');
            setTimeout(() => {
                window.location.href = 'events.html';
            }, 1500);
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete event');
        }
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
        const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showSuccess('Comment deleted successfully!');
            loadComments();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete comment');
        }
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