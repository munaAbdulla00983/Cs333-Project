import { Event } from '../models/Event';
import { fetchEventById, deleteEvent } from '../services/api';
import { formatDate } from '../utils/dateUtils';

export class EventDetails {
  private container: HTMLElement;
  private event: Event | null = null;
  private commentsSection: HTMLElement | null = null;
  
  constructor(containerId: string) {
    this.container = document.getElementById(containerId) as HTMLElement;
    if (!this.container) {
      throw new Error(`Container element with ID "${containerId}" not found`);
    }
    
    this.commentsSection = document.getElementById('comments-section');
  }
  
  async loadEvent(id: number): Promise<void> {
    try {
      this.showLoading();

      // Fetch event data
      this.event = await fetchEventById(id);

      if (!this.event) {
        this.showError('Event not found. Please check the event ID or return to the events list.');
        return;
      }

      this.renderEvent();
    } catch (error) {
      console.error('Error loading event:', error);
      this.showError('Failed to load event details. Please try again later.');
    }
  }
  
  private renderEvent(): void {
    if (!this.event) return;
    
    // Update page title
    document.title = `${this.event.title} - Event Details`;
    
    // Format date
    const formattedDate = formatDate(this.event.date);
    
    // Render event details
    this.container.innerHTML = `
      <div class="event-details">
        <div class="row">
          <div class="col-md-8">
            <h2>${this.event.title}</h2>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Location:</strong> ${this.event.location}</p>
            <p><strong>Category:</strong> <span class="badge bg-info">${this.event.category}</span></p>
            <div class="mt-4">
              <h4>Description</h4>
              <p>${this.event.description}</p>
            </div>
            
            <div class="mt-4 d-flex">
              <button id="edit-event" class="btn btn-primary">Edit Event</button>
              <button id="delete-event" class="btn btn-danger ms-2">Delete Event</button>
              <a href="events.html" class="btn btn-secondary ms-2">Back to Events</a>
            </div>
          </div>
          <div class="col-md-4">
            <img src="${this.event.imageUrl}" alt="${this.event.title}" class="img-fluid rounded">
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    const editBtn = document.getElementById('edit-event');
    const deleteBtn = document.getElementById('delete-event');
    
    editBtn?.addEventListener('click', () => this.navigateToEditEvent());
    deleteBtn?.addEventListener('click', () => this.handleDeleteEvent());
    
    // Render comments section
    this.renderComments();
  }
  
  private renderComments(): void {
    if (!this.commentsSection) return;
    
    this.commentsSection.innerHTML = `
      <div class="mt-5">
        <h4>Comments</h4>
        <div id="comments-list" class="mb-3">
          <div class="card mb-2">
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted">John Doe • 2 days ago</h6>
              <p class="card-text">This event looks amazing! I can't wait to attend.</p>
            </div>
          </div>
          <div class="card mb-2">
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted">Jane Smith • 1 day ago</h6>
              <p class="card-text">Will there be parking available at the venue?</p>
            </div>
          </div>
        </div>
        
        <div class="comment-form">
          <h5>Add a Comment</h5>
          <div class="mb-3">
            <textarea id="comment-text" class="form-control" rows="3" placeholder="Write your comment here..."></textarea>
            <div id="comment-error" class="invalid-feedback"></div>
          </div>
          <button id="post-comment" class="btn btn-primary">Post Comment</button>
        </div>
      </div>
    `;
    
    // Add event listener to comment form
    const commentTextarea = document.getElementById('comment-text') as HTMLTextAreaElement;
    const commentError = document.getElementById('comment-error');
    const postCommentBtn = document.getElementById('post-comment');
    
    postCommentBtn?.addEventListener('click', () => {
      const comment = commentTextarea.value.trim();
      
      if (!comment) {
        commentTextarea.classList.add('is-invalid');
        if (commentError) commentError.textContent = 'Please enter a comment';
        return;
      }
      
      // Clear validation
      commentTextarea.classList.remove('is-invalid');
      
      // Add comment to list (in a real app, this would be sent to the server)
      const commentsList = document.getElementById('comments-list');
      const now = new Date();
      
      if (commentsList) {
        const newComment = document.createElement('div');
        newComment.className = 'card mb-2';
        newComment.innerHTML = `
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted">You • just now</h6>
            <p class="card-text">${comment}</p>
          </div>
        `;
        commentsList.prepend(newComment);
      }
      
      // Clear textarea
      commentTextarea.value = '';
      
      // Show success message
      this.showToast('Comment posted successfully!');
    });
  }
  
  private navigateToEditEvent(): void {
    if (!this.event) return;
    window.location.href = `create-event.html?id=${this.event.id}`;
  }
  
  private async handleDeleteEvent(): Promise<void> {
    if (!this.event) return;
    
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete "${this.event.title}"?`)) {
      return;
    }
    
    try {
      // Show loading state
      this.container.innerHTML = `
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Deleting event...</span>
          </div>
          <p class="mt-2">Deleting event...</p>
        </div>
      `;
      
      // Delete event
      await deleteEvent(this.event.id);
      
      // Show success message
      alert('Event deleted successfully!');
      
      // Redirect to events list
      window.location.href = 'events.html';
    } catch (error) {
      console.error('Error deleting event:', error);
      this.showError('Failed to delete event. Please try again.');
    }
  }
  
  private showLoading(): void {
    this.container.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading event details...</p>
      </div>
    `;
  }
  
  private showError(message: string): void {
    this.container.innerHTML = `
      <div class="alert alert-danger">
        <h5>Error</h5>
        <p>${message}</p>
        <a href="events.html" class="btn btn-primary mt-2">Back to Events</a>
      </div>
    `;
  }
  
  private showToast(message: string): void {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toastId = `toast-${Date.now()}`;
    const toastEl = document.createElement('div');
    toastEl.className = 'toast show';
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.id = toastId;
    
    toastEl.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">Notification</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toastEl);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      toastEl.remove();
    }, 3000);
  }
}