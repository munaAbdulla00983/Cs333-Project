// Campus Hub Study Group Finder JS

const API_URL = "https://680b9e16d5075a76d98bd4f6.mockapi.io/api/v1/groups";
let allGroups = [];

document.addEventListener("DOMContentLoaded", () => {
  const groupGrid = document.querySelector(".review-grid");
  const pagination = document.querySelector(".pagination");
  const searchInput = document.querySelector(".filter-section input");
  const facultyFilter = document.querySelectorAll(".filter-section select")[0];
  const sortSelect = document.querySelectorAll(".filter-section select")[1];
  const form = document.querySelector("form");
  const detailSection = document.querySelector("#detail-view");

  loadGroups();
  setupFormValidation();

  function loadGroups() {
    groupGrid.innerHTML = "<p>Loading study groups...</p>";

    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        allGroups = data;
        renderGroups(allGroups);
      })
      .catch(() => {
        groupGrid.innerHTML = "<p>Failed to load study groups.</p>";
      });
  }

  function renderGroups(groups, page = 1, limit = 5) {
    groupGrid.innerHTML = "";
    pagination.innerHTML = "";

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = groups.slice(start, end);

    if (paginated.length === 0) {
      groupGrid.innerHTML = "<p>No study groups found</p>";
      return;
    }

    paginated.forEach(group => {
      const card = document.createElement("article");
      card.className = "review-card";
      card.innerHTML = `
        <h3>${group.name}</h3>
        <p><strong>Course:</strong> ${group.course}</p>
        <p><strong>Meeting:</strong> ${group.time}</p>
        <a href="#detail-view" class="link" data-id="${group.id}">Read more</a>
      `;
      groupGrid.appendChild(card);
    });

    document.querySelectorAll(".link").forEach(link => {
      link.addEventListener("click", event => {
        const id = event.target.dataset.id;
        const group = allGroups.find(g => g.id == id);
        showGroupDetail(group);
      });
    });

    renderPagination(groups.length, page, limit);
  }

  function renderPagination(total, currentPage, limit) {
    const totalPages = Math.ceil(total / limit);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.addEventListener("click", () => renderGroups(allGroups, i, limit));
      pagination.appendChild(btn);
    }
  }

  searchInput.addEventListener("input", filterAndRender);
  facultyFilter.addEventListener("change", filterAndRender);
  sortSelect.addEventListener("change", filterAndRender);

  function filterAndRender() {
    let filtered = [...allGroups];

    const term = searchInput.value.toLowerCase();
    if (term) {
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(term) ||
        g.course.toLowerCase().includes(term)
      );
    }

    const faculty = facultyFilter.value;
    if (faculty && faculty !== "Filter by Faculty") {
      filtered = filtered.filter(g => g.faculty === faculty);
    }

    const sortBy = sortSelect.value;
    if (sortBy === "time") {
      filtered.sort((a, b) => a.time.localeCompare(b.time));
    }


    renderGroups(filtered);
  }

  function showGroupDetail(group) {
    detailSection.innerHTML = `
      <h2>Group: ${group.name}</h2>
      <p><strong>Course:</strong> ${group.course}</p>
      <p><strong>Meeting Time:</strong> ${group.time}</p>
      <p><strong>Description:</strong> ${group.description}</p>
      <div class="form-buttons">
        <button class="btn yellow">Edit</button>
        <button class="btn red">Delete</button>
      </div>
      <div class="comments">
        <h3>Comments</h3>
        <div class="comment-box">
          <p><strong>Student A:</strong> Great group!</p>
        </div>
        <textarea placeholder="Add a comment..."></textarea>
        <button class="btn blue">Post</button>
      </div>
      <a href="#" class="link">← Back to listing</a>
    `;

    const postBtn = detailSection.querySelector(".btn.blue");
    const textarea = detailSection.querySelector("textarea");

    postBtn.addEventListener("click", () => {
      const comment = textarea.value.trim();
      if (comment) {
        const newComment = document.createElement("div");
        newComment.className = "comment-box";
        newComment.innerHTML = `<p><strong>You:</strong> ${comment}</p>`;
        detailSection.querySelector(".comments").insertBefore(newComment, textarea.parentNode);
        textarea.value = "";
      }
    });
  }

  function setupFormValidation() {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const inputs = form.querySelectorAll("input, select, textarea");
      let valid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = "red";
        } else {
          input.style.borderColor = "#ccc";
        }
      });

      if (valid) {
        alert("Form is valid. Submission disabled.");
      }
    });
  }
});


