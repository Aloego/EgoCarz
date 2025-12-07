// js/car-details.js

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get("id");

  const car = carData.find((c) => c.id === carId);

  if (car) {
    const mainImage = document.getElementById("mainCarImage");
    const thumbnails = document.getElementById("carThumbnails");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    let currentIndex = 0;

    // Set initial main image
    mainImage.src = car.images[0];

    // Function to update main image
    function updateMainImage(index) {
      currentIndex = (index + car.images.length) % car.images.length;
      mainImage.src = car.images[currentIndex];
    }

    // Arrow button click handlers
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      updateMainImage(currentIndex - 1);
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      updateMainImage(currentIndex + 1);
    });

    // Create thumbnail images
    thumbnails.innerHTML = "";
    car.images.forEach((imgSrc) => {
      const thumb = document.createElement("img");
      thumb.src = imgSrc;
      thumb.className = "img-thumbnail m-1";
      thumb.style.width = "80px";
      thumb.style.cursor = "pointer";

      // Add click event to update main image
      thumb.addEventListener("click", () => {
        mainImage.src = imgSrc;
        currentIndex = car.images.indexOf(imgSrc);
      });
      thumbnails.appendChild(thumb);

      // This modal isn't working
      document
        .getElementById("mainCarImage")
        .addEventListener("click", function () {
          const modalImage = document.getElementById("modalCarImage");
          modalImage.src = this.src;
          const modal = new bootstrap.Modal(
            document.getElementById("imageModal")
          );
          modal.show();
        });
    });

    // Keyboard navigation (left/right arrow keys)
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        updateMainImage(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        updateMainImage(currentIndex + 1);
      }
    });

    // Touch/swipe support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    mainImage.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    mainImage.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50; // minimum distance for swipe
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swiped left - show next image
        updateMainImage(currentIndex + 1);
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swiped right - show previous image
        updateMainImage(currentIndex - 1);
      }
    }

    document.getElementById("carName").textContent = car.name;
    document.getElementById("carModel").textContent = `Model: ${car.model}`;
    document.getElementById("carPrice").textContent = `Price: ${car.price}`;
    document.getElementById("carYear").textContent = `Year: ${car.year}`;
    document.getElementById("carMileage").textContent =
      `Mileage: ${car.mileage}` || "Not Specified";
    document.getElementById(
      "carLocation"
    ).textContent = `Location: ${car.location}`;
    document.getElementById("carDescription").innerHTML = `${car.description}`;
    document.getElementById("carCondition").textContent =
      `Condition: ${car.condition}` || "Not specified";
  } else {
    document.querySelector(".car-detail").innerHTML = "<p>Car not found.</p>";
  }

  // BUY button logic
  const bookButton = document.getElementById("bookButton");

  bookButton.addEventListener("click", function (e) {
    e.preventDefault();

    const message = `I want to buy:
      - Car: ${car.name}
      - Price: ₦${Number(car.price.replace(/[^\d]/g, "")).toLocaleString()}
      - Mileage: ${car.mileage}
      - Location: ${car.location}
      - Year: ${car.year || "Not specified"}`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "2348105031964"; // Replace with your WhatsApp number

    const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
    const waLink = isMobile
      ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    window.open(waLink, "_blank");
  });

  // Event Listeners for filters and Sorting
  // document.getElementById("applyFilters").addEventListener("click", () => {
  // applyFiltersAndSort();
  // });
});
