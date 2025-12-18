// js/featured-cars.js - Dynamically load featured cars from newest to oldest

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("featuredCarsContainer");

  if (!container) return;

  // Reverse the carData array to show newest first (car45 to car1)
  const reversedCars = [...carData].reverse();

  // Generate HTML for each car
  // reversedCars.forEach((car) => {
  //   const carCard = document.createElement("div");
  //   carCard.className = "col-md-4 mb-4";

  //   // Check if car is sold (you can add a 'sold' field to your car data)
  //   const soldBadge = car.sold ? '<span class="sold">SOLD</span>' : "";

  //   carCard.innerHTML = `
  //     <div class="card">
  //       <a href="car-details.html?id=${car.id}">
  //         <img
  //           src="${car.images[0]}"
  //           class="card-img-top"
  //           alt="${car.name}"
  //           style="height: 250px; object-fit: cover;"
  //         />
  //       </a>
  //       <div class="card-body">
  //         ${soldBadge}
  //         <h5 class="card-title">${car.name}</h5>
  //         <p class="card-text">${car.price} • ${car.location}</p>
  //         <a
  //           href="car-details.html?id=${car.id}"
  //           class="btn btn-primary btn-sm"
  //         >View Details</a>
  //       </div>
  //     </div>
  //   `;

  //   container.appendChild(carCard);
  // });

  // ...existing code...
  reversedCars.forEach((car) => {
    if (car.sold === true) return; // Skip cars marked as SOLD

    const carCard = document.createElement("div");
    carCard.className = "col-md-4 mb-4";

    carCard.innerHTML = `
    <div class="card">
      <a href="car-details.html?id=${car.id}">
        <img
          src="${car.images[0]}"
          class="card-img-top"
          alt="${car.name}"
          style="height: 250px; object-fit: cover;"
        />
      </a>
      <div class="card-body">
        <h5 class="card-title">${car.name}</h5>
        <p class="card-text">${car.price} • ${car.location}</p>
        <a
          href="car-details.html?id=${car.id}"
          class="btn btn-primary btn-sm"
        >View Details</a>
      </div>
    </div>
  `;

    container.appendChild(carCard);
  });
  // ...existing code...
});
