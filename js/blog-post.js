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

      // When rendering car listings, filter out cars with sold === true
      const availableCars = cars.filter((car) => car.sold !== true);

      // Use availableCars for random selection and display
      const randomCars = getRandomCars(availableCars, getNumCarsToShow());

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
      <div class="mt-4 pt-3 border-top">
        <h6 class="mb-3">Share this post:</h6>
        <div class="d-flex gap-3">
          <a href="#" id="shareFacebook" class="btn btn-outline-primary btn-sm" title="Share on Facebook" target="_blank">
            <i class="fab fa-facebook-f"></i> Facebook
          </a>
          <a href="#" id="shareTwitter" class="btn btn-outline-info btn-sm" title="Share on Twitter" target="_blank">
            <i class="fab fa-twitter"></i> Twitter
          </a>
          <a href="#" id="shareWhatsApp" class="btn btn-outline-success btn-sm" title="Share on WhatsApp" target="_blank">
            <i class="fab fa-whatsapp"></i> WhatsApp
          </a>
          <button id="shareLinkedIn" class="btn btn-outline-primary btn-sm" title="Share on LinkedIn">
            <i class="fab fa-linkedin-in"></i> LinkedIn
          </button>
        </div>
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

      // --- DYNAMIC META TAGS FOR SOCIAL SHARING & CANONICAL ---
      const postUrl = window.location.href;
      const postTitle = post.title;
      // Ensure absolute image URL for social cards
      let postImage = post.image || "";
      if (postImage && !/^https?:\/\//.test(postImage)) {
        postImage = `https://aloego.github.io/EgoCarz/${postImage.replace(
          /^\/+/,
          ""
        )}`;
      }
      const postDescription =
        post.description ||
        post.content?.replace(/<[^>]+>/g, "").substring(0, 150) ||
        "Read this blog post on EgoCarz";
      document.title = `${postTitle} | EgoCarz Blog`;
      // Set or update canonical link
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", postUrl);
      // Open Graph
      const setMeta = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute("content", value);
      };
      setMeta("og-title", postTitle);
      setMeta("og-description", postDescription);
      setMeta("og-image", postImage);
      setMeta("og-url", postUrl);
      // Twitter Card
      setMeta("twitter-title", postTitle);
      setMeta("twitter-description", postDescription);
      setMeta("twitter-image", postImage);
      setMeta("twitter-url", postUrl);
      // For Cloudshare or other share integrations, ensure meta tags are set before share buttons are used.

      // --- CUSTOM SOCIAL SHARE BUTTONS ---
      // Facebook Share
      document
        .getElementById("shareFacebook")
        ?.addEventListener("click", function (e) {
          e.preventDefault();
          const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            postUrl
          )}`;
          window.open(fbUrl, "_blank", "width=600,height=400");
        });
      // Twitter Share
      document
        .getElementById("shareTwitter")
        ?.addEventListener("click", function (e) {
          e.preventDefault();
          const twitterText = `${postTitle} - ${postDescription}`;
          const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            postUrl
          )}&text=${encodeURIComponent(twitterText)}`;
          window.open(twitterUrl, "_blank", "width=600,height=400");
        });
      // WhatsApp Share
      document
        .getElementById("shareWhatsApp")
        ?.addEventListener("click", function (e) {
          e.preventDefault();
          const waMessage = `${postTitle}\n${postDescription}\n${postUrl}`;
          const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
          const waUrl = isMobile
            ? `https://wa.me/?text=${encodeURIComponent(waMessage)}`
            : `https://web.whatsapp.com/send?text=${encodeURIComponent(
                waMessage
              )}`;
          window.open(waUrl, "_blank");
        });
      // LinkedIn Share
      document
        .getElementById("shareLinkedIn")
        ?.addEventListener("click", function (e) {
          e.preventDefault();
          const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            postUrl
          )}`;
          window.open(linkedInUrl, "_blank", "width=600,height=600");
        });

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
        const randomCars = getRandomCars(availableCars, numCars);
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
