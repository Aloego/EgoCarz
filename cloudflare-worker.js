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

  // Check if this is a social media bot
  const isSocialBot =
    /facebookexternalhit|Twitterbot|WhatsApp|LinkedInBot|Pinterest|facebookcatalog/i.test(
      userAgent
    );

  // Only intercept car-details.html requests from social bots
  if (isSocialBot && url.pathname.includes("car-details.html")) {
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

      // Fetch car data
      const carData = await getCarData(carId);

      if (carData) {
        // Remove existing OG tags first
        html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, "");
        html = html.replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, "");

        // Inject new dynamic OG tags
        const ogTags = generateOGTags(carData, url.href);
        html = html.replace("</head>", `${ogTags}\n</head>`);
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
  try {
    // Fetch cars-og-data.json from GitHub - automatically updates when you push changes!
    const response = await fetch(
      "https://aloego.github.io/EgoCarz/cars-og-data.json"
    );
    const carData = await response.json();

    // Find the car by ID
    const car = carData.find((c) => c.id === carId);

    return car || null;
  } catch (error) {
    // Fallback to car1 if fetch fails
    return {
      name: "Lexus RX 350",
      price: "₦27,500,000",
      year: 2013,
      shortDescription:
        "Luxury SUV with reverse camera, navigation, and power boot.",
      image: "https://aloego.github.io/EgoCarz/images/lexusrx350010.jpeg",
    };
  }
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

    <!-- Instagram (for parity, not used by Instagram web sharing) -->
    <meta name="instagram:title" content="${car.name} ${car.year} - ${car.price}">
    <meta name="instagram:description" content="${car.shortDescription}">
    <meta name="instagram:image" content="${car.image}">
    <meta name="instagram:url" content="${url}">
  `;
}
