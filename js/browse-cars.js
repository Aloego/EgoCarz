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
  




document.addEventListener("DOMContentLoaded", () => {
    const carGrid = document.getElementById("carGrid");
    const filterForm = document.getElementById("filterForm");
    const sortSelect = document.getElementById("sortSelect");
    const noResults = document.getElementById("noResults");
  
    function renderCars(cars) {
      carGrid.innerHTML = "";
      if (cars.length === 0) {
        noResults.style.display = "block";
        return;
      }
      noResults.style.display = "none";
      cars.forEach(car => {
        const carCard = document.createElement("div");
        carCard.className = "col-md-4 col-lg-4 mb-4";
        carCard.innerHTML = `
          <div class="card car-card">
            <img src="${car.image}" class="card-img-top" alt="${car.make} ${car.model}">
            <div class="card-body">
              <h5 class="card-title">${car.make} ${car.model} ${car.year}</h5>
              <p class="card-text">₦${car.price.toLocaleString()} • ${car.mileage.toLocaleString()}km • ${car.location}</p>
              <a href="car-details.html?id=${car.id}" class="btn btn-sm btn-primary">View Details</a>
            </div>
          </div>
        `;
        carGrid.appendChild(carCard);
      });
    }
  
    function applyFilters() {
      let filteredCars = [...carData];
      const make = document.getElementById("makeFilter").value.toLowerCase();
      const model = document.getElementById("modelFilter").value.toLowerCase();
      const year = document.getElementById("yearFilter").value;
      const priceRange = document.getElementById("priceFilter").value;
      const mileage = document.getElementById("mileageFilter").value;
      const condition = document.getElementById("conditionFilter").value;
      const location = document.getElementById("locationFilter").value.toLowerCase();
  
      if (make) {
        filteredCars = filteredCars.filter(car => car.make.toLowerCase().includes(make));
      }
      if (model) {
        filteredCars = filteredCars.filter(car => car.model.toLowerCase().includes(model));
      }
      if (year) {
        filteredCars = filteredCars.filter(car => car.year.toString() === year);
      }
      if (priceRange) {
        const [min, max] = priceRange.split("-").map(p => parseInt(p.replace("₦", "").replace("M", "000000")));
        filteredCars = filteredCars.filter(car => {
          if (max) {
            return car.price >= min && car.price <= max;
          }
          return car.price >= min;
        });
      }
      if (mileage) {
        filteredCars = filteredCars.filter(car => car.mileage <= parseInt(mileage));
      }
      if (condition) {
        filteredCars = filteredCars.filter(car => car.condition === condition);
      }
      if (location) {
        filteredCars = filteredCars.filter(car => car.location.toLowerCase().includes(location));
      }
  
      return filteredCars;
    }
  
    function applySort(cars) {
      const sortValue = sortSelect.value;
      if (sortValue === "priceLow") {
        return cars.sort((a, b) => a.price - b.price);
      } else if (sortValue === "priceHigh") {
        return cars.sort((a, b) => b.price - a.price);
      }
      // Default is newest; assuming newer cars have higher year
      return cars.sort((a, b) => b.year - a.year);
    }
  
    function updateCarDisplay() {
      const filtered = applyFilters();
      const sorted = applySort(filtered);
      renderCars(sorted);
    }
  
    filterForm.addEventListener("submit", event => {
      event.preventDefault();
      updateCarDisplay();
    });
  
    sortSelect.addEventListener("change", updateCarDisplay);
  
    // Initial render
    renderCars(carData);
  });
  
 