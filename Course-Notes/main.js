document.addEventListener('DOMContentLoaded', () => {
    const notesGrid = document.querySelector('.notes-grid');
    const searchInput = document.querySelector('.search-input');
    const prevBtn = document.querySelector('.pagination .btn:first-child');
    const nextBtn = document.querySelector('.pagination .btn:last-child');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.textContent = "Loading...";
    loadingIndicator.classList.add('loading-indicator');
    notesGrid.appendChild(loadingIndicator);
  
    let notes = [];
    let currentPage = 1;
    const notesPerPage = 2;
    const apiUrl = 'https://680d2370c47cb8074d8fa8f0.mockapi.io/api/notes';
  
    // Fetch all notes
    async function fetchNotes() {
      try {
        loadingIndicator.style.display = 'block';  // Show loading indicator
        const response = await fetch(apiUrl);  // API call to fetch notes
        if (!response.ok) throw new Error('Failed to fetch notes');
        notes = await response.json();  // Parse the JSON response
        renderNotes();
        loadingIndicator.style.display = 'none';  // Hide loading indicator
      } catch (error) {
        loadingIndicator.textContent = 'Failed to load notes';
        console.error('Error fetching notes:', error);
      }
    }
  
    function renderNotes() {
      notesGrid.innerHTML = '';
      const filteredNotes = filterNotes();
      const paginatedNotes = paginateNotes(filteredNotes);
  
      paginatedNotes.forEach(note => {
        const noteCard = document.createElement('article');
        noteCard.classList.add('note-card');
        noteCard.innerHTML = `
          <h2 class="note-title">${note.title}</h2>
          <p class="note-desc">${note.description}</p>
          <a href="detail.html?id=${note.id}" class="note-link">View Details</a>
          <button class="btn btn-danger" onclick="deleteNote('${note.id}')">Delete</button>
        `;
        notesGrid.appendChild(noteCard);
      });
    }
  
    function filterNotes() {
      const query = searchInput.value.toLowerCase();
      return notes.filter(note => note.title.toLowerCase().includes(query));
    }
  
    function paginateNotes(filteredNotes) {
      const start = (currentPage - 1) * notesPerPage;
      const end = start + notesPerPage;
      return filteredNotes.slice(start, end);
    }
  
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderNotes();
      }
    });
  
    nextBtn.addEventListener('click', () => {
      if (currentPage * notesPerPage < notes.length) {
        currentPage++;
        renderNotes();
      }
    });
  
    searchInput.addEventListener('input', renderNotes);
  
    fetchNotes();
  });
  