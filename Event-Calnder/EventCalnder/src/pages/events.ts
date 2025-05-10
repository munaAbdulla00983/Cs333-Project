import { Event, EventFilters } from '../models/Event';
import { fetchEvents } from '../services/api';
import { EventList } from '../components/EventList';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize event list
  const eventList = new EventList('event-list');
  
  // Get filter elements
  const searchInput = document.getElementById('search-input') as HTMLInputElement;
  const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;
  const sortOrder = document.getElementById('sort-order') as HTMLSelectElement;
  
  // Show loading state
  eventList.showLoading();
  
  // Load events
  loadEvents(eventList);
  
  // Set up filter event listeners
  searchInput.addEventListener('input', () => {
    applyFilters(eventList, searchInput, categoryFilter, sortOrder);
  });
  
  categoryFilter.addEventListener('change', () => {
    applyFilters(eventList, searchInput, categoryFilter, sortOrder);
  });
  
  sortOrder.addEventListener('change', () => {
    applyFilters(eventList, searchInput, categoryFilter, sortOrder);
  });
});

/**
 * Load events from API
 */
async function loadEvents(eventList: EventList): Promise<void> {
  try {
    const events = await fetchEvents();
    eventList.setEvents(events);
  } catch (error) {
    console.error('Error loading events:', error);
    eventList.showError('Failed to load events. Please try again later.');
  }
}

/**
 * Apply filters to event list
 */
function applyFilters(
  eventList: EventList,
  searchInput: HTMLInputElement,
  categoryFilter: HTMLSelectElement,
  sortOrder: HTMLSelectElement
): void {
  const filters: EventFilters = {
    searchTerm: searchInput.value,
    category: categoryFilter.value,
    sortOrder: sortOrder.value as 'newest' | 'oldest'
  };
  
  eventList.updateFilters(filters);
}