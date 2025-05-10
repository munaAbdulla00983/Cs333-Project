import { Event } from '../models/Event';
import { formatDate } from '../utils/dateUtils';

export class EventCard {
  private event: Event;

  constructor(event: Event) {
    this.event = event;
  }

  render(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    
    const formattedDate = formatDate(this.event.date);
    
    card.innerHTML = `
      <div class="card h-100">
        <img src="${this.event.imageUrl}" class="card-img-top" alt="${this.event.title}" style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${this.event.title}</h5>
          <p class="card-text"><strong>Date:</strong> ${formattedDate}</p>
          <p class="card-text"><strong>Location:</strong> ${this.event.location}</p>
          <span class="badge bg-info mb-2">${this.event.category}</span>
          <div class="mt-2">
            <a href="#" class="btn btn-primary view-details" data-id="${this.event.id}">View Details</a>
          </div>
        </div>
      </div>
    `;
    
    // Add click event for view details
    const viewDetailsBtn = card.querySelector('.view-details');
    viewDetailsBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigateToEventDetails(this.event.id);
    });
    
    return card;
  }
  
  private navigateToEventDetails(eventId: number): void {
    window.location.href = `event-details.html?id=${eventId}`;
  }
}