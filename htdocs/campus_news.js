
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
  } catch (err) {
    container.innerHTML = "<p>Error loading news: " + err.message + "</p>";
  }
});
