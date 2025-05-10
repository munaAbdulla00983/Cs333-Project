// Mock events data
const events = [
    {
        id: 1,
        title: 'Tech Conference 2025',
        date: '2025-05-15',
        location: 'UOB Convention Center',
        description: 'Join us for the biggest tech event of the year, featuring industry leaders, workshops, and cutting-edge innovations.',
        category: 'Conference',
        imageUrl: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg'
    },
    {
        id: 2,
        title: 'UOB Registration',
        date: '2025-03-20',
        location: 'Bahrain',
        description: 'University registration for new and returning students. Important documents and deadlines will be discussed.',
        category: 'Academic',
        imageUrl: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg'
    },
    {
        id: 3,
        title: 'Spring Campus Festival',
        date: '2025-04-10',
        location: 'Main Campus Grounds',
        description: 'Annual spring festival with music, food stalls, and recreational activities.',
        category: 'Social',
        imageUrl: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg'
    },
    {
        id: 4,
        title: 'Research Symposium',
        date: '2025-06-20',
        location: 'Science Building Auditorium',
        description: 'A platform for students and faculty to present their latest research findings.',
        category: 'Academic',
        imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'
    }
];

// Functions
function filterEvents() {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortOrder = document.getElementById('sort-order');
    
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const category = categoryFilter?.value || 'All Categories';
    const sort = sortOrder?.value || 'newest';

    let filtered = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                            event.description.toLowerCase().includes(searchTerm) ||
                            event.location.toLowerCase().includes(searchTerm);
        
        const matchesCategory = category === 'All Categories' || event.category === category;
        
        return matchesSearch && matchesCategory;
    });

    // Sort events
    filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    displayEvents(filtered);
}

function displayEvents(eventsToShow) {
    const eventList = document.getElementById('event-list');
    if (!eventList) return;
    
    eventList.innerHTML = '';
    
    if (eventsToShow.length === 0) {
        eventList.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    No events found. Try adjusting your search criteria.
                </div>
            </div>
        `;
        return;
    }

    eventsToShow.forEach(event => {
        const eventCard = createEventCard(event);
        eventList.appendChild(eventCard);
    });
}

function createEventCard(event) {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    col.innerHTML = `
        <div class="card h-100">
            <img src="${event.imageUrl}" class="card-img-top" alt="${event.title}" style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${event.title}</h5>
                <p class="card-text"><strong>Date:</strong> ${formattedDate}</p>
                <p class="card-text"><strong>Location:</strong> ${event.location}</p>
                <span class="badge bg-info mb-2">${event.category}</span>
                <div class="mt-2">
                    <a href="event-details.html?id=${event.id}" class="btn btn-primary">View Details</a>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const categoryFilter = document.getElementById('category-filter');
    const sortOrder = document.getElementById('sort-order');

    // Event Listeners - only attach if elements exist
    if (searchBtn) {
        searchBtn.addEventListener('click', filterEvents);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterEvents);
    }
    
    if (sortOrder) {
        sortOrder.addEventListener('change', filterEvents);
    }

    // Initial display - only if we're on the events page
    const eventList = document.getElementById('event-list');
    if (eventList) {
        displayEvents(events);
    }
});