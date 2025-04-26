const API_URL = 'https://680d00cd2ea307e081d5b19c.mockapi.io/Notes/';
const notesGrid = document.getElementById('notesGrid');
const searchInput = document.getElementById('searchInput');

let allNotes = []; // To store all notes for searching

// Fetch notes from API and display
async function fetchNotes() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    allNotes = data; // Save data for search use
    displayNotes(data);
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
}

// Render notes to the page
function displayNotes(notes) {
  notesGrid.innerHTML = '';

  if (notes.length === 0) {
    notesGrid.innerHTML = '<p>No notes found.</p>';
    return;
  }

  notes.forEach(note => {
    const noteCard = document.createElement('article');
    noteCard.className = 'note-card';
    noteCard.innerHTML = `
      <h2 class="note-title">${note.title}</h2>
      <p class="note-desc">${note.description || ''}</p>
      <a href="detail.html?id=${note.id}" class="note-link">View Details</a>
    `;
    notesGrid.appendChild(noteCard);
  });
}

// Handle search functionality
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredNotes = allNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm) ||
    note.subject.toLowerCase().includes(searchTerm) ||
    (note.description && note.description.toLowerCase().includes(searchTerm))
  );
  displayNotes(filteredNotes);
}

// Event listener for search input
if (searchInput) {
  searchInput.addEventListener('input', handleSearch);
}

// Only fetch notes if on index page (where the grid exists)
if (notesGrid) {
  fetchNotes();
}

// ---------- Additional code for create.html (Create New Note) ----------
const createForm = document.querySelector('.form');

if (createForm) {
  createForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('note-title').value.trim();
    const subject = document.getElementById('note-subject').value.trim();
    const description = document.getElementById('note-description').value.trim();
    const link = document.getElementById('note-link').value.trim();

    if (!title || !subject) {
      alert('Please fill in the required fields.');
      return;
    }

    const newNote = {
      title,
      subject,
      description,
      link
    };

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNote)
      });

      alert('Note created successfully!');
      window.location.href = 'index.html'; // Go back to listing
    } catch (error) {
      console.error('Error creating note:', error);
    }
  });
}

// ---------- Additional code for detail.html (View, Delete) ----------
const detailContainer = document.querySelector('.note-card');
const urlParams = new URLSearchParams(window.location.search);
const noteId = urlParams.get('id');

if (detailContainer && noteId) {
  fetch(API_URL + noteId)
    .then(res => res.json())
    .then(note => {
      detailContainer.innerHTML = `
        <h2 class="note-title">${note.title}</h2>
        <p><strong>Subject:</strong> ${note.subject}</p>
        <p><strong>Description:</strong> ${note.description || 'No description provided.'}</p>
        <p><strong>Download:</strong> <a href="${note.link}" target="_blank" class="note-link">${note.link ? 'Download Note' : 'No link available'}</a></p>

        <div class="form-actions">
          <button class="btn btn-secondary" id="editBtn">Edit</button>
          <button class="btn btn-danger" id="deleteBtn">Delete</button>
        </div>
      `;

      document.getElementById('deleteBtn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this note?')) {
          try {
            await fetch(API_URL + noteId, {
              method: 'DELETE'
            });
            alert('Note deleted successfully!');
            window.location.href = 'index.html';
          } catch (error) {
            console.error('Error deleting note:', error);
          }
        }
      });

      document.getElementById('editBtn').addEventListener('click', () => {
        // Later you can add edit functionality
        alert('Edit functionality coming soon!');
      });

    })
    .catch(error => {
      console.error('Error fetching note details:', error);
      detailContainer.innerHTML = '<p>Error loading note details.</p>';
    });
}
