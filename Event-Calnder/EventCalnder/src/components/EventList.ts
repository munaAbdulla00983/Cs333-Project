import { Event, EventFilters } from '../models/Event';
import { EventCard } from './EventCard';
import { sortEventsByDate } from '../utils/dateUtils';

export class EventList {
  private events: Event[] = [];
  private filteredEvents: Event[] = [];
  private container: HTMLElement;
  private eventsPerPage: number = 6;
  private currentPage: number = 1;
  private filters: EventFilters = {
    searchTerm: '',
    category: 'All Categories',
    sortOrder: 'newest'
  };

  constructor(containerId: string) {
    this.container = document.getElementById(containerId) as HTMLElement;
    if (!this.container) {
      throw new Error(`Container element with ID "${containerId}" not found`);
    }
  }

  setEvents(events: Event[]): void {
    this.events = events;
    this.filteredEvents = events; // Initialize filtered events with all events
    this.renderEvents();
  }

  updateFilters(filters: Partial<EventFilters>): void {
    this.filters = { ...this.filters, ...filters };
    this.currentPage = 1; // Reset to first page when filters change
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.events];
    
    // Apply search term filter
    if (this.filters.searchTerm) {
      const searchTerm = this.filters.searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply category filter
    if (this.filters.category && this.filters.category !== 'All Categories') {
      filtered = filtered.filter(event => event.category === this.filters.category);
    }
    
    // Apply sorting
    filtered = sortEventsByDate(filtered, this.filters.sortOrder);
    
    this.filteredEvents = filtered;
    this.renderEvents();
  }

  private renderEvents(): void {
    // Clear the container
    this.container.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (this.currentPage - 1) * this.eventsPerPage;
    const eventsToShow = this.filteredEvents.slice(startIndex, startIndex + this.eventsPerPage);
    
    // Show "no events" message if no events match filters
    if (eventsToShow.length === 0) {
      const noEventsMessage = document.createElement('div');
      noEventsMessage.className = 'col-12 text-center py-4';
      noEventsMessage.innerHTML = `
        <div class="alert alert-info">
          <h5>No events found</h5>
          <p>Try adjusting your search criteria or create a new event.</p>
        </div>
      `;
      this.container.appendChild(noEventsMessage);
      return;
    }
    
    // Render events
    eventsToShow.forEach(event => {
      const eventCard = new EventCard(event);
      this.container.appendChild(eventCard.render());
    });
    
    // Render pagination if needed
    if (this.filteredEvents.length > this.eventsPerPage) {
      this.renderPagination(Math.ceil(this.filteredEvents.length / this.eventsPerPage));
    }
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.renderEvents();
  }

  private renderPagination(totalPages: number): void {
    const paginationContainer = document.createElement('nav');
    paginationContainer.setAttribute('aria-label', 'Event pagination');
    paginationContainer.className = 'mt-4';
    
    const pagination = document.createElement('div');
    pagination.className = 'pagination justify-content-center';
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = this.currentPage === 1;
    prevButton.addEventListener('click', () => this.setPage(this.currentPage - 1));
    pagination.appendChild(prevButton);
    
    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i.toString();
      pageButton.className = i === this.currentPage ? 'active' : '';
      pageButton.addEventListener('click', () => this.setPage(i));
      pagination.appendChild(pageButton);
    }
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = this.currentPage === totalPages;
    nextButton.addEventListener('click', () => this.setPage(this.currentPage + 1));
    pagination.appendChild(nextButton);
    
    paginationContainer.appendChild(pagination);
    this.container.parentElement?.appendChild(paginationContainer);
  }
  
  showLoading(): void {
    this.container.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2">Loading events...</p>
      </div>
    `;
  }
  
  showError(message: string): void {
    this.container.innerHTML = `
      <div class="col-12 text-center py-4">
        <div class="alert alert-danger">
          <h5>Error loading events</h5>
          <p>${message}</p>
          <button class="btn btn-primary mt-2" id="retry-load">Retry</button>
        </div>
      </div>
    `;
  }
}