export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  category: string;
  imageUrl: string;
}

export interface EventFilters {
  searchTerm: string;
  category: string;
  sortOrder: 'newest' | 'oldest';
}

export const categories = [
  'All Categories',
  'Academic',
  'Social',
  'Workshop',
  'Conference',
  'Seminar',
  'Sports'
];