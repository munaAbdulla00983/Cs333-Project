// Detect the page and run the appropriate function
const path = window.location.pathname;

if (path.includes('index.html') || path.endsWith('/')) {
  initIndexPage();
} else if (path.includes('create.html')) {
  initCreatePage();
} else if (path.includes('detail.html')) {
  initDetailPage();
}

// --- Index page initialization ---
function initIndexPage() {
  // Handle search functionality, sorting, and rendering the list of notes
  document.querySelector('.search-input').addEventListener('input', searchNotes);
  document.querySelector('.btn-primary').addEventListener('click', () => {
    window.location.href = 'create.html';
  });

  // Fetch and render notes list (for demo purposes)
  fetchNotes();
}

function fetchNotes() {
  // Example: Fetch notes (replace this with actual API call)
  const notes = [
    { title: 'Intro to Programming', description: 'Basic concepts...', link: '#' },
    { title: 'Database Systems', description: 'SQL, normalization...', link: '#' },
  ];
  const notesGrid = document.querySelector('.notes-grid');

  notesGrid.innerHTML = '';
  
  notes.forEach(note => {
    const noteCard = document.createElement('article');
    noteCard.classList.add('note-card');
    noteCard.innerHTML = `
      <h2 class="note-title">${note.title}</h2>
      <p class="note-desc">${note.description}</p>
      <a href="${note.link}" class="note-link">View Details</a>
    `;
    notesGrid.appendChild(noteCard);
  });
}

// --- Create page initialization ---
function initCreatePage() {
  const form = document.querySelector('.form');
  form.addEventListener('submit', handleSubmit);
}

function handleSubmit(event) {
  event.preventDefault();

  const title = document.querySelector('#note-title').value;
  const subject = document.querySelector('#note-subject').value;
  const description = document.querySelector('#note-description').value;
  const link = document.querySelector('#note-link').value;

  // Validate fields (simple validation)
  if (!title || !subject) {
    alert('Title and subject are required!');
    return;
  }

  // Here you can implement saving the note, e.g., to a server or local storage
  console.log({ title, subject, description, link });

  // Redirect back to index
  window.location.href = 'index.html';
}

// --- Detail page initialization ---
function initDetailPage() {
  // Fetch and render note details (this should be dynamically fetched or passed)
  const noteTitle = 'Database Systems - ER Modeling';
  const noteSubject = 'Database Systems';
  const noteDescription = 'These notes cover Entity-Relationship modeling concepts, with diagrams and examples.';
  const noteLink = '#';

  // Populate the page with the note details
  document.querySelector('.note-title').textContent = noteTitle;
  document.querySelector('.note-desc').textContent = noteDescription;
  document.querySelector('.note-link').href = noteLink;
  document.querySelector('.note-link').textContent = 'ER_Notes.pdf';

  // Handle edit and delete buttons
  document.querySelector('.btn-secondary').addEventListener('click', handleEdit);
  document.querySelector('.btn-danger').addEventListener('click', handleDelete);
}

function handleEdit() {
  // Redirect to the edit page (or open edit form, depending on your app structure)
  alert('Edit functionality not implemented');
}

function handleDelete() {
  // Delete the note (this can be an API call or local storage operation)
  alert('Delete functionality not implemented');
}

// --- Search functionality ---
function searchNotes(event) {
  const query = event.target.value.toLowerCase();
  const notes = document.querySelectorAll('.note-card');

  notes.forEach(note => {
    const title = note.querySelector('.note-title').textContent.toLowerCase();
    const description = note.querySelector('.note-desc').textContent.toLowerCase();

    if (title.includes(query) || description.includes(query)) {
      note.style.display = 'block';
    } else {
      note.style.display = 'none';
    }
  });
}
