const API_URL = 'https://680cdfa72ea307e081d54d20.mockapi.io/api/v1/notes'; // MockAPI URL

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
  
  document.querySelector('.search-input').addEventListener('input', searchNotes);
  document.querySelector('.btn-primary').addEventListener('click', () => {
    window.location.href = 'create.html';
  });
  
  fetchNotes();
}

async function fetchNotes() {
  try {
    const response = await fetch(API_URL);
    const notes = await response.json();
    renderNotes(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
}

function renderNotes(notes) {
  const notesGrid = document.querySelector('.notes-grid');
  notesGrid.innerHTML = '';

  notes.forEach(note => {
    const noteCard = document.createElement('article');
    noteCard.classList.add('note-card');
    noteCard.innerHTML = `
      <h2 class="note-title">${note.title}</h2>
      <p class="note-desc">${note.description}</p>
      <a href="detail.html?id=${note.id}" class="note-link">View Details</a>
    `;
    notesGrid.appendChild(noteCard);
  });
}

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

// --- Create Page ---
function initCreatePage() {
  const form = document.querySelector('.form');
  form.addEventListener('submit', handleSubmit);
}

async function handleSubmit(event) {
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

  const newNote = { title, subject, description, link };

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote)
    });
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error creating note:', error);
  }
}

// --- Detail Page ---
function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (id) {
    fetchNoteDetails(id);
  }

  document.querySelector('.btn-secondary').addEventListener('click', () => {
    alert('Edit functionality coming soon!');
  });
  document.querySelector('.btn-danger').addEventListener('click', () => {
    handleDelete(id);
  });
}

async function fetchNoteDetails(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const note = await response.json();

    document.querySelector('.note-title').textContent = note.title;
    document.querySelector('.note-desc').textContent = note.description;
    document.querySelector('.note-link').href = note.link || '#';
    document.querySelector('.note-link').textContent = note.link ? 'Download File' : 'No file';
  } catch (error) {
    console.error('Error fetching note details:', error);
  }
}

async function handleDelete(id) {
  if (confirm('Are you sure you want to delete this note?')) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }
}
