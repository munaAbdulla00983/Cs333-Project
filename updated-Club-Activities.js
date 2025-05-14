const API_URL = 'https://replit.com/@ahmedalsindi14/phase3-clubactivties#htdocs';
let activities = [], currentPage = 1, itemsPerPage = 3;
const commentsMap = new Map();

const container = document.querySelector('.row');
const search = createInput('Search activities...', () => { currentPage = 1; render(); });
const sort = createSelect(['Title A-Z', 'Title Z-A'], e => {
  activities.sort((a, b) =>
    e.target.value == 0 ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
  render();
});
const modal = createModal();
const pagination = document.createElement('div');

document.addEventListener('DOMContentLoaded', async () => {
  setupUI();
  await fetchActivities();
});

async function fetchActivities() {
  try {
    toggleLoading(true);
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Fetch failed');
    activities = (await res.json()).slice(0, 15);
    render();
  } catch (err) {
    container.innerHTML = `<p style="color:red;">${err.message}</p>`;
  } finally {
    toggleLoading(false);
  }
}

function setupUI() {
  const parent = container.parentNode;
  parent.insertBefore(search, container);
  parent.insertBefore(sort, container);
  parent.appendChild(modal);
  parent.appendChild(pagination);
}

function render() {
  const filtered = activities.filter(a => a.name.toLowerCase().includes(search.value.toLowerCase()));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  container.innerHTML = paginated.map(a => `
    <div class="col-md-4">
      <div class="activity-card" onclick="showModal('${a.name}', '${a.description}')">
        <h3 class="card-title">${a.name}</h3>
        <p class="card-text">${a.description.slice(0, 80)}...</p>
        <a href="#" class="btn btn-primary mt-2">View Details</a>
      </div>
    </div>
  `).join('');

  renderPagination(filtered.length);
}

function renderPagination(total) {
  pagination.innerHTML = '';
  Array.from({ length: Math.ceil(total / itemsPerPage) }, (_, i) => {
    pagination.innerHTML += `<button class="btn btn-secondary m-1" ${i + 1 === currentPage ? 'disabled' : ''} onclick="setPage(${i + 1})">${i + 1}</button>`;
  });
}

function setPage(page) {
  currentPage = page;
  render();
}

function createInput(placeholder, inputHandler) {
  const i = document.createElement('input');
  i.placeholder = placeholder;
  i.className = 'form-control mb-2';
  i.addEventListener('input', inputHandler);
  return i;
}

function createSelect(options, changeHandler) {
  const s = document.createElement('select');
  s.className = 'form-select mb-3';
  s.innerHTML = options.map((o, i) => `<option value="${i}">${o}</option>`).join('');
  s.addEventListener('change', changeHandler);
  return s;
}

function createModal() {
  const m = document.createElement('div');
  m.id = 'detailModal';
  m.style.display = 'none';
  Object.assign(m.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    padding: '2rem',
    zIndex: 1000,
    width: '90%',
    maxWidth: '600px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  });

  m.innerHTML = `
    <h2 id="modalTitle" class="card-title"></h2>
    <p id="modalBody" class="card-text"></p>
    <hr style="margin:1.5rem 0;" />
    <div id="commentSection">
      <h3 class="card-title" style="color:#008080;">Comments</h3>
      <textarea id="commentInput" class="form-control mb-2" placeholder="Add a comment..."></textarea>
      <button id="submitComment" class="btn btn-secondary">Submit</button>
      <div id="commentList" style="margin-top:1rem;"></div>
    </div>
    <button onclick="hideModal()" class="btn btn-danger mt-3">Close</button>
  `;
  return m;
}

function showModal(title, body) {
  const modal = document.getElementById('detailModal');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').textContent = body;

  const commentList = document.getElementById('commentList');
  const commentInput = document.getElementById('commentInput');
  commentInput.value = '';

  renderComments(title);

  document.getElementById('submitComment').onclick = () => {
    const comment = commentInput.value.trim();
    if (comment) {
      if (!commentsMap.has(title)) commentsMap.set(title, []);
      commentsMap.get(title).push(comment);
      renderComments(title);
      commentInput.value = '';
    }
  };

  modal.style.display = 'block';
}

function hideModal() {
  document.getElementById('detailModal').style.display = 'none';
}

function renderComments(title) {
  const commentList = document.getElementById('commentList');
  const comments = commentsMap.get(title) || [];
  commentList.innerHTML = comments.map(c => `
    <p style="background:#F5F5F5; padding:0.625rem; border-radius:6px; border:1px solid #E0E0E0;">
      ${c}
    </p>
  `).join('');
}

function toggleLoading(show) {
  container.innerHTML = show ? '<p>Loading...</p>' : '';
}

