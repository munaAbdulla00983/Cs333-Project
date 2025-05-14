// Events page functionality
const API_BASE_URL = 'http://localhost:8000/backend/api';
let currentPage = 1;
const eventsPerPage = 9;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    fetchEvents();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');
    
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    categoryFilter.addEventListener('change', handleFilter);
    sortSelect.addEventListener('change', handleSort);
}

// Fetch events data from actual backend
async function fetchEvents() {
    try {
        showLoading();
        
        // Build query parameters
        const params = new URLSearchParams({
            page: currentPage,
            limit: eventsPerPage
        });
        
        // Add search term if exists
        const searchInput = document.getElementById('searchInput');
        if (searchInput.value) {
            params.append('search', searchInput.value);
        }
        
        // Add category filter if selected
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter.value) {
            params.append('category', categoryFilter.value);
        }
        
        // Add sorting
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect.value) {
            const [sort, order] = sortSelect.value.split('-');
            params.append('sort', sort);
            params.append('order', order.toUpperCase());
        }
        
        const response = await fetch(`${API_BASE_URL}/events?${params}`);
        const data = await response.json();
        
        if (response.ok) {
            renderEvents(data);
        } else {
            throw new Error(data.message || 'Failed to load events');
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        showError('Failed to load events. Please try again later.');
    }
}

// Render events to the page
function renderEvents(data) {
    const eventsGrid = document.getElementById('eventsGrid');
    
    if (!data.events || data.events.length === 0) {
        eventsGrid.innerHTML = '<div class="no-events">No events found.</div>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    eventsGrid.innerHTML = data.events.map(event => `
        <div class="event-card" onclick="viewEventDetails(${event.id})">
            <img src="${event.image_url || 'https://via.placeholder.com/400x300?text=Event+Image'}" 
                 alt="${event.title}" 
                 class="event-image" 
                 onerror="this.src='https://via.placeholder.com/400x300?text=Event+Image'">
            <div class="event-content">
                <h3>${event.title}</h3>
                <div class="event-meta">
                    <div class="event-meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(event.date)}</span>
                    </div>
                    <div class="event-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                </div>
                <span class="event-category">${event.category}</span>
            </div>
        </div>
    `).join('');
    
    renderPagination(data);
}

// Render pagination
function renderPagination(data) {
    const pagination = document.getElementById('pagination');
    const { page, pages, total } = data;
    
    if (pages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (page > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${page - 1})">Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= pages; i++) {
        if (i === page) {
            paginationHTML += `<button class="pagination-btn active" disabled>${i}</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn" onclick="changePage(${i})">${i}</button>`;
        }
    }
    
    // Next button
    if (page < pages) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${page + 1})">Next</button>`;
    }
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    fetchEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle search
function handleSearch(e) {
    currentPage = 1;
    fetchEvents();
}

// Handle category filter
function handleFilter(e) {
    currentPage = 1;
    fetchEvents();
}

// Handle sort
function handleSort(e) {
    currentPage = 1;
    fetchEvents();
}

// View event details
function viewEventDetails(eventId) {
    window.location.href = `event-details.html?id=${eventId}`;
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

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading() {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = '<div class="loading">Loading events...</div>';
}

function showError(message) {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = `<div class="error-message-box">${message}</div>`;
}