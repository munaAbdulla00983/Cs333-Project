// Club-Activities.js

const API_URL = 'https://680cfdd82ea307e081d5a9ed.mockapi.io/club-activities';
let activities = [], currentPage = 1, itemsPerPage = 3;

const container = document.querySelector('.row');
const search = createInput('Search activities...', () => { currentPage = 1; render(); });
const sort = createSelect(['Title A-Z', 'Title Z-A'], e => { activities.sort((a, b) => e.target.value == 0 ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)); render(); });
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
  [search, sort, modal].forEach(el => container.parentNode.insertBefore(el, container));
  container.parentNode.appendChild(pagination);
}

function render() {
  const filtered = activities.filter(a => a.title.toLowerCase().includes(search.value.toLowerCase()));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  container.innerHTML = paginated.map(a => `
    <div class="col-md-4">
      <div class="activity-card" onclick="showModal('${a.title}', '${a.body}')">
        <h3 class="card-title">${a.title}</h3>
        <p class="card-text">${a.body.slice(0, 80)}...</p>
        <a href="#" class="btn btn-primary mt-2">View Details</a>
      </div>
    </div>`).join('');

  renderPagination(filtered.length);
}

function renderPagination(total) {
  pagination.innerHTML = '';
  Array.from({ length: Math.ceil(total / itemsPerPage) }, (_, i) => {
    pagination.innerHTML += `<button class="btn btn-secondary m-1" ${i+1===currentPage?'disabled':''} onclick="setPage(${i+1})">${i+1}</button>`;
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
  Object.assign(m.style, { display: 'none', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '2rem', background: 'white', border: '1px solid #ccc', zIndex: 1000 });
  m.innerHTML = `<h2 id="modalTitle"></h2><p id="modalBody"></p><button onclick="hideModal()" class="btn btn-danger mt-2">Close</button>`;
  return m;
}

function toggleLoading(show) {
  container.innerHTML = show ? '<p>Loading...</p>' : '';
}

function showModal(title, body) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').textContent = body;
  document.getElementById('detailModal').style.display = 'block';
}

function hideModal() {
  document.getElementById('detailModal').style.display = 'none';
}

function validateForm(form) {
  return [...form.querySelectorAll('input[required]')].every(input => {
    const error = input.nextElementSibling || input.insertAdjacentElement('afterend', document.createElement('small'));
    if (!input.value.trim()) {
      error.textContent = 'Required field';
      error.style.color = 'red';
      return false;
    } else {
      error.textContent = '';
      return true;
    }
  });
}

