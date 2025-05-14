import { EventDetails } from '../components/EventDetails';

document.addEventListener('DOMContentLoaded', () => {
  // Get event ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  
  if (!eventId) {
    // Redirect to events list if no ID provided
    window.location.href = 'events.html';
    return;
  }
  
  // Initialize event details
  const eventDetails = new EventDetails('event-details-container');
  
  // Load event data
  eventDetails.loadEvent(parseInt(eventId));
});