
const API_BASE = "/endpoint";
const API_URL = `${API_BASE}/news`;

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".news-container");

  try {
    const res = await fetch(API_URL);
    const result = await res.json();
    const newsList = result.data || [];

    container.innerHTML = "";

    if (newsList.length === 0) {
      container.innerHTML = "<p>No news posts found.</p>";
      return;
    }

    newsList.forEach(news => {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-date", news.published_at);
      
      card.innerHTML = `
        <h3>${news.title}</h3>
        <p><strong>Author:</strong> ${news.author}</p>
        <p><strong>Category:</strong> ${news.category}</p>
        <p>${news.content.substring(0, 150)}...</p>
        <a href="detail.html?id=${news.id}">Read more</a>
      `;

      container.appendChild(card);
    });

    // Add event listeners for filter and sort
    const filterBtn = document.getElementById("filter-btn");
    const searchInput = document.getElementById("search-bar");
    const sortDateBtn = document.getElementById("sort-date-btn");

    if (filterBtn && searchInput) {
      filterBtn.addEventListener("click", () => {
        const searchText = searchInput.value.trim();
        loadData(searchText);
      });
    }

    if (sortDateBtn) {
      sortDateBtn.addEventListener("click", () => {
        const cards = Array.from(document.querySelectorAll('.card'));
        cards.sort((a, b) => {
          const dateA = new Date(a.dataset.date);
          const dateB = new Date(b.dataset.date);
          return dateB - dateA;
        });
        container.innerHTML = '';
        cards.forEach(card => container.appendChild(card));
      });
    }

  } catch (err) {
    container.innerHTML = "<p>Error loading news: " + err.message + "</p>";
  }
});

async function loadData(search = "") {
  const container = document.querySelector(".news-container");
  container.innerHTML = "<p>Loading...</p>";
  
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    const res = await fetch(`${API_URL}?${params.toString()}`);
    const result = await res.json();
    const newsList = result.data || [];

    container.innerHTML = "";

    if (newsList.length === 0) {
      container.innerHTML = "<p>No matching news posts found.</p>";
      return;
    }

    newsList.forEach(news => {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-date", news.published_at);
      
      card.innerHTML = `
        <h3>${news.title}</h3>
        <p><strong>Author:</strong> ${news.author}</p>
        <p><strong>Category:</strong> ${news.category}</p>
        <p>${news.content.substring(0, 150)}...</p>
        <a href="detail.html?id=${news.id}">Read more</a>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "<p>Error loading news: " + err.message + "</p>";
  }
}
