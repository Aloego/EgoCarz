// function displayCars(cars) {
//     const carList = document.getElementById("carList");
//     carList.innerHTML = "";

//     if (cars.length === 0) {
//       carList.innerHTML = "<p>No cars match your criteria.</p>";
//       return;
//     }

//     cars.forEach(car => {
//       const card = `
//         <div class="col-md-4 mb-4">
//           <div class="card">
//             <img src="${car.images[0]}" class="card-img-top" alt="${car.name}">
//             <div class="card-body">
//               <h5 class="card-title">${car.name}</h5>
//               <p class="card-text">₦${Number(car.price).toLocaleString()}</p>
//               <a href="car-details.html?id=${car.id}" class="btn btn-sm btn-primary">View Details</a>
//             </div>
//           </div>
//         </div>
//       `;
//       carList.innerHTML += card;
//     });
//   }

//   function applyFiltersAndSort() {
//     const make = document.getElementById("filterMake").value;
//     const location = document.getElementById("filterLocation").value;
//     const sortBy = document.getElementById("sortBy").value;

//     let filteredCars = carData;

//     // Filter by make
//     if (make) {
//       filteredCars = filteredCars.filter(car => car.make === make);
//     }

//     // Filter by location
//     if (location) {
//       filteredCars = filteredCars.filter(car => car.location === location);
//     }

//     // Sort
//     if (sortBy === "price-asc") {
//       filteredCars.sort((a, b) => a.price - b.price);
//     } else if (sortBy === "price-desc") {
//       filteredCars.sort((a, b) => b.price - a.price);
//     } else if (sortBy === "mileage-asc") {
//       filteredCars.sort((a, b) => a.mileage - b.mileage);
//     }

//     displayCars(filteredCars);
//   }

// OLD filter
// document.addEventListener("DOMContentLoaded", () => {
//     const carGrid = document.getElementById("carGrid");
//     const filterForm = document.getElementById("filterForm");
//     const sortSelect = document.getElementById("sortSelect");
//     const noResults = document.getElementById("noResults");

//     function renderCars(cars) {
//       carGrid.innerHTML = "";
//       if (cars.length === 0) {
//         noResults.style.display = "block";
//         return;
//       }
//       noResults.style.display = "none";
//       cars.forEach(car => {
//         const carCard = document.createElement("div");
//         carCard.className = "col-md-4 col-lg-4 mb-4";
//         carCard.innerHTML = `
//           <div class="card car-card">
//             <img src="${car.image}" class="card-img-top" alt="${car.make} ${car.model}">
//             <div class="card-body">
//               <h5 class="card-title">${car.make} ${car.model} ${car.year}</h5>
//               <p class="card-text">₦${car.price.toLocaleString()} • ${car.mileage.toLocaleString()}km • ${car.location}</p>
//               <a href="car-details.html?id=${car.id}" class="btn btn-sm btn-primary">View Details</a>
//             </div>
//           </div>
//         `;
//         carGrid.appendChild(carCard);
//       });
//     }

//     function applyFilters() {
//       let filteredCars = [...carData];
//       const make = document.getElementById("makeFilter").value.toLowerCase();
//       const model = document.getElementById("modelFilter").value.toLowerCase();
//       const year = document.getElementById("yearFilter").value;
//       const priceRange = document.getElementById("priceFilter").value;
//       const mileage = document.getElementById("mileageFilter").value;
//       const condition = document.getElementById("conditionFilter").value;
//       const location = document.getElementById("locationFilter").value.toLowerCase();

//       if (make) {
//         filteredCars = filteredCars.filter(car => car.make.toLowerCase().includes(make));
//       }
//       if (model) {
//         filteredCars = filteredCars.filter(car => car.model.toLowerCase().includes(model));
//       }
//       if (year) {
//         filteredCars = filteredCars.filter(car => car.year.toString() === year);
//       }
//       if (priceRange) {
//         const [min, max] = priceRange.split("-").map(p => parseInt(p.replace("₦", "").replace("M", "000000")));
//         filteredCars = filteredCars.filter(car => {
//           if (max) {
//             return car.price >= min && car.price <= max;
//           }
//           return car.price >= min;
//         });
//       }
//       if (mileage) {
//         filteredCars = filteredCars.filter(car => car.mileage <= parseInt(mileage));
//       }
//       if (condition) {
//         filteredCars = filteredCars.filter(car => car.condition === condition);
//       }
//       if (location) {
//         filteredCars = filteredCars.filter(car => car.location.toLowerCase().includes(location));
//       }

//       return filteredCars;
//     }

//     function applySort(cars) {
//       const sortValue = sortSelect.value;
//       if (sortValue === "priceLow") {
//         return cars.sort((a, b) => a.price - b.price);
//       } else if (sortValue === "priceHigh") {
//         return cars.sort((a, b) => b.price - a.price);
//       }
//       // Default is newest; assuming newer cars have higher year
//       return cars.sort((a, b) => b.year - a.year);
//     }

//     function updateCarDisplay() {
//       const filtered = applyFilters();
//       const sorted = applySort(filtered);
//       renderCars(sorted);
//     }

//     filterForm.addEventListener("submit", event => {
//       event.preventDefault();
//       updateCarDisplay();
//     });

//     sortSelect.addEventListener("change", updateCarDisplay);

//     // Initial render
//     renderCars(carData);
//   });

//  isotope Javascript
document.addEventListener("DOMContentLoaded", function () {
  console.log(carData); // to check if it's loaded

  const container = document.querySelector(".car-grid");
  const noResults = document.getElementById("noResults");

  // Clear old content first
  container.innerHTML = "";

  // Reverse carData to show newest first (car45 to car1)
  const reversedCars = [...carData].reverse();

  // Filter out sold cars
  const availableCars = reversedCars.filter((car) => !car.sold);

  // Generate all car cards dynamically
  availableCars.forEach((car) => {
    const item = document.createElement("div");
    item.classList.add("car-item", "col-md-6", "col-lg-4", "mb-4");

    // Extract price as number for filtering
    const priceValue = car.price.replace(/[^\d]/g, "");

    // Check if car is sold
    const soldBadge = car.sold ? '<span class="sold">SOLD</span>' : "";

    item.innerHTML = `
      <div class="card car-card" data-make="${car.name}" data-model="${car.model}" data-price="${priceValue}" data-condition="${car.condition}" data-year="${car.year}">
        <a href="car-details.html?id=${car.id}">
          <img src="${car.images[0]}" class="card-img-top" alt="${car.name}" style="height: 250px; object-fit: cover;">
        </a>
        <div class="card-body">
          ${soldBadge}
          <h5 class="card-title">${car.name}</h5>
          <p class="card-text">${car.price} • ${car.location}</p>
          <a href="car-details.html?id=${car.id}" class="btn btn-sm btn-primary">View Details</a>
        </div>
      </div>
    `;

    container.appendChild(item);
  });

  // Initialize Isotope on the container
  const iso = new Isotope(".car-grid", {
    itemSelector: ".car-item",
    layoutMode: "fitRows",
    filter: "*",
  });

  // Update no results message based on filtered items
  function updateNoResults() {
    const visibleItems = container.querySelectorAll(
      '.car-item:not([style*="display: none"])'
    ).length;
    if (visibleItems === 0) {
      noResults.style.display = "block";
    } else {
      noResults.style.display = "none";
    }
  }

  // Sorting functionality
  const sortSelect = document.getElementById("sortSelect");

  sortSelect.addEventListener("change", function () {
    const sortValue = this.value;
    let sortedCars = [...carData];

    if (sortValue === "default") {
      // Newest first (car45 to car1)
      sortedCars = sortedCars.reverse();
    } else if (sortValue === "oldest") {
      // Oldest first (car1 to car45)
      sortedCars = sortedCars; // Keep original order
    } else if (sortValue === "priceLow") {
      // Price: Low to High
      sortedCars = sortedCars.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ""));
        const priceB = parseInt(b.price.replace(/[^\d]/g, ""));
        return priceA - priceB;
      });
    } else if (sortValue === "priceHigh") {
      // Price: High to Low
      sortedCars = sortedCars.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ""));
        const priceB = parseInt(b.price.replace(/[^\d]/g, ""));
        return priceB - priceA;
      });
    }

    // Rebuild the car grid with sorted cars
    container.innerHTML = "";
    sortedCars.forEach((car) => {
      const item = document.createElement("div");
      item.classList.add("car-item", "col-md-6", "col-lg-4", "mb-4");

      const priceValue = car.price.replace(/[^\d]/g, "");
      const soldBadge = car.sold ? '<span class="sold">SOLD</span>' : "";

      item.innerHTML = `
        <div class="card car-card" data-make="${car.name}" data-model="${car.model}" data-price="${priceValue}" data-condition="${car.condition}" data-year="${car.year}">
          <a href="car-details.html?id=${car.id}">
            <img src="${car.images[0]}" class="card-img-top" alt="${car.name}" style="height: 250px; object-fit: cover;">
          </a>
          <div class="card-body">
            ${soldBadge}
            <h5 class="card-title">${car.name}</h5>
            <p class="card-text">${car.price} • ${car.location}</p>
            <a href="car-details.html?id=${car.id}" class="btn btn-sm btn-primary">View Details</a>
          </div>
        </div>
      `;

      container.appendChild(item);
    });

    // Reinitialize Isotope after sorting
    iso.reloadItems();
    iso.arrange();

    // Reapply any active filters after sorting
    applyFilters();
  });

  // Filter button logic
  // document.querySelector('.btn-block').addEventListener('click', function () {
  //   const make = document.getElementById('makeFilter').value.trim().toLowerCase();
  //   const model = document.getElementById('modelFilter').value.trim().toLowerCase();
  //   const year = document.getElementById('yearFilter').value; // Not used here unless you add data-year
  //   const price = document.getElementById('priceFilter').value;
  //   const mileage = document.getElementById('mileageFilter').value; // Not used unless data-mileage is added
  //   const condition = document.getElementById('conditionFilter').value; // Not used unless data-condition is added
  //   const location = document.getElementById('locationFilter').value.trim().toLowerCase();

  //   iso.arrange({
  //     filter: function (elem) {
  //       const card = elem.querySelector('.car-card');
  //       const data = card.dataset;

  //       const matchMake = !make || data.make.toLowerCase().includes(make);
  //       const matchModel = !model || data.model.toLowerCase().includes(model);

  //       let matchPrice = true;
  //       const priceInt = parseInt(data.price);
  //       if (price === '₦0 - ₦2M') matchPrice = priceInt <= 2000000;
  //       else if (price === '₦2M - ₦5M') matchPrice = priceInt > 2000000 && priceInt <= 5000000;
  //       else if (price === '₦5M+') matchPrice = priceInt > 5000000;

  //       const matchLocation = !location || card.innerText.toLowerCase().includes(location);

  //       return matchMake && matchModel && matchPrice && matchLocation;
  //     }
  //   });
  // });

  // Filter function
  function applyFilters() {
    const make = document
      .getElementById("makeFilter")
      .value.trim()
      .toLowerCase();
    const model = document
      .getElementById("modelFilter")
      .value.trim()
      .toLowerCase();
    const price = document.getElementById("priceFilter").value;
    const year = document.getElementById("yearFilter").value;
    const location = document
      .getElementById("locationFilter")
      .value.trim()
      .toLowerCase();
    const condition = document.getElementById("conditionFilter").value;

    iso.arrange({
      filter: function (elem) {
        const card = elem.querySelector(".car-card");
        const data = card.dataset;

        const matchMake = !make || data.make.toLowerCase().includes(make);
        const matchModel = !model || data.model.toLowerCase().includes(model);

        let matchPrice = true;
        const priceInt = parseInt(data.price);
        if (price === "₦0 - ₦2M") matchPrice = priceInt <= 2000000;
        else if (price === "₦2M - ₦5M")
          matchPrice = priceInt > 2000000 && priceInt <= 5000000;
        else if (price === "₦5M+") matchPrice = priceInt > 5000000;

        const matchYear = !year || year === "All Years" || data.year === year;

        const matchLocation =
          !location || card.innerText.toLowerCase().includes(location);

        const matchCondition =
          !condition ||
          condition.toLowerCase() === "all" ||
          (data.condition &&
            data.condition.toLowerCase().includes(condition.toLowerCase()));

        return (
          matchMake &&
          matchModel &&
          matchPrice &&
          matchYear &&
          matchLocation &&
          matchCondition
        );
      },
    });

    // Update no results message after filtering
    setTimeout(updateNoResults, 100);
  }

  // Reset filters button
  document
    .getElementById("resetFiltersBtn")
    .addEventListener("click", function () {
      // Clear all filter inputs
      document.getElementById("makeFilter").value = "";
      document.getElementById("modelFilter").value = "";
      document.getElementById("priceFilter").value = "All";
      document.getElementById("locationFilter").value = "";
      document.getElementById("conditionFilter").value = "All";
      document.getElementById("yearFilter").value = "All Years";
      document.getElementById("mileageFilter").value = "";

      // Reset Isotope to show all items
      iso.arrange({ filter: "*" });

      // Update no results message
      setTimeout(updateNoResults, 100);
    });

  // Real-time filtering on input/change
  document.getElementById("makeFilter").addEventListener("input", applyFilters);
  document
    .getElementById("modelFilter")
    .addEventListener("input", applyFilters);
  document
    .getElementById("priceFilter")
    .addEventListener("change", applyFilters);
  document
    .getElementById("locationFilter")
    .addEventListener("input", applyFilters);
  document
    .getElementById("conditionFilter")
    .addEventListener("change", applyFilters);
  document
    .getElementById("yearFilter")
    .addEventListener("change", applyFilters);
  document
    .getElementById("mileageFilter")
    .addEventListener("input", applyFilters);
});
