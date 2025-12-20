export default {
  async fetch(request) {
    return handleRequest(request);
  },
};

async function handleRequest(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get("User-Agent") || "";

  const isSocialBot =
    /facebookexternalhit|Twitterbot|WhatsApp|LinkedInBot|Pinterest|facebookcatalog/i.test(
      userAgent
    );

  const isCar = url.pathname.includes("car-details.html");
  const isBlog = url.pathname.includes("blog-post.html");
  const id = url.searchParams.get("id");

  if (isSocialBot && id && (isCar || isBlog)) {
    let pathname = url.pathname.startsWith("/EgoCarz/")
      ? url.pathname
      : `/EgoCarz${url.pathname}`;

    const githubUrl = `https://aloego.github.io${pathname}${url.search}`;
    const response = await fetch(githubUrl);
    let html = await response.text();

    const data = isCar ? await getCarData(id) : await getBlogPostData(id);

    if (data) {
      html = html
        .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, "")
        .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, "");

      const ogTags = isCar
        ? generateCarOGTags(data, url.href)
        : generateBlogOGTags(data, url.href);

      html = html.replace("</head>", `${ogTags}\n</head>`);
    }

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
        "cache-control": "no-store, no-cache, must-revalidate",
      },
    });
  }

  return fetch(request);
}

// Data Loaders for Cars
async function getCarData(carId) {
  try {
    const response = await fetch(
      "https://aloego.github.io/EgoCarz/cars-og-data.json"
    );
    const cars = await response.json();
    return cars.find((c) => c.id === carId) || null;
  } catch {
    return null;
  }
}

//  Data Loader for Blog Posts
async function getBlogPostData(postId) {
  try {
    const response = await fetch(
      "https://aloego.github.io/EgoCarz/blog-posts.json"
    );
    const posts = await response.json();
    return posts.find((p) => p.id === postId) || null;
  } catch {
    return null;
  }
}

//  OG Tag Generators (same as in cloudflare1-worker.js)
function generateCarOGTags(car, url) {
  return `
    <meta property="og:title" content="${car.name} ${car.year} - ${car.price}">
    <meta property="og:description" content="${car.shortDescription}">
    <meta property="og:image" content="${car.image}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="EgoCarz">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${car.name} ${car.year} - ${car.price}">
    <meta name="twitter:description" content="${car.shortDescription}">
    <meta name="twitter:image" content="${car.image}">
  `;
}
