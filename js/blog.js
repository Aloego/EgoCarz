// Product card template
// function getProductCard(car) {
//   // URL encode image and name for query params
//   const idParam = encodeURIComponent(car.id);
//   // const nameParam = encodeURIComponent(car.name);
//   return `
//       <div class="col-md-4 mb-4">
//         <div class="card h-100 shadow-sm product-card" tabindex="0" aria-label="Featured car: ${car.name}">
//           <img src="${car.image}" loading="lazy" class="card-img-top" alt="${car.name}" style="object-fit:cover;max-height:220px;">
//           <div class="card-body d-flex flex-column">
//             <h5 class="card-title">${car.name}</h5>
//             <p class="card-text fw-bold text-success" aria-label="Price">${car.price}</p>
//             <a href="car-details.html?image=${idParam}&name=${nameParam}" class="btn btn-outline-primary mt-auto" aria-label="View details for ${car.name}">View Details</a>
//           </div>
//         </div>
//       </div>
//     `;
// }

// Product card template
function getProductCard(car) {
  const idParam = encodeURIComponent(car.id);
  return `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm product-card" tabindex="0" aria-label="Featured car: ${car.name}">
          <img src="${car.image}" loading="lazy" class="card-img-top" alt="${car.name}" style="object-fit:cover;max-height:220px;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${car.name}</h5>
            <p class="card-text fw-bold text-success" aria-label="Price">${car.price}</p>
            <a href="car-details.html?id=${idParam}" class="btn btn-outline-primary mt-auto" aria-label="View details for ${car.name}">View Details</a>
          </div>
        </div>
      </div>
    `;
}
// js/blog.js
// Dynamically loads blog posts, categories, and handles search/filter for desktop/tablet

$(document).ready(function () {
  let posts = [];
  let categories = [];
  let activeCategory = "All";

  // Fetch posts and cars from JSON
  let cars = [];
  let productCardInterval = 3; // Change this value to adjust interval
  $.when($.getJSON("blog-posts.json"), $.getJSON("cars-og-data.json")).done(
    function (postData, carData) {
      posts = postData[0];
      cars = carData[0];
      categories = getUniqueCategories(posts);
      renderCategoryFilters(categories);
      renderPosts(posts);
    }
  );

  // Get unique categories from posts
  function getUniqueCategories(posts) {
    const cats = posts.map((post) => post.category);
    return ["All", ...Array.from(new Set(cats))];
  }

  // Render category dropdown (instead of buttons)
  function renderCategoryFilters(categories) {
    const $dropdown = $("#categoryDropdown");
    $dropdown.empty();
    categories.forEach((cat) => {
      $dropdown.append(`<option value="${cat}">${cat}</option>`);
    });
  }

  // Category dropdown change
  $(document).on("change", "#categoryDropdown", function () {
    activeCategory = $(this).val();
    filterAndRender();
  });

  // Render post cards
  function renderPosts(postsToRender) {
    const $container = $("#blogPostsContainer");
    $container.empty();
    if (postsToRender.length === 0) {
      $container.append(
        '<div class="col-12 text-center"><p>No posts found.</p></div>'
      );
      return;
    }
    let carIndex = 0;
    let cardCount = 0;
    postsToRender.forEach((post, i) => {
      // Add blog post card
      $container.append(`
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            ${
              post.image
                ? `<img src="${post.image}" class="card-img-top" alt="${post.title}">`
                : ""
            }
            <div class="card-body d-flex flex-column">
              <a href="#" class="category-link mb-2 text-start text-muted small" data-category="${
                post.category
              }" style="text-decoration: underline;">${post.category}</a>
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">${post.excerpt}</p>
              <a href="blog-post.html?id=${
                post.id
              }" class="btn btn-primary mt-auto">Read More</a>
            </div>
          </div>
        </div>
      `);
      cardCount++;
      // Insert product card after every N posts
      if (cardCount % productCardInterval === 0 && cars.length > 0) {
        $container.append(getProductCard(cars[carIndex]));
        carIndex = (carIndex + 1) % cars.length;
      }
    });
  }

  // Category filter click
  $(document).on("click", ".category-btn", function () {
    $(".category-btn").removeClass("active");
    $(this).addClass("active");
    activeCategory = $(this).data("category");
    filterAndRender();
  });

  // Search input (desktop/tablet only)
  $("#searchInput").on("input", function () {
    filterAndRender();
  });

  // Handle click on category link in card
  $(document).on("click", ".category-link", function (e) {
    e.preventDefault();
    const cat = $(this).data("category");
    $("#categoryDropdown").val(cat).trigger("change");
  });

  // Filter and render posts
  function filterAndRender() {
    let filtered = posts;
    const search = $("#searchInput").val().toLowerCase();
    if (activeCategory !== "All") {
      filtered = filtered.filter((post) => post.category === activeCategory);
    }
    if (search) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(search) ||
          post.excerpt.toLowerCase().includes(search)
      );
    }
    renderPosts(filtered);
  }

  // Hide filters/search on mobile
  function handleResponsive() {
    if (window.innerWidth < 768) {
      $("#categoryFilters").parent().parent().hide();
      $("#searchInput").parent().hide();
    } else {
      $("#categoryFilters").parent().parent().show();
      $("#searchInput").parent().show();
    }
  }
  handleResponsive();
  $(window).on("resize", handleResponsive);
});
