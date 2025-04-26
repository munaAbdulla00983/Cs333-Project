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

  // Fetch and render notes list
  fetchNotes();
}

function fetchNotes() {
  // Fetch notes from the API (replace this with actual API call)
  fetch('https://680d00cd2ea307e081d5b19c.mockapi.io/api/v1/Notes')
    .then(response => response.json())
    .then(notes => {
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
    })
    .catch(err => console.error('Error fetching notes:', err));
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

  // Post the new note to the API
  const newNote = {
    title,
    description,
    link,
    subject, // You can include this if needed
  };

  fetch('https://680d00cd2ea307e081d5b19c.mockapi.io/api/v1/Notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newNote),
  })
    .then(response => response.json())
    .then(() => {
      // Redirect back to index
      window.location.href = 'index.html';
    })
    .catch(err => console.error('Error creating note:', err));
}

// --- Detail page initialization ---
function initDetailPage() {
  // Get the note ID from the URL
  const params = new URLSearchParams(window.location.search);
  const noteId = params.get('id');

  // Fetch note details based on the ID
  fetch(`https://680d00cd2ea307e081d5b19c.mockapi.io/api/v1/Notes/${noteId}`)
    .then(response => response.json())
    .then(note => {
      // Render the note details
      document.querySelector('.note-title').innerText = note.title;
      document.querySelector('.note-desc').innerText = note.description;
      document.querySelector('.note-link').setAttribute('href', note.link);

      // Handle the edit and delete actions
      document.querySelector('.btn-secondary').addEventListener('click', () => {
        console.log('Edit action for note:', note.id);
        // Implement edit functionality (perhaps redirect to an edit page)
      });

      document.querySelector('.btn-danger').addEventListener('click', () => {
        fetch(`https://680d00cd2ea307e081d5b19c.mockapi.io/api/v1/Notes/${note.id}`, {
          method: 'DELETE',
        })
          .then(() => {
            console.log('Note deleted');
            window.location.href = 'index.html'; // Redirect after deletion
          })
          .catch(err => console.error('Error deleting note:', err));
      });
    })
    .catch(err => console.error('Error fetching note details:', err));
}

// --- Search functionality ---
function searchNotes(event) {
  const query = event.target.value.toLowerCase();
  const noteCards = document.querySelectorAll('.note-card');
  noteCards.forEach(card => {
    const title = card.querySelector('.note-title').textContent.toLowerCase();
    const description = card.querySelector('.note-desc').textContent.toLowerCase();
    if (title.includes(query) || description.includes(query)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}
