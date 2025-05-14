const API_BASE = "/index.php/endpoint";
const API_URL = `${API_BASE}/news`;
let postId = null;

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("post-detail");
  postId = new URLSearchParams(window.location.search).get("id");

  if (!postId) {
    container.innerHTML = "<p>No post selected.</p>";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${postId}`);
    if (!res.ok) throw new Error("Post not found");
    const post = await res.json();
    renderPost(post);
    loadComments();
  } catch (err) {
    container.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
});

function renderPost(post) {
  const container = document.getElementById("post-detail");
  container.innerHTML = `
    <article class="news-post">
      <h2>${post.title}</h2>
      <div class="post-meta">
        <p><strong>Author:</strong> ${post.author}</p>
        <p><strong>Category:</strong> ${post.category}</p>
        <p><strong>Published:</strong> ${new Date(post.published_at).toLocaleDateString()}</p>
      </div>
      <div class="post-content">
        ${post.content}
      </div>
      <hr>
      <div class="comments-section">
        <h3>Comments</h3>
        <form id="comment-form">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" required>
          </div>
          <div class="form-group">
            <label for="comment">Comment:</label>
            <textarea id="comment" required></textarea>
          </div>
          <button type="submit">Post Comment</button>
        </form>
        <div id="comments-list"></div>
      </div>
    </article>
  `;

  // Add comment form handler
  document.getElementById("comment-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const comment = document.getElementById("comment").value.trim();

    try {
      const res = await fetch("submit_comment.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          comment,
          news_id: postId
        })
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.message);
      }

      alert("Comment posted successfully!");
      document.getElementById("comment-form").reset();
      loadComments();
    } catch (err) {
      alert("Error posting comment: " + err.message);
    }
  });
}

function loadComments() {
  fetch(`${API_URL}/${postId}/comments`)
    .then(res => res.json())
    .then(comments => {
      const commentsList = document.getElementById("comments-list");
      commentsList.innerHTML = comments.map(comment => `
        <div class="comment">
          <strong>${comment.author}</strong>
          <p>${comment.comment_text}</p>
          <small>${new Date(comment.created_at).toLocaleString()}</small>
        </div>
      `).join("");
    })
    .catch(err => {
      document.getElementById("comments-list").innerHTML = 
        `<p style="color:red;">Error loading comments: ${err.message}</p>`;
    });
}