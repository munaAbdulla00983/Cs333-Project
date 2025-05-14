const API_BASE = "https://c8223598-aef4-497e-8bf1-254e6acb5d4e-00-38rgo79wc4l4u.sisko.replit.dev/phase3-Campus-News-Rawan-Nabeel/index.php/endpoint";
const API_URL = ${API_BASE}/news;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const cancelBtn = document.getElementById("cancel-btn");
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable submit button immediately
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const content = document.getElementById("content").value.trim();
    const author = document.getElementById("author").value.trim();
    const image = document.getElementById("image").files[0];

    const errors = [];

    if (title.length < 5 || title.length > 100) errors.push("Title must be 5–100 characters.");
    if (!category) errors.push("Please select a category.");
    if (content.length < 20 || content.length > 1000) errors.push("Content must be 20–1000 characters.");
    if (!author || author.length < 2 || author.length > 100) errors.push("Author name must be 2–100 characters.");

    if (errors.length) {
      alert(errors.join("\n"));
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);
    formData.append("author", author);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit post.");
      }

      alert("News submitted successfully.");
      form.reset();
      window.location.href = "Main_Listing.html";
    } catch (err) {
      alert("Submission error: " + err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });

  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Cancel this post and return to the listing?")) {
        window.location.href = "Main_Listing.html";
      }
    });
  }
});

