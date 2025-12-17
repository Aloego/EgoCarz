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

  // Fetch all required data in parallel
  $.when($.getJSON("blog-posts.json"), $.getJSON("cars-og-data.json")).done(
    function (postData, carData) {
      const posts = postData[0];
      const cars = carData[0];
      const post = posts.find((p) => p.id === postId);
      if (!post) {
        $("#postContent").html(
          '<div class="text-center"><p>Post not found.</p><a href="blog.html" class="btn btn-secondary mt-3">Back to Blog</a></div>'
        );
        return;
      }

      // Related posts (same category, exclude current)
      const relatedPosts = posts.filter(
        (p) => p.category === post.category && p.id !== post.id
      );

      // Render main post content
      const postHtml = `
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb bg-white px-0 py-2 mb-2">
          <li class="breadcrumb-item"><a href="blog.html" title="Back to Blog">Blog</a></li>
          <li class="breadcrumb-item active" aria-current="page">${
            post.title
          }</li>
        </ol>
      </nav>
      <a href="blog.html" class="btn btn-outline-primary mb-3 backToBlog" title="Back to Blog">&larr; Back to Blog</a>
      <a href="blog.html?category=${encodeURIComponent(
        post.category
      )}" class="d-inline-block mb-2 text-primary font-weight-bold" title="View all posts in ${
        post.category
      }">${post.category}</a>
      <h1 class="mb-3" itemprop="headline">${post.title}</h1>
      ${
        post.image
          ? `<img src="${post.image}" class="img-fluid rounded mb-4 w-100" alt="${post.title} - featured image" title="${post.title}" itemprop="image">`
          : ""
      }
      <div class="mb-4 post-content" itemprop="articleBody">${
        post.content
      }</div>
      <div class="mb-4">
        <span class="mr-2">Share:</span>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          window.location.href
        )}" target="_blank" rel="noopener" class="mx-1" title="Share on Facebook" aria-label="Share on Facebook"><img src="images/facebook.svg" alt="Facebook" width="28" height="28"></a>
        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(
          window.location.href
        )}&text=${encodeURIComponent(
        post.title
      )}" target="_blank" rel="noopener" class="mx-1" title="Share on Twitter" aria-label="Share on Twitter"><img src="images/twitter.svg" alt="Twitter" width="28" height="28"></a>
        <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          window.location.href
        )}&title=${encodeURIComponent(
        post.title
      )}" target="_blank" rel="noopener" class="mx-1" title="Share on LinkedIn" aria-label="Share on LinkedIn"><img src="images/linkedin.svg" alt="LinkedIn" width="28" height="28"></a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener" class="mx-1" title="Share on Instagram" aria-label="Share on Instagram"><img src="images/instagram.svg" alt="Instagram" width="28" height="28"></a>
      </div>
      <section class="related-posts-section" aria-label="Related Posts">
        <div class="related-posts-title">Related Posts</div>
        <div class="related-posts-grid">
          ${
            relatedPosts.length === 0
              ? '<div class="text-muted">No related posts found.</div>'
              : relatedPosts
                  .map(
                    (rp) => `
                <div class="related-post-card">
                  <a href="blog-post.html?id=${encodeURIComponent(
                    rp.id
                  )}" class="card-link" title="Read: ${rp.title}">
                    <img src="${rp.image}" alt="${
                      rp.title
                    } - related post image" title="${rp.title}" loading="lazy">
                  </a>
                  <div class="card-body">
                    <div class="card-category">${rp.category}</div>
                    <a href="blog-post.html?id=${encodeURIComponent(
                      rp.id
                    )}" class="card-title card-link" title="Read: ${
                      rp.title
                    }">${rp.title}</a>
                  </div>
                </div>
              `
                  )
                  .join("")
          }
        </div>
      </section>
    `;
      $("#postContent").html(postHtml);

      // Responsive car listing logic
      function getNumCarsToShow() {
        const w = window.innerWidth;
        if (w < 576) return 2;
        if (w < 768) return 3;
        if (w < 992) return 4;
        return 5;
      }
      function getRandomCars(arr, n) {
        const shuffled = arr.slice().sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
      }
      function renderCarListing(targetSelector) {
        const numCars = getNumCarsToShow();
        const randomCars = getRandomCars(cars, numCars);
        const carCards = randomCars
          .map(
            (car) => `
        <div class="car-listing-card d-flex align-items-center mb-2" tabindex="0" aria-label="${
          car.name
        } for sale">
          <img src="${car.image}" alt="${car.name} - car image" title="${
              car.name
            } for sale" loading="lazy">
          <div class="car-listing-info">
            <div class="font-weight-bold">${car.name}</div>
            <div class="text-success mb-1">${car.price}</div>
            <a href="car-details.html?id=${encodeURIComponent(
              car.id
            )}" class="btn btn-sm btn-outline-primary" title="View details for ${
              car.name
            }">View Details</a>
          </div>
        </div>
      `
          )
          .join("");
        const viewAllBtn = `<a href="browse-cars.html" class="btn btn-primary view-all-cars-btn mt-3" title="View all cars">View All Cars</a>`;
        $(targetSelector).html(carCards + viewAllBtn);
      }

      // Initial render
      renderCarListing("#carSidebar");
      renderCarListing("#carMobileList");

      // Hide/show sidebar/mobile car list based on screen size
      function handleCarListDisplay() {
        if (window.innerWidth < 768) {
          $("#carSidebar").hide();
          $("#carMobileList").show();
        } else {
          $("#carSidebar").show();
          $("#carMobileList").hide();
        }
      }
      handleCarListDisplay();
      $(window).on("resize", function () {
        renderCarListing(
          window.innerWidth < 768 ? "#carMobileList" : "#carSidebar"
        );
        handleCarListDisplay();
      });

      // Back to blog event
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
    }
  );
});
