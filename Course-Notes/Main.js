// Base API URL (same for all operations)
const apiUrl = 'https://680d00cd2ea307e081d5b19c.mockapi.io/Notes/';

// Global variables for pagination
let currentPage = 1;
let totalPages = 1;

// Function to fetch notes from the API
const fetchNotes = async (page = 1) => {
  try {
    const response = await fetch(`${apiUrl}?page=${page}&limit=5`);
    const data = await response.json();

    // Update the total number of pages based on the response headers (if available)
    totalPages = Math.ceil(parseInt(response.headers.get('x-total-count')) / 5);

    // Clear the current notes
    const notesGrid = document.getElementById('notes-grid');
    notesGrid.innerHTML = '';

    // Add the fetched notes to the grid
    data.forEach(note => {
      const noteCard = document.createElement('article');
      noteCard.classList.add('note-card');
      noteCard.innerHTML = `
        <h2 class="note-title">${note.title}</h2>
        <p class="note-desc">${note.description}</p>
        <a href="detail.html?id=${note.id}" class="note-link">View Details</a>
      `;
      notesGrid.appendChild(noteCard);
    });

    // Enable or disable pagination buttons based on the current page
    document.getElementById('prev-btn').disabled = page <= 1;
    document.getElementById('next-btn').disabled = page >= totalPages;

    // Update page number
    currentPage = page;
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
};

// Function to fetch a single note by ID (for the detail page)
const fetchNoteDetails = async (id) => {
  try {
    const response = await fetch(`${apiUrl}${id}`);
    const note = await response.json();

    // Populate the note details in the article
    const noteDetails = document.getElementById('note-details');
    noteDetails.innerHTML = `
      <h2 class="note-title">${note.title}</h2>
      <p><strong>Subject:</strong> ${note.subject}</p>
      <p><strong>Description:</strong> ${note.description}</p>
      <p><strong>Download:</strong> <a href="${note.link}" class="note-link">Download Link</a></p>
      <div class="form-actions">
        <button class="btn btn-secondary" onclick="editNote(${note.id})">Edit</button>
        <button class="btn btn-danger" onclick="deleteNote(${note.id})">Delete</button>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching note details:', error);
  }
};

// Function to create a new note
const createNote = async (event) => {
  event.preventDefault();

  const title = document.getElementById('note-title').value;
  const subject = document.getElementById('note-subject').value;
  const description = document.getElementById('note-description').value;
  const link = document.getElementById('note-link').value;

  const newNote = {
    title,
    subject,
    description,
    link,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    });

    const data = await response.json();
    alert('Note created successfully!');
    window.location.href = 'index.html'; // Redirect to the notes list page
  } catch (error) {
    console.error('Error creating note:', error);
  }
};

// Function to delete a note
const deleteNote = async (id) => {
  if (confirm('Are you sure you want to delete this note?')) {
    try {
      await fetch(`${apiUrl}${id}`, {
        method: 'DELETE',
      });

      alert('Note deleted successfully!');
      window.location.href = 'index.html'; // Redirect to the notes list page
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }
};

// Function to edit a note (this will open the form with pre-filled values)
// Placeholder function for now
const editNote = (id) => {
  alert('Edit functionality not yet implemented!');
};

// Event listener for the "Prev" and "Next" buttons for pagination
document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentPage > 1) {
    fetchNotes(currentPage - 1);
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  if (currentPage < totalPages) {
    fetchNotes(currentPage + 1);
  }
});

// Event listener for the note creation form submission
const createNoteForm = document.getElementById('create-note-form');
if (createNoteForm) {
  createNoteForm.addEventListener('submit', createNote);
}

// Check if we are on the index page (display notes) or detail page (fetch note details)
if (document.getElementById('notes-grid')) {
  fetchNotes(currentPage); // Fetch and display notes when the index page is loaded
}

const urlParams = new URLSearchParams(window.location.search);
const noteId = urlParams.get('id');
if (noteId && document.getElementById('note-details')) {
  fetchNoteDetails(noteId); // Fetch and display the note details when on the detail page
}
