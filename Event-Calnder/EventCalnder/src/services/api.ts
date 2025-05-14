import { Event } from '../models/Event';

const API_URL = 'https://my-json-server.typicode.com/your-username/events-api';
const MOCK_DATA_DELAY = 800; // Simulate network delay

// Simulated events data for development
const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Tech Conference 2025',
    date: '2025-05-15',
    location: 'UOB Convention Center',
    description: 'Join us for the biggest tech event of the year, featuring industry leaders, workshops, and cutting-edge innovations. Network with professionals, attend hands-on sessions, and learn about the latest technological trends.',
    category: 'Conference',
    imageUrl: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg'
  },
  {
    id: 2,
    title: 'UOB Registration',
    date: '2025-03-20',
    location: 'Bahrain',
    description: 'University registration for new and returning students. Important documents and deadlines will be discussed. Make sure to bring all required paperwork and student ID.',
    category: 'Academic',
    imageUrl: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg'
  },
  {
    id: 3,
    title: 'Spring Campus Festival',
    date: '2025-04-10',
    location: 'Main Campus Grounds',
    description: 'Annual spring festival with music, food stalls, and recreational activities for all students. Join us for a day of fun, entertainment, and community building.',
    category: 'Social',
    imageUrl: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg'
  },
  {
    id: 4,
    title: 'Research Symposium',
    date: '2025-06-20',
    location: 'Science Building Auditorium',
    description: 'A platform for students and faculty to present their latest research findings and innovations. Network with fellow researchers and learn about groundbreaking discoveries.',
    category: 'Academic',
    imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'
  }
];

/**
 * Fetch all events
 */
export const fetchEvents = async (): Promise<Event[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, MOCK_DATA_DELAY));
    return mockEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Fetch a single event by ID
 */
export const fetchEventById = async (id: number): Promise<Event | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, MOCK_DATA_DELAY));
    const event = mockEvents.find(e => e.id === id);
    return event || null;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new event
 */
export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  try {
    await new Promise(resolve => setTimeout(resolve, MOCK_DATA_DELAY));
    const newEvent: Event = {
      ...event,
      id: mockEvents.length + 1
    };
    mockEvents.push(newEvent);
    return newEvent;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Update an existing event
 */
export const updateEvent = async (event: Event): Promise<Event> => {
  try {
    await new Promise(resolve => setTimeout(resolve, MOCK_DATA_DELAY));
    const index = mockEvents.findIndex(e => e.id === event.id);
    if (index === -1) throw new Error(`Event ${event.id} not found`);
    mockEvents[index] = event;
    return event;
  } catch (error) {
    console.error(`Error updating event ${event.id}:`, error);
    throw error;
  }
};

/**
 * Delete an event
 */
export const deleteEvent = async (id: number): Promise<void> => {
  try {
    await new Promise(resolve => setTimeout(resolve, MOCK_DATA_DELAY));
    const index = mockEvents.findIndex(e => e.id === id);
    if (index === -1) throw new Error(`Event ${id} not found`);
    mockEvents.splice(index, 1);
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    throw error;
  }
};