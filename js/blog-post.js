// js/blog-post.js
// Loads a single blog post by id from blog-posts.json and displays it

$(document).ready(function () {
  // Get post id from URL
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  if (!postId) {
    $("#postContent").html(
      '<div class="text-center"><p>Post not found.</p><a href="blog.html" class="btn btn-secondary mt-3">Back to Blog</a></div>'
    );
    return;
  }

  // Fetch posts from JSON
  $.getJSON("blog-posts.json", function (posts) {
    const post = posts.find((p) => p.id === postId);
    if (!post) {
      $("#postContent").html(
        '<div class="text-center"><p>Post not found.</p><a href="blog.html" class="btn btn-secondary mt-3">Back to Blog</a></div>'
      );
      return;
    }
    // Render post
    $("#postContent").html(`
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <button id="backToBlogBtn" class="btn btn-outline-primary mb-4">&larr; Back to Blog</button>
          <span class="badge badge-secondary mb-2">${post.category}</span>
          <h1 class="mb-3">${post.title}</h1>
          ${
            post.image
              ? `<img src="${post.image}" class="img-fluid rounded mb-4" alt="${post.title}">`
              : ""
          }
          <div class="mb-4">${post.content}</div>
        </div>
      </div>
    `);
    // Ensure event delegation is correctly implemented and robust
    $(document)
      .off("click", "#backToBlogBtn")
      .on("click", "#backToBlogBtn", function (e) {
        e.preventDefault();
        if (
          document.referrer &&
          document.referrer.indexOf(window.location.origin) === 0
        ) {
          window.history.back();
        } else {
          window.location.href = "blog.html";
        }
      });
    // Also handle any fallback anchors with class 'backToBlog'
    $(document)
      .off("click", ".backToBlog")
      .on("click", ".backToBlog", function (e) {
        e.preventDefault();
        if (
          document.referrer &&
          document.referrer.indexOf(window.location.origin) === 0
        ) {
          window.history.back();
        } else {
          window.location.href = "blog.html";
        }
      });
  });
});
