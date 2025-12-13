// Cloudflare Worker for Dynamic Open Graph Tags
// This intercepts requests and generates car-specific OG tags

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  },
};

async function handleRequest(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get("User-Agent") || "";

  // Check if this is a social media bot OR if it's car-details.html (for testing)
  const isSocialBot =
    /facebookexternalhit|Twitterbot|WhatsApp|LinkedInBot|Pinterest|facebookcatalog/i.test(
      userAgent
    );

  // Intercept ALL car-details.html requests (not just bots) for now
  if (url.pathname.includes("car-details.html")) {
    const carId = url.searchParams.get("id");

    if (carId) {
      // Fetch the original page from GitHub Pages directly
      // Add /EgoCarz/ if not already in path
      let pathname = url.pathname;
      if (!pathname.includes("/EgoCarz/")) {
        pathname = "/EgoCarz" + pathname;
      }
      const githubUrl = `https://aloego.github.io${pathname}${url.search}`;
      const response = await fetch(githubUrl);
      let html = await response.text();

      // Fetch car data (you'll need to host cars-data.js or include it here)
      const carData = await getCarData(carId);

      if (carData) {
        // Inject dynamic OG tags
        const ogTags = generateOGTags(carData, url.href);
        html = html.replace("</head>", `${ogTags}</head>`);
      }

      return new Response(html, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      });
    }
  }

  // For regular users or other pages, just fetch normally
  return fetch(request);
}

async function getCarData(carId) {
  // Car data mapping - you can either:
  // 1. Fetch from your cars-data.js file
  // 2. Store data here (inline)
  // 3. Use KV storage

  // For simplicity, here's an example with inline data
  const cars = {
    car1: {
      name: "Lexus RX 350",
      price: "₦27,500,000",
      year: 2013,
      shortDescription:
        "Luxury SUV with reverse camera, navigation, and power boot.",
      image: "https://aloego.github.io/EgoCarz/images/lexusrx350010.jpeg",
    },
    car2: {
      name: "Toyota Highlander",
      price: "₦23,500,000",
      year: 2013,
      shortDescription:
        "Spacious family SUV with full options and keyless entry.",
      image:
        "https://aloego.github.io/EgoCarz/images/toyotahighlander2013.jpeg",
    },
    // Add more cars here or fetch from external source
  };

  return cars[carId];
}

function generateOGTags(car, url) {
  return `
    <!-- Open Graph / Facebook -->
    <meta property="og:title" content="${car.name} ${car.year} - ${car.price}">
    <meta property="og:description" content="${car.shortDescription}">
    <meta property="og:image" content="${car.image}">
    <meta property="og:image:secure_url" content="${car.image}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${car.name} ${car.year}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="EgoCarz">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${car.name} ${car.year} - ${car.price}">
    <meta name="twitter:description" content="${car.shortDescription}">
    <meta name="twitter:image" content="${car.image}">
    <meta name="twitter:url" content="${url}">
  `;
}
