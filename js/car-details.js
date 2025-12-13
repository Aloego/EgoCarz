// js/car-details.js

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get("id");

  const car = carData.find((c) => c.id === carId);

  if (car) {
    // Update page title and meta tags for SEO and social sharing
    document.title = `${car.name} ${car.year} - EgoCarz`;

    // Update Open Graph tags
    document
      .getElementById("og-title")
      .setAttribute("content", `${car.name} ${car.year} - ${car.price}`);
    document
      .getElementById("og-description")
      .setAttribute("content", car.shortDescription);
    document.getElementById("og-image").setAttribute("content", car.images[0]);
    document
      .getElementById("og-url")
      .setAttribute("content", window.location.href);

    // Update Twitter tags
    document
      .getElementById("twitter-title")
      .setAttribute("content", `${car.name} ${car.year} - ${car.price}`);
    document
      .getElementById("twitter-description")
      .setAttribute("content", car.shortDescription);
    document
      .getElementById("twitter-image")
      .setAttribute("content", car.images[0]);

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
      thumb.style.height = "80px";
      thumb.style.objectFit = "cover";
      thumb.style.cursor = "pointer";

      // Add click event to update main image
      thumb.addEventListener("click", () => {
        mainImage.src = imgSrc;
        currentIndex = car.images.indexOf(imgSrc);
      });
      thumbnails.appendChild(thumb);
    });

    // Modal click event with navigation
    let modalCurrentIndex = 0;
    const modalImage = document.getElementById("modalCarImage");
    const modalCounter = document.getElementById("modalImageCounter");
    const modalPrevBtn = document.getElementById("modalPrevBtn");
    const modalNextBtn = document.getElementById("modalNextBtn");

    function updateModalImage(index) {
      modalCurrentIndex = (index + car.images.length) % car.images.length;
      modalImage.src = car.images[modalCurrentIndex];
      modalCounter.textContent = `${modalCurrentIndex + 1}/${
        car.images.length
      }`;
    }

    document
      .getElementById("mainCarImage")
      .addEventListener("click", function () {
        modalCurrentIndex = currentIndex;
        updateModalImage(modalCurrentIndex);
        const modal = new bootstrap.Modal(
          document.getElementById("imageModal")
        );
        modal.show();

        // Show arrow buttons when modal opens
        modalPrevBtn.style.display = "block";
        modalNextBtn.style.display = "block";
      });

    // Hide arrow buttons when modal closes
    document
      .getElementById("imageModal")
      .addEventListener("hidden.bs.modal", function () {
        modalPrevBtn.style.display = "none";
        modalNextBtn.style.display = "none";
      });

    // Modal navigation buttons
    modalPrevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      updateModalImage(modalCurrentIndex - 1);
    });

    modalNextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      updateModalImage(modalCurrentIndex + 1);
    });

    // Modal keyboard navigation
    document.addEventListener("keydown", (e) => {
      const modal = document.getElementById("imageModal");
      if (modal.classList.contains("show")) {
        if (e.key === "ArrowLeft") {
          updateModalImage(modalCurrentIndex - 1);
        } else if (e.key === "ArrowRight") {
          updateModalImage(modalCurrentIndex + 1);
        }
      } else {
        // Main image navigation when modal is closed
        if (e.key === "ArrowLeft") {
          updateMainImage(currentIndex - 1);
        } else if (e.key === "ArrowRight") {
          updateMainImage(currentIndex + 1);
        }
      }
    });

    // Modal touch/swipe support for mobile
    let modalTouchStartX = 0;
    let modalTouchEndX = 0;

    modalImage.addEventListener("touchstart", (e) => {
      modalTouchStartX = e.changedTouches[0].screenX;
    });

    modalImage.addEventListener("touchend", (e) => {
      modalTouchEndX = e.changedTouches[0].screenX;
      handleModalSwipe();
    });

    function handleModalSwipe() {
      const swipeThreshold = 50;
      if (modalTouchStartX - modalTouchEndX > swipeThreshold) {
        updateModalImage(modalCurrentIndex + 1);
      } else if (modalTouchEndX - modalTouchStartX > swipeThreshold) {
        updateModalImage(modalCurrentIndex - 1);
      }
    }

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

    // Right column - Product info only
    document.getElementById("carName").textContent = car.name;
    document.getElementById("carPrice").textContent = car.price;
    document.getElementById("carShortDescription").textContent =
      car.shortDescription || car.description.substring(0, 150) + "...";

    // Description tab
    document.getElementById("carDescription").innerHTML = car.description;

    // Specification tab - only show fields with data
    const specs = [
      { id: "specModel", value: car.model, element: "carModel" },
      { id: "specYear", value: car.year, element: "carYear" },
      { id: "specCondition", value: car.condition, element: "carCondition" },
      { id: "specType", value: car.type, element: "carType" },
      { id: "specColor", value: car.color, element: "carColor" },
      { id: "specMileage", value: car.mileage, element: "carMileage" },
      { id: "specFuelType", value: car.fuelType, element: "carFuelType" },
      {
        id: "specTransmission",
        value: car.transmission,
        element: "carTransmission",
      },
      { id: "specLocation", value: car.location, element: "carLocation" },
    ];

    specs.forEach((spec) => {
      const row = document.getElementById(spec.id);
      const element = document.getElementById(spec.element);

      if (spec.value && spec.value !== "" && spec.value !== "Not specified") {
        element.textContent = spec.value;
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });

    // Contact Seller WhatsApp button
    const contactSellerBtn = document.getElementById("contactSellerBtn");
    if (contactSellerBtn) {
      contactSellerBtn.addEventListener("click", function (e) {
        e.preventDefault();

        const message = `I'm interested in this car:\n- Car: ${car.name}\n- Price: ${car.price}\n- Location: ${car.location}`;
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = car.whatsappNumber || "2348100042876";

        const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
        const waLink = isMobile
          ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
          : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

        window.open(waLink, "_blank");
      });
    }

    // Social Media Share Buttons
    const carUrl = window.location.href;
    const carTitle = `${car.name} - ${car.price}`;
    const carDescription =
      car.shortDescription || car.description.substring(0, 150);

    // Facebook Share
    document
      .getElementById("shareFacebook")
      .addEventListener("click", function (e) {
        e.preventDefault();
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          carUrl
        )}`;
        window.open(fbUrl, "_blank", "width=600,height=400");
      });

    // Twitter Share
    document
      .getElementById("shareTwitter")
      .addEventListener("click", function (e) {
        e.preventDefault();
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          carUrl
        )}&text=${encodeURIComponent(carTitle)}`;
        window.open(twitterUrl, "_blank", "width=600,height=400");
      });

    // WhatsApp Share
    document
      .getElementById("shareWhatsApp")
      .addEventListener("click", function (e) {
        e.preventDefault();
        const waMessage = `Check out this car: ${carTitle}\n${carDescription}\n${carUrl}`;
        const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
        const waUrl = isMobile
          ? `https://wa.me/?text=${encodeURIComponent(waMessage)}`
          : `https://web.whatsapp.com/send?text=${encodeURIComponent(
              waMessage
            )}`;
        window.open(waUrl, "_blank");
      });

    // Copy Link
    document.getElementById("copyLink").addEventListener("click", function (e) {
      e.preventDefault();
      navigator.clipboard
        .writeText(carUrl)
        .then(() => {
          const btn = this;
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          btn.classList.remove("btn-outline-secondary");
          btn.classList.add("btn-success");
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove("btn-success");
            btn.classList.add("btn-outline-secondary");
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
          alert("Failed to copy link. Please try again.");
        });
    });
  } else {
    document.querySelector(".car-detail").innerHTML = "<p>Car not found.</p>";
  }
});
