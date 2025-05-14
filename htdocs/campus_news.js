const API_BASE = "/index.php/endpoint";
const API_URL = `${API_BASE}/news`;

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".news-container");

  async function loadData() {
    container.innerHTML = "<p>Loading...</p>";
    try {
      const res = await fetch(API_URL);
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
      container.innerHTML = "<p>No news posts found.</p>";
      return;
    }

    posts.forEach(post => {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-date", post.published_at);

      card.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content.slice(0, 100)}...</p>
        <a href="detail.html?id=${post.id}">Read more</a>
      `;

      container.appendChild(card);
    });
  }

  loadData(); // Initial load of news articles
});
