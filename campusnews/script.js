document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.querySelector('.row');
    const searchInput = document.querySelector('input[type="text"]');
    const sortButton = document.querySelector('.btn-secondary:nth-child(1)');
    const filterButton = document.querySelector('.btn-secondary:nth-child(2)');
    const addNewsButton = document.querySelector('.btn.btn-primary');
    const detailSection = document.querySelectorAll('section')[1];
    const addNewsSection = document.querySelectorAll('section')[2];
    const form = document.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');
  
    let allNews = [];
    let currentPage = 1;
    const newsPerPage = 6;
    let isSorted = false;
  
    // Fetch Data
    async function fetchNews() {
      showLoading();
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('Failed to fetch news');
        const data = await response.json();
        allNews = data.slice(0, 30); // Limit to 30 fake news for demo
        renderNews();
      } catch (error) {
        newsContainer.innerHTML = `<p class="text-danger">Error loading news: ${error.message}</p>`;
      }
    }
  
    // Show Loading
    function showLoading() {
      newsContainer.innerHTML = `<p>Loading news...</p>`;
    }
  
    // Render News List
    function renderNews() {
      const start = (currentPage - 1) * newsPerPage;
      const paginatedNews = allNews.slice(start, start + newsPerPage);
  
      newsContainer.innerHTML = '';
  
      paginatedNews.forEach(news => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
          <div class="card h-100">
            <h3>${news.title.substring(0, 20)}...</h3>
            <p>${news.body.substring(0, 50)}...</p>
            <a href="#" class="read-more" data-id="${news.id}">Read more</a>
          </div>
        `;
        newsContainer.appendChild(col);
      });
  
      renderPagination();
    }
  
    // Render Pagination
    function renderPagination() {
      const totalPages = Math.ceil(allNews.length / newsPerPage);
      const footer = document.querySelector('footer');
  
      // Remove old pagination
      const oldPagination = document.getElementById('pagination');
      if (oldPagination) oldPagination.remove();
  
      const pagination = document.createElement('div');
      pagination.id = 'pagination';
      pagination.className = 'my-3';
  
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = 'btn btn-outline-primary mx-1';
        btn.addEventListener('click', () => {
          currentPage = i;
          renderNews();
        });
        pagination.appendChild(btn);
      }
  
      footer.appendChild(pagination);
    }
  
    // Search Functionality
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase();
      const filtered = allNews.filter(news => news.title.toLowerCase().includes(keyword));
      allNews = filtered.length ? filtered : allNews;
      currentPage = 1;
      renderNews();
    });
  
    // Sort by Title
    sortButton.addEventListener('click', () => {
      isSorted = !isSorted;
      allNews.sort((a, b) => {
        if (isSorted) {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      });
      renderNews();
    });
  
    // Dummy Filter
    filterButton.addEventListener('click', () => {
      alert('Filter feature coming soon!');
    });
  
    // Read More (Detail View)
    newsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('read-more')) {
        e.preventDefault();
        const id = e.target.getAttribute('data-id');
        const newsItem = allNews.find(n => n.id == id);
        showDetail(newsItem);
      }
    });
  
    function showDetail(news) {
      detailSection.innerHTML = `
        <div class="card">
          <h2>${news.title}</h2>
          <p>${news.body}</p>
          <div class="mb-3">
            <button class="btn btn-primary me-2" id="editBtn">Edit</button>
            <button class="btn btn-danger" id="deleteBtn">Delete</button>
          </div>
          <h3>Comments</h3>
          <div class="card mb-2">
            <p><strong>Student A:</strong> This is a great update!</p>
          </div>
          <a href="#" id="backLink">Back to listing</a>
        </div>
      `;
  
      detailSection.scrollIntoView({ behavior: 'smooth' });
  
      document.getElementById('backLink').addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  
    // Add News (Form validation)
    submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value.trim();
      const content = document.getElementById('content').value.trim();
  
      if (!title || !content) {
        alert('Please fill in both Title and Content.');
        return;
      }
  
      const newNews = {
        id: allNews.length + 1,
        title: title,
        body: content
      };
  
      allNews.unshift(newNews);
      form.reset();
      currentPage = 1;
      renderNews();
      alert('News added successfully!');
    });
  
    // Add News Button - Scroll to Form
    addNewsButton.addEventListener('click', () => {
      addNewsSection.scrollIntoView({ behavior: 'smooth' });
    });
  
    // Initial load
    fetchNews();
  });
  