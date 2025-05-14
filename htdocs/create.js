
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#create-form");
  if (!form) {
    console.error("Create form not found");
    return;
  }

  const submitBtn = form.querySelector("button[type='submit']");
  if (!submitBtn) {
    console.error("Submit button not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const title = document.getElementById("title")?.value.trim() || '';
    const category = document.getElementById("category")?.value || '';
    const content = document.getElementById("content")?.value.trim() || '';
    const author = document.getElementById("author")?.value.trim() || '';
    const image = document.getElementById("image")?.files[0];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);
    formData.append("author", author);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("/index.php/endpoint/news", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Failed to submit post.");

      alert("News submitted successfully.");
      form.reset();
      window.location.href = "campus_news.html";
    } catch (err) {
      alert("Submission error: " + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });
});
