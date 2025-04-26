// Get event ID from URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = parseInt(urlParams.get('id'));

// Mock events data (same as in events.js)
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

// Find the event
const event = events.find(e => e.id === eventId);

// Display event details
const container = document.getElementById('event-details-container');

if (event) {
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    container.innerHTML = `
        <div class="event-details">
            <div class="row">
                <div class="col-md-8">
                    <h2>${event.title}</h2>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                    <p><strong>Category:</strong> <span class="badge bg-info">${event.category}</span></p>
                    <div class="mt-4">
                        <h4>Description</h4>
                        <p>${event.description}</p>
                    </div>
                    
                    <div class="mt-4">
                        <a href="events.html" class="btn btn-primary">Back to Events</a>
                    </div>
                </div>
                <div class="col-md-4">
                    <img src="${event.imageUrl}" alt="${event.title}" class="img-fluid rounded">
                </div>
            </div>
        </div>
    `;
} else {
    container.innerHTML = `
        <div class="alert alert-danger">
            <h5>Error</h5>
            <p>Event not found</p>
            <a href="events.html" class="btn btn-primary mt-2">Back to Events</a>
        </div>
    `;
}