document.addEventListener('DOMContentLoaded', () => { 
  const form = document.querySelector('form');
  const courseNameInput = document.getElementById('course-name');
  const ratingInput = document.getElementById('rating');
  const reviewInput = document.getElementById('review');
  const reviewsContainer = document.querySelector('.row.g-4');
  const commentForm = document.querySelector('#review-details + hr + h4 + div + form');
  const commentInput = document.getElementById('comment');
  const searchInput = document.querySelector('.search-section input[type="text"]');
  const filterCourseSelect = document.querySelector('.search-section select:first-child');
  const filterRatingSelect = document.querySelector('.search-section select:nth-child(2)');
  const sortSelect = document.querySelector('.search-section select.sort'); 

  let allReviews = []; 
  let reviews = [];     
  let currentPage = 1;
  const reviewsPerPage = 3;

  const loadingIndicator = document.createElement('div');
  loadingIndicator.textContent = 'Loading reviews...';
  loadingIndicator.classList.add('alert', 'alert-info');

  const fetchData = async () => {
    document.body.prepend(loadingIndicator);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      allReviews = data.slice(0, 10);
      reviews = [...allReviews];
      renderReviews();
    } catch (error) {
      showError('Failed to load reviews. Please try again later.');
    } finally {
      loadingIndicator.remove();
    }
  };

  const showError = (message) => {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'alert alert-danger';
    errorContainer.textContent = message;
    document.body.prepend(errorContainer);
  };

  const renderReviews = () => {
    reviewsContainer.innerHTML = '';
    const start = (currentPage - 1) * reviewsPerPage;
    const paginatedReviews = reviews.slice(start, start + reviewsPerPage);

    paginatedReviews.forEach(review => {
      const card = document.createElement('div');
      card.className = 'col-md-4';
      card.innerHTML = `
        <div class="card review-card">
          <h2>${review.title}</h2>
          <p>"${review.body}"</p>
          <a href="#review-details" onclick="showDetails('${review.title}', '★★★★★', \`${review.body}\`)">View Details</a>
        </div>
      `;
      reviewsContainer.appendChild(card);
    });

    renderPagination();
  };

  const renderPagination = () => {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.className = 'btn btn-light m-1';
      if (i === currentPage) button.classList.add('active');
      button.addEventListener('click', () => {
        currentPage = i;
        renderReviews();
      });
      paginationContainer.appendChild(button);
    }
  };

  window.showDetails = (course, rating, text) => {
    const section = document.querySelector('#review-details');
    section.querySelector('h3').textContent = course;
    section.querySelector('p strong').nextSibling.textContent = ' ' + rating;
    section.querySelectorAll('p')[1].textContent = `"${text}"`;
  };

  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const commentText = commentInput.value.trim();
    if (commentText !== '') {
      const commentCard = document.createElement('div');
      commentCard.className = 'card p-3 mb-2';
      commentCard.innerHTML = `
        <p class="mb-1"><strong>You:</strong> ${commentText}</p>
        <small class="text-muted">Just now</small>
      `;
      const commentsContainer = document.querySelector('#review-details + hr + h4 + div');
      commentsContainer.appendChild(commentCard);
      commentInput.value = '';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const course = courseNameInput.value.trim();
    const rating = ratingInput.value.trim();
    const reviewText = reviewInput.value.trim();

    if (!course || !rating || !reviewText) {
      alert('Please fill in all fields!');
      return;
    }

    const newReview = {
      title: course,
      body: reviewText
    };
    allReviews.unshift(newReview); 
    reviews = [...allReviews];  
    renderReviews();
    form.reset();
  });

  const filterReviews = () => {
    const query = searchInput.value.toLowerCase();
    const selectedCourse = filterCourseSelect.value;
    const selectedRating = filterRatingSelect.value;

    reviews = allReviews.filter(review => {
      const matchesSearch = review.title.toLowerCase().includes(query);
      const matchesCourse = selectedCourse === '' || review.title.includes(selectedCourse);
      const matchesRating = selectedRating === '' || review.body.includes(selectedRating);
      return matchesSearch && matchesCourse && matchesRating;
    });

    currentPage = 1;
    renderReviews();
  };

  searchInput.addEventListener('input', filterReviews);
  filterCourseSelect.addEventListener('change', filterReviews);
  filterRatingSelect.addEventListener('change', filterReviews);

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const sortType = sortSelect.value;
      if (sortType === 'A-Z') {
        reviews.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortType === 'Z-A') {
        reviews.sort((a, b) => b.title.localeCompare(a.title));
      }
      currentPage = 1;
      renderReviews();
    });
  }

  fetchData();
});
