import { Event } from '../models/Event';
import { createEvent, updateEvent } from '../services/api';
import { validateEventForm } from '../utils/validation';
import { categories } from '../models/Event';

export class EventForm {
  private form: HTMLFormElement;
  private titleInput: HTMLInputElement;
  private dateInput: HTMLInputElement;
  private locationInput: HTMLInputElement;
  private descriptionInput: HTMLTextAreaElement;
  private categoryInput: HTMLSelectElement;
  private submitButton: HTMLButtonElement;
  private errorContainer: HTMLDivElement;
  private isEditMode: boolean = false;
  private eventId: number | null = null;

  constructor(formId: string) {
    this.form = document.getElementById(formId) as HTMLFormElement;
    if (!this.form) {
      throw new Error(`Form with ID "${formId}" not found`);
    }

    // Get form elements
    this.titleInput = this.form.querySelector('#eventName') as HTMLInputElement;
    this.dateInput = this.form.querySelector('#eventDate') as HTMLInputElement;
    this.locationInput = this.form.querySelector('#eventLocation') as HTMLInputElement;
    this.descriptionInput = this.form.querySelector('#eventDescription') as HTMLTextAreaElement;
    this.categoryInput = this.form.querySelector('#eventCategory') as HTMLSelectElement;
    this.submitButton = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;

    // Create error container if it doesn't exist
    this.errorContainer = document.createElement('div');
    this.errorContainer.className = 'alert alert-danger d-none mt-3';
    this.form.prepend(this.errorContainer);
    
    // Add category options if they don't exist
    if (!this.categoryInput.options.length) {
      this.populateCategoryOptions();
    }
    
    // Set up validation on input change
    this.setupValidation();
    
    // Set up form submission
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  private populateCategoryOptions(): void {
    // Clear existing options
    this.categoryInput.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a category';
    defaultOption.selected = true;
    defaultOption.disabled = true;
    this.categoryInput.appendChild(defaultOption);
    
    // Add category options
    categories.forEach(category => {
      if (category !== 'All Categories') {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        this.categoryInput.appendChild(option);
      }
    });
  }

  private setupValidation(): void {
    // Set min date to today
    const today = new Date();
    this.dateInput.min = today.toISOString().split('T')[0];
    
    // Add validation to inputs
    [this.titleInput, this.dateInput, this.locationInput, this.descriptionInput, this.categoryInput].forEach(
      input => input.addEventListener('input', () => this.validateField(input))
    );
  }

  private validateField(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
    // Get current form data
    const formData = this.getFormData();
    
    // Validate form
    const validation = validateEventForm(formData);
    
    // Show error for this field if it exists
    const fieldName = input.id.replace('event', '').toLowerCase();
    const errorMessage = validation.errors[fieldName];
    
    // Update input validity state
    if (errorMessage) {
      input.setCustomValidity(errorMessage);
      input.classList.add('is-invalid');
      
      // Show error message
      const feedbackElement = input.nextElementSibling?.classList.contains('invalid-feedback')
        ? input.nextElementSibling
        : document.createElement('div');
      
      if (!input.nextElementSibling?.classList.contains('invalid-feedback')) {
        feedbackElement.className = 'invalid-feedback';
        input.parentNode?.insertBefore(feedbackElement, input.nextSibling);
      }
      
      feedbackElement.textContent = errorMessage;
    } else {
      input.setCustomValidity('');
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      
      // Remove error message if it exists
      const feedbackElement = input.nextElementSibling;
      if (feedbackElement?.classList.contains('invalid-feedback')) {
        feedbackElement.textContent = '';
      }
    }
  }

  private getFormData(): Record<string, string> {
    return {
      title: this.titleInput.value,
      date: this.dateInput.value,
      location: this.locationInput.value,
      description: this.descriptionInput.value,
      category: this.categoryInput.value
    };
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    // Get form data
    const formData = this.getFormData();
    
    // Validate form
    const validation = validateEventForm(formData);
    
    if (!validation.isValid) {
      // Show validation errors
      this.showErrors(validation.errors);
      return;
    }
    
    // Clear errors
    this.clearErrors();
    
    // Show loading state
    this.setLoading(true);
    
    try {
      if (this.isEditMode && this.eventId) {
        // Update existing event
        await updateEvent({
          id: this.eventId,
          title: formData.title,
          date: formData.date,
          location: formData.location,
          description: formData.description,
          category: formData.category,
          imageUrl: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg' // Default image if not provided
        });
        
        alert('Event updated successfully!');
      } else {
        // Create new event
        await createEvent({
          title: formData.title,
          date: formData.date,
          location: formData.location,
          description: formData.description,
          category: formData.category,
          imageUrl: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg' // Default image if not provided
        });
        
        alert('Event created successfully!');
        this.form.reset();
      }
      
      // Redirect to events list
      window.location.href = 'events.html';
    } catch (error) {
      console.error('Error saving event:', error);
      this.showError('Failed to save event. Please try again.');
    } finally {
      this.setLoading(false);
    }
  }

  setEvent(event: Event): void {
    this.isEditMode = true;
    this.eventId = event.id;
    
    // Update form title
    const formTitle = document.querySelector('h2');
    if (formTitle) {
      formTitle.textContent = 'Edit Event';
    }
    
    // Update submit button
    this.submitButton.textContent = 'Update Event';
    
    // Populate form fields
    this.titleInput.value = event.title;
    this.dateInput.value = event.date;
    this.locationInput.value = event.location;
    this.descriptionInput.value = event.description;
    this.categoryInput.value = event.category;
  }

  private showErrors(errors: Record<string, string>): void {
    // Show individual field errors
    Object.entries(errors).forEach(([field, message]) => {
      const inputId = `event${field.charAt(0).toUpperCase() + field.slice(1)}`;
      const input = this.form.querySelector(`#${inputId}`);
      if (input) {
        input.classList.add('is-invalid');
        
        // Add error message
        const feedbackElement = input.nextElementSibling?.classList.contains('invalid-feedback')
          ? input.nextElementSibling
          : document.createElement('div');
        
        if (!input.nextElementSibling?.classList.contains('invalid-feedback')) {
          feedbackElement.className = 'invalid-feedback';
          input.parentNode?.insertBefore(feedbackElement, input.nextSibling);
        }
        
        feedbackElement.textContent = message;
      }
    });
    
    // Show summary error
    this.errorContainer.classList.remove('d-none');
    this.errorContainer.innerHTML = `
      <h5>Please fix the following errors:</h5>
      <ul>
        ${Object.values(errors).map(error => `<li>${error}</li>`).join('')}
      </ul>
    `;
    
    // Scroll to error container
    this.errorContainer.scrollIntoView({ behavior: 'smooth' });
  }

  private showError(message: string): void {
    this.errorContainer.classList.remove('d-none');
    this.errorContainer.innerHTML = `<p>${message}</p>`;
    this.errorContainer.scrollIntoView({ behavior: 'smooth' });
  }

  private clearErrors(): void {
    // Hide error container
    this.errorContainer.classList.add('d-none');
    this.errorContainer.innerHTML = '';
    
    // Clear field errors
    [this.titleInput, this.dateInput, this.locationInput, this.descriptionInput, this.categoryInput].forEach(input => {
      input.classList.remove('is-invalid');
      const feedbackElement = input.nextElementSibling;
      if (feedbackElement?.classList.contains('invalid-feedback')) {
        feedbackElement.textContent = '';
      }
    });
  }

  private setLoading(isLoading: boolean): void {
    if (isLoading) {
      this.submitButton.disabled = true;
      this.submitButton.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Saving...
      `;
    } else {
      this.submitButton.disabled = false;
      this.submitButton.textContent = this.isEditMode ? 'Update Event' : 'Create Event';
    }
  }
}