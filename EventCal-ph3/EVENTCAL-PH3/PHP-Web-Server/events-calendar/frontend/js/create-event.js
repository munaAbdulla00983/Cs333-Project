// Create/Edit event functionality
const API_BASE_URL = 'https://2bf4af21-20f6-44fe-ba66-948fd0375fc2-00-3ha7g7ere36hw.sisko.replit.dev/events-calendar/backend/api';
let isEditMode = false;
let editEventId = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    checkEditMode();
    setupFormValidation();
    setupEventListeners();
});

// Check if we're in edit mode
function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    editEventId = urlParams.get('edit');
    
    if (editEventId) {
        isEditMode = true;
        document.getElementById('pageTitle').textContent = 'Edit Event';
        document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Update Event';
        loadEventData(editEventId);
    }
}

// Load event data for editing
async function loadEventData(eventId) {
    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
        
        if (!response.ok) {
            throw new Error('Event not found');
        }
        
        const event = await response.json();
        
        // Populate form fields
        document.getElementById('title').value = event.title;
        document.getElementById('date').value = event.date;
        document.getElementById('location').value = event.location;
        document.getElementById('category').value = event.category;
        document.getElementById('description').value = event.description;
        document.getElementById('image_url').value = event.image_url || '';
    } catch (error) {
        console.error('Error loading event for edit:', error);
        showError('Failed to load event data. Please try again.');
        setTimeout(() => {
            window.location.href = 'events.html';
        }, 2000);
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('eventForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.parentElement.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    const form = document.getElementById('eventForm');
    const cancelBtn = document.getElementById('cancelBtn');
    
    form.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', () => {
        window.location.href = 'events.html';
    });
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const form = e.target;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        return;
    }
    
    // Get form data
    const formData = {
        title: document.getElementById('title').value,
        date: document.getElementById('date').value,
        location: document.getElementById('location').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        image_url: document.getElementById('image_url').value
    };
    
    try {
        // For edit mode, use PUT with ID in the URL path
        const url = isEditMode 
            ? `${API_BASE_URL}/events/${editEventId}`
            : `${API_BASE_URL}/events`;
            
        const method = isEditMode ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showSuccess(isEditMode ? 'Event updated successfully!' : 'Event created successfully!');
            
            // Redirect after a delay
            setTimeout(() => {
                if (result.event && result.event.id) {
                    window.location.href = `event-details.html?id=${result.event.id}`;
                } else {
                    window.location.href = 'events.html';
                }
            }, 1500);
        } else {
            showError(result.message || 'Failed to save event');
        }
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showError('Failed to save event. Please try again.');
    }
}

// Validate individual field
function validateField(field) {
    const formGroup = field.parentElement;
    const value = field.value.trim();
    let isValid = true;
    
    // Remove previous error state
    formGroup.classList.remove('error');
    
    // Check if field is empty
    if (!value) {
        isValid = false;
        formGroup.classList.add('error');
    } else {
        // Additional validation based on field type
        switch (field.id) {
            case 'title':
                if (value.length < 3) {
                    isValid = false;
                    formGroup.classList.add('error');
                    formGroup.querySelector('.error-message').textContent = 'Title must be at least 3 characters long';
                }
                break;
            case 'date':
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    isValid = false;
                    formGroup.classList.add('error');
                    formGroup.querySelector('.error-message').textContent = 'Event date cannot be in the past';
                }
                break;
            case 'description':
                if (value.length < 10) {
                    isValid = false;
                    formGroup.classList.add('error');
                    formGroup.querySelector('.error-message').textContent = 'Description must be at least 10 characters long';
                }
                break;
            case 'image_url':
                if (value && !isValidUrl(value)) {
                    isValid = false;
                    formGroup.classList.add('error');
                    formGroup.querySelector('.error-message').textContent = 'Please enter a valid URL';
                }
                break;
        }
    }
    
    return isValid;
}

// Check if URL is valid
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Show success message
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

// Show error message
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

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);