const API_URL = "https://c8223598-aef4-497e-8bf1-254e6acb5d4e-00-38rgo79wc4l4u.sisko.replit.dev/phase3-Campus-News-Rawan-Nabeel/index.php/endpoint/news";

document.addEventListener("DOMContentLoaded", async () => {
  const newsContainer = document.getElementById("news-container");

  try {
    const res = await fetch(API_URL);
    const newsList = await res.json();

    newsList.forEach(news => {
      const card = document.createElement("div");
      card.className = "news-card";

      card.innerHTML = `
        <h3>${news.title}</h3>
        <p><strong>Category:</strong> ${news.category}</p>
        <p>${news.content.substring(0, 150)}...</p>
        <p><em>By ${news.author} on ${news.published_date}</em></p>
        ${news.image ? `<img src="${news.image}" alt="News Image" width="200">` : ""}
        <a href="news_detail.html?id=${news.id}">Read More</a>
      `;

      newsContainer.appendChild(card);
    });
  } catch (err) {
    newsContainer.innerHTML = "<p>Error loading news.</p>";
  }
});
