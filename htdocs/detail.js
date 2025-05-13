const API_BASE = "https://c8223598-aef4-497e-8bf1-254e6acb5d4e-00-38rgo79wc4l4u.sisko.replit.dev/phase3-Campus-News-Rawan-Nabeel/index.php/endpoint";
const API_URL = `${API_BASE}/news`;
let postId = null;

document.addEventListener("DOMContentLoaded", async () => {
  setupEditDeleteHandlers();
  postId = new URLSearchParams(window.location.search).get("id");
  const container = document.getElementById("post-detail");

  function setupEditDeleteHandlers() {
    // Edit button handlers
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const cardElement = this.closest('.card');
        const newsId = this.dataset.id;
        
        // Make content editable
        cardElement.querySelectorAll('p').forEach(p => {
          p.contentEditable = true;
          p.style.backgroundColor = '#f0f0f0';
        });
        
        // Add save button
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'btn-primary';
        saveBtn.onclick = () => saveChanges(cardElement, newsId);
        
        this.style.display = 'none';
        cardElement.appendChild(saveBtn);
      });
    });

    // Delete button handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        const newsId = this.dataset.id;
        if(confirm('Are you sure you want to delete this news item?')) {
          try {
            const response = await fetch(`${API_URL}/${newsId}`, {
              method: 'DELETE'
            });
            
            if(response.ok) {
              this.closest('.card').remove();
              alert('News deleted successfully');
            } else {
              alert('Failed to delete news');
            }
          } catch(err) {
            console.error('Error:', err);
            alert('Error deleting news');
          }
        }
      });
    });
  }

  async function saveChanges(cardElement, newsId) {
    const title = cardElement.querySelector('h2').textContent;
    const content = cardElement.querySelector('p:last-of-type').textContent;
    
    try {
      const response = await fetch(`${API_URL}/${newsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          title: title,
          content: content
        })
      });
      
      if(response.ok) {
        alert('Changes saved successfully');
        location.reload();
      } else {
        alert('Failed to save changes');
      }
    } catch(err) {
      console.error('Error:', err);
      alert('Error saving changes');
    }
  }

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
    setupCommentForm();
  } catch (err) {
    container.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
});

function renderPost(post) {
  const container = document.getElementById("post-detail");
  container.innerHTML = "";

  const article = document.createElement("article");

  const img = new Image();
  img.src = post.image ? `${API_BASE.replace('/index.php/endpoint', '')}/uploads/${post.image}` : "";
  img.alt = "News image";
  img.className = "news-image";
  article.appendChild(img);

  article.innerHTML += `
    <header>
      <h2 contenteditable="false" id="post-title">${post.title}</h2>

      <label for="post-date"><small>📅 Published on:</small></label>
      <input type="datetime-local" id="post-date" value="${post.published_at.replace(' ', 'T')}" disabled style="margin-bottom:1rem; width:100%;">

      <label for="post-author"><small>✍️ Author:</small></label>
      <input type="text" id="post-author" value="${post.author}" disabled style="margin-bottom:1rem; width:100%;">

      <label for="post-category"><small>📂 Category:</small></label>
      <select id="post-category" disabled style="margin-bottom:1rem; width:100%;">
        <option value="events" ${post.category === "events" ? "selected" : ""}>Events</option>
        <option value="announcements" ${post.category === "announcements" ? "selected" : ""}>Announcements</option>
        <option value="alerts" ${post.category === "alerts" ? "selected" : ""}>Alerts</option>
      </select>
    </header>
    <section id="post-content" contenteditable="false">${post.content}</section>
    <div style="margin-top: 1rem;">
      <button id="save-btn" style="display:none;">Save Changes</button>
      <button id="cancel-edit" style="display:none;">Cancel</button>
    </div>
    <hr />
    <section aria-label="Comments">
      <h3>Leave a Comment</h3>
      <form id="commentForm">
        <label for="comment">Comment</label>
        <textarea id="comment" rows="4" required placeholder="Write your comment here..."></textarea>
        <label for="author">Name</label>
        <input type="text" id="author" placeholder="Your name" required />
        <button type="submit">Post Comment</button>
      </form>
      <div class="comments" id="commentList"></div>
    </section>
  `;

  container.appendChild(article);

  setupEditButton();
  setupDeleteButton();
}

function setupEditButton() {
  const editBtn = document.getElementById("edit-btn");
  const saveBtn = document.getElementById("save-btn");
  const cancelBtn = document.getElementById("cancel-edit");

  if (!editBtn || !saveBtn || !cancelBtn) return;

  editBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("post-title").contentEditable = true;
    document.getElementById("post-content").contentEditable = true;
    document.getElementById("post-author").disabled = false;
    document.getElementById("post-date").disabled = false;
    document.getElementById("post-category").disabled = false;
    saveBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
  });

  cancelBtn.addEventListener("click", () => window.location.reload());

  saveBtn.addEventListener("click", async () => {
    const title = document.getElementById("post-title").innerText.trim();
    const content = document.getElementById("post-content").innerText.trim();
    const author = document.getElementById("post-author").value.trim();
    const published_at = document.getElementById("post-date").value.trim();
    const category = document.getElementById("post-category").value.trim();

    if (title.length < 5 || content.length < 20 || author.length < 2 || category.length < 3) {
      alert("Invalid input values.");
      return;
    }

    const res = await fetch(`${API_URL}/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ title, content, author, category, published_at })
    });

    if (res.ok) {
      alert("Post updated.");
      location.reload();
    } else {
      alert("Failed to update post.");
    }
  });
}

function setupDeleteButton() {
  const deleteBtn = document.getElementById("delete-btn");
  if (!deleteBtn) return;

  deleteBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const confirmDelete = confirm("Are you sure you want to delete this news post?");
    if (!confirmDelete) return;

    const res = await fetch(`${API_URL}/${postId}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("Post deleted.");
      window.location.href = "Main_Listing.html";
    } else {
      alert("Failed to delete post.");
    }
  });
}

function setupCommentForm() {
  const form = document.getElementById("commentForm");
  const submitBtn = form.querySelector("button[type='submit']");
  if (!form || !submitBtn) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable the button immediately
    submitBtn.disabled = true;
    submitBtn.textContent = "Posting...";

    const comment = document.getElementById("comment").value.trim();
    const author = document.getElementById("author").value.trim();

    if (comment.length < 3 || author.length < 2) {
      alert("Fill both fields properly.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Post Comment";
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment, author })
      });

      if (res.ok) {
        alert("Comment added");
        location.reload();
      } else {
        const error = await res.json();
        alert("Failed to post comment: " + (error?.error || res.statusText));
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      // Re-enable button only if not reloading
      submitBtn.disabled = false;
      submitBtn.textContent = "Post Comment";
    }
  });
}


function loadComments() {
  fetch(`${API_URL}/${postId}/comments`)
    .then(res => res.json())
    .then(renderComments)
    .catch(() => document.getElementById("commentList").innerHTML = "<p>Failed to load comments.</p>");
}

function renderComments(comments) {
  const commentList = document.getElementById("commentList");
  commentList.innerHTML = "";

  comments.forEach(c => {
    const wrapper = document.createElement("article");
    wrapper.setAttribute("data-id", c.id);
    wrapper.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.25rem;">
        <strong style="white-space: nowrap; margin-top: 4px;">${c.author}:</strong>
        <textarea class="comment-text" readonly 
          oninput="this.style.height='auto';this.style.height=this.scrollHeight + 'px';"
          style="flex: 1; resize: none; overflow: hidden; min-height: 2rem; padding: 0.4rem 0.5rem; font-size: 0.9rem;">${c.comment_text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>
      </div>
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
        <button class="edit-comment" style="background-color: #28a745; color: white;">Edit</button>
        <button class="save-comment" style="display:none;">Save</button>
        <button class="cancel-edit" style="display:none;">Cancel</button>
        <button class="delete-comment" style="background-color: #dc3545; color: white; margin-left:auto;">Delete</button>
      </div>
    `;

    commentList.appendChild(wrapper);
  });

  bindCommentActions();
}

function bindCommentActions() {
  document.querySelectorAll(".edit-comment").forEach(btn => {
    btn.addEventListener("click", () => {
      const wrapper = btn.closest("article");
      const textarea = wrapper.querySelector(".comment-text");
      textarea.removeAttribute("readonly");
      wrapper.querySelector(".save-comment").style.display = "inline-block";
      wrapper.querySelector(".cancel-edit").style.display = "inline-block";
      btn.style.display = "none";
      textarea.dataset.original = textarea.value;
    });
  });

  document.querySelectorAll(".cancel-edit").forEach(btn => {
    btn.addEventListener("click", () => {
      const wrapper = btn.closest("article");
      const textarea = wrapper.querySelector(".comment-text");
      textarea.value = textarea.dataset.original;
      textarea.setAttribute("readonly", true);
      wrapper.querySelector(".save-comment").style.display = "none";
      wrapper.querySelector(".edit-comment").style.display = "inline-block";
      btn.style.display = "none";
    });
  });

  document.querySelectorAll(".save-comment").forEach(btn => {
    btn.addEventListener("click", async () => {
      const wrapper = btn.closest("article");
      const commentId = wrapper.dataset.id;
      const textarea = wrapper.querySelector(".comment-text");
      const text = textarea.value.trim();
      if (text.length < 3) return alert("Comment too short.");

      const res = await fetch(`${API_URL}/${postId}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_text: text })
      });

      if (res.ok) {
        alert("Comment updated.");
        loadComments();
      } else {
        alert("Failed to update.");
      }
    });
  });

  document.querySelectorAll(".delete-comment").forEach(btn => {
    btn.addEventListener("click", async () => {
      const wrapper = btn.closest("article");
      const commentId = wrapper.dataset.id;
      const confirmed = confirm("Delete this comment?");
      if (!confirmed) return;

      const res = await fetch(`${API_URL}/${postId}/comments/${commentId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        alert("Deleted.");
        loadComments();
      } else {
        alert("Failed to delete.");
      }
      function fetchComments() {
        $.get("get_comments.php?news_id=1", function(data) {
          var commentsHtml = "";
          data.forEach(function(comment) {
            commentsHtml += `<p><strong>${comment.author}</strong>: ${comment.comment_text}</p>`;
          });
          $("#commentSection").html(commentsHtml);
        });
      }
      

    });
  });
}