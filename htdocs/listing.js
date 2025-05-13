const API_BASE = "/index.php/endpoint";
const API_URL = `${API_BASE}/news`;


function sortNewsByDate() {
  const cards = Array.from(document.querySelectorAll('.card'));
  cards.sort((a, b) => {
    const dateA = new Date(a.dataset.date);
    const dateB = new Date(b.dataset.date);
    return dateB - dateA;
  });
  const container = document.querySelector('.news-container');
  cards.forEach(card => container.appendChild(card));
}

// Add event listener for sort button
document.getElementById('sort-date-btn').addEventListener('click', sortNewsByDate);

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".news-container");
  const filterBtn = document.getElementById("filter-btn");
  const searchInput = document.getElementById("search-bar");

  async function loadData(search = "") {
    container.innerHTML = "<p>Loading...</p>";
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const res = await fetch(`${API_URL}?${params.toString()}`);
      const result = await res.json();
      if (!result || !("data" in result)) throw new Error("Invalid data from API");

      render(result.data);
    } catch (err) {
      container.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
  }

  function render(posts) {
    container.innerHTML = "";

    if (posts.length === 0) {
      container.innerHTML = "<p>No matching news posts found.</p>";
      return;
    }

    posts.forEach(post => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.borderRadius = "8px";

      card.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content.slice(0, 100)}...</p>
        <a href="detail.html?id=${post.id}">Read more</a>
      `;

      container.appendChild(card);
    });
  }

  filterBtn.addEventListener("click", () => {
    const searchText = searchInput.value.trim();
    loadData(searchText);
  });

  loadData(); // initial load
});
