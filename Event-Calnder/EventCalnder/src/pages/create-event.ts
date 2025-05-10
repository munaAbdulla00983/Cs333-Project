import { EventForm } from '../components/EventForm';
import { fetchEventById } from '../services/api';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize event form
  const eventForm = new EventForm('event-form');
  
  // Check if editing existing event
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  
  if (eventId) {
    // Set page title for editing
    document.title = 'Edit Event';
    document.querySelector('h1')!.textContent = 'Edit Event';
    document.querySelector('h2')!.textContent = 'Edit Event';
    
    // Show loading state
    const formContainer = document.getElementById('form-container')!;
    formContainer.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading event data...</p>
      </div>
    `;
    
    try {
      // Fetch event data
      const event = await fetchEventById(parseInt(eventId));
      
      if (!event) {
        // Show error
        formContainer.innerHTML = `
          <div class="alert alert-danger">
            <h5>Error</h5>
            <p>Event not found</p>
            <a href="events.html" class="btn btn-primary mt-2">Back to Events</a>
          </div>
        `;
        return;
      }
      
      // Restore form
      formContainer.innerHTML = `
        <h2>Edit Event</h2>
        <form id="event-form" class="needs-validation" novalidate>
            <div class="mb-3">
                <label for="eventName" class="form-label">Event Name</label>
                <input type="text" class="form-control" id="eventName" placeholder="Enter event name" required>
            </div>
            <div class="mb-3">
                <label for="eventDate" class="form-label">Event Date</label>
                <input type="date" class="form-control" id="eventDate" required>
            </div>
            <div class="mb-3">
                <label for="eventLocation" class="form-label">Location</label>
                <input type="text" class="form-control" id="eventLocation" placeholder="Enter event location" required>
            </div>
            <div class="mb-3">
                <label for="eventCategory" class="form-label">Category</label>
                <select class="form-select" id="eventCategory" required>
                    <option value="" selected disabled>Select a category</option>
                    <option value="Academic">Academic</option>
                    <option value="Social">Social</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Conference">Conference</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Sports">Sports</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="eventDescription" class="form-label">Description</label>
                <textarea class="form-control" id="eventDescription" rows="4" required
                  placeholder="Provide details about the event including what attendees can expect"></textarea>
            </div>
            <div class="d-flex">
                <button type="submit" class="btn btn-primary">Update Event</button>
                <a href="events.html" class="btn btn-secondary ms-2">Cancel</a>
            </div>
        </form>
      `;
      
      // Reinitialize form with new DOM elements
      const updatedEventForm = new EventForm('event-form');
      
      // Set event data
      updatedEventForm.setEvent(event);
      
    } catch (error) {
      console.error('Error loading event:', error);
      
      // Show error
      formContainer.innerHTML = `
        <div class="alert alert-danger">
          <h5>Error</h5>
          <p>Failed to load event data. Please try again later.</p>
          <a href="events.html" class="btn btn-primary mt-2">Back to Events</a>
        </div>
      `;
    }
  }
});