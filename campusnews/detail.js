const urlParams = new URLSearchParams(window.location.search);
const newsId = urlParams.get("id") || 1;

function fetchNewsDetails() {
  fetch("news.json")
    .then((res) => res.json())
    .then((data) => {
      const newsItem = data.find((item) => item.id == newsId);
      if (!newsItem) {
        document.getElementById("newsDetails").innerHTML =
          "<p>News not found.</p>";
        return;
      }

      document.getElementById("newsDetails").innerHTML = `
        <img src="${newsItem.image}" alt="${newsItem.title}" />
        <h2>${newsItem.title}</h2>
        <p><strong>Category:</strong> ${newsItem.category}</p>
        <p><strong>Author:</strong> ${newsItem.author}</p>
        <p><strong>Published:</strong> ${newsItem.published}</p>
        <p>${newsItem.content}</p>
      `;
    })
    .catch((err) => {
      console.error("Error loading news:", err);
      document.getElementById("newsDetails").innerHTML =
        "<p>Error loading news details.</p>";
    });
}

function loadComments() {
  fetch(`load_comments.php?news_id=${newsId}`)
    .then((res) => res.json())
    .then((comments) => {
      const list = document.getElementById("commentsList");
      if (!Array.isArray(comments) || comments.length === 0) {
        list.innerHTML = "<p>No comments yet.</p>";
        return;
      }

      list.innerHTML = comments
        .map(
          (c) => `
          <p>
            <strong>${c.author}:</strong> ${c.comment_text}<br />
            <small>${new Date(c.created_at).toLocaleString()}</small>
          </p>
        `
        )
        .join("");
    })
    .catch(() => {
      document.getElementById("commentsList").innerHTML =
        "<p style='color:red;'>Error loading comments.</p>";
    });
}

document.getElementById("commentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const comment = document.getElementById("comment").value.trim();

  if (!name || !comment) {
    alert("Both fields are required.");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("comment", comment);
  formData.append("news_id", newsId);

  fetch("submit_comment.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      const msg = document.getElementById("commentMsg");
      msg.innerText = data.message;
      msg.style.color = data.error ? "red" : "green";

      if (!data.error) {
        document.getElementById("commentForm").reset();
        loadComments();
      }
    })
    .catch(() => {
      const msg = document.getElementById("commentMsg");
      msg.innerText = "Error posting comment.";
      msg.style.color = "red";
    });
});

fetchNewsDetails();
loadComments();
