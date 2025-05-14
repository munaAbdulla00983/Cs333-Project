// Events page functionality
let allEvents = [];
let filteredEvents = [];
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

// Fetch events data
async function fetchEvents() {
    try {
        showLoading();
        // For Phase 2, using mock data from JSONPlaceholder or local JSON
        // Replace this URL with your actual API endpoint in Phase 3
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        let data = await response.json();
        
        // Transform the data to match our event structure
        allEvents = data.slice(0, 20).map((item, index) => ({
            id: item.id,
            title: `Event ${index + 1}: ${item.title}`,
            date: generateRandomDate(),
            location: generateRandomLocation(),
            category: generateRandomCategory(),
            description: item.body,
            image_url: `https://picsum.photos/400/300?random=${index}`
        }));
        
        filteredEvents = [...allEvents];
        renderEvents();
    } catch (error) {
        console.error('Error fetching events:', error);
        showError('Failed to load events. Please try again later.');
    }
}

// Render events to the page
function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const eventsToRender = filteredEvents.slice(startIndex, endIndex);
    
    if (eventsToRender.length === 0) {
        eventsGrid.innerHTML = '<div class="no-events">No events found.</div>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    eventsGrid.innerHTML = eventsToRender.map(event => `
        <div class="event-card" onclick="viewEventDetails(${event.id})">
            <img src="${event.image_url}" alt="${event.title}" class="event-image" onerror="this.src='https://via.placeholder.com/400x300?text=Event+Image'">
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
    
    renderPagination();
}

// Render pagination
function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage - 1})">Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="pagination-btn active" disabled>${i}</button>`;
        } else {
            paginationHTML += `<button class="pagination-btn" onclick="changePage(${i})">${i}</button>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})">Next</button>`;
    }
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    renderEvents();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filterEvents(searchTerm);
}

// Handle category filter
function handleFilter(e) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filterEvents(searchTerm);
}

// Handle sort
function handleSort(e) {
    const sortValue = e.target.value;
    const [sortBy, sortOrder] = sortValue.split('-');
    
    filteredEvents.sort((a, b) => {
        if (sortBy === 'date') {
            return sortOrder === 'asc' 
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'title') {
            return sortOrder === 'asc'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        }
    });
    
    currentPage = 1;
    renderEvents();
}

// Filter events
function filterEvents(searchTerm) {
    const category = document.getElementById('categoryFilter').value;
    
    filteredEvents = allEvents.filter(event => {
        const matchesSearch = !searchTerm || 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm);
            
        const matchesCategory = !category || event.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    currentPage = 1;
    renderEvents();
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

// Mock data generators for Phase 2
function generateRandomDate() {
    const start = new Date();
    const end = new Date(new Date().setMonth(start.getMonth() + 6));
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
}

function generateRandomLocation() {
    const locations = ['Main Auditorium', 'Conference Hall A', 'Library Building', 'Sports Complex', 'Student Union', 'Science Building'];
    return locations[Math.floor(Math.random() * locations.length)];
}

function generateRandomCategory() {
    const categories = ['Academic', 'Social', 'Conference', 'Workshop', 'Sports'];
    return categories[Math.floor(Math.random() * categories.length)];
}