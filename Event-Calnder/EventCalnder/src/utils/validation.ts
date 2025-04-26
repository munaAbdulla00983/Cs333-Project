interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateEventForm = (formData: Record<string, string>): ValidationResult => {
  const errors: Record<string, string> = {};

  // Validate event name
  if (!formData.title?.trim()) {
    errors.title = 'Event name is required';
  } else if (formData.title.length < 3) {
    errors.title = 'Event name must be at least 3 characters long';
  }

  // Validate date
  if (!formData.date?.trim()) {
    errors.date = 'Event date is required';
  } else {
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time portion for fair comparison
    
    if (selectedDate < today) {
      errors.date = 'Event date cannot be in the past';
    }
  }

  // Validate location
  if (!formData.location?.trim()) {
    errors.location = 'Location is required';
  }

  // Validate description
  if (!formData.description?.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.length < 20) {
    errors.description = 'Description must be at least 20 characters long';
  }

  // Validate category
  if (!formData.category?.trim() || formData.category === 'All Categories') {
    errors.category = 'Please select a category';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};