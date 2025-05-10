/**
 * Format date string (YYYY-MM-DD) to a more readable format
 */
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

/**
 * Convert date string to ISO format for input fields
 */
export const toISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Check if a date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day
  
  const date = new Date(dateString);
  return date >= today;
};

/**
 * Sort events by date
 */
export const sortEventsByDate = (events: any[], order: 'newest' | 'oldest' = 'newest'): any[] => {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    return order === 'newest' ? dateB - dateA : dateA - dateB;
  });
};