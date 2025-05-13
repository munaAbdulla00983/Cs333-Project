const API_BASE = "https://c8223598-aef4-497e-8bf1-254e6acb5d4e-00-38rgo79wc4l4u.sisko.replit.dev/phase3-Campus-News-Rawan-Nabeel/index.php/endpoint";
const API_URL = `${API_BASE}/news`;

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
