
const API_BASE = "/index.php/endpoint";
const API_URL = `${API_BASE}/news`;

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("post-detail");
  if (!container) {
    console.error("Post detail container not found");
    return;
  }

  const postId = new URLSearchParams(window.location.search).get("id");
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
  if (!container) return;

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

  const commentForm = document.getElementById("comment-form");
  if (!commentForm) return;

  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name")?.value.trim() || '';
    const comment = document.getElementById("comment")?.value.trim() || '';

    try {
      const res = await fetch(`${API_URL}/${postId}/comments`, {
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
      commentForm.reset();
      loadComments();
    } catch (err) {
      alert("Error posting comment: " + err.message);
    }
  });
}

function loadComments() {
  const commentsList = document.getElementById("comments-list");
  if (!commentsList) return;

  const postId = new URLSearchParams(window.location.search).get("id");
  if (!postId) return;

  fetch(`${API_URL}/${postId}/comments`)
    .then(res => res.json())
    .then(comments => {
      commentsList.innerHTML = comments.map(comment => `
        <div class="comment">
          <strong>${comment.author}</strong>
          <p>${comment.comment_text}</p>
          <small>${new Date(comment.created_at).toLocaleString()}</small>
        </div>
      `).join("");
    })
    .catch(err => {
      commentsList.innerHTML = `<p style="color:red;">Error loading comments: ${err.message}</p>`;
    });
}
