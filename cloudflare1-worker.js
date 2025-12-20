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

  // Intercept car-details.html and blog-post.html for social bots
  if (
    isSocialBot &&
    (url.pathname.includes("car-details.html") ||
      url.pathname.includes("blog-post.html"))
  ) {
    let id = url.searchParams.get("id");
    let isCar = url.pathname.includes("car-details.html");
    let isBlog = url.pathname.includes("blog-post.html");
    if (id) {
      // Fetch the original page from GitHub Pages directly
      let pathname = url.pathname;
      if (!pathname.includes("/EgoCarz/")) {
        pathname = "/EgoCarz" + pathname;
      }
      const githubUrl = `https://aloego.github.io${pathname}${url.search}`;
      const response = await fetch(githubUrl);
      let html = await response.text();

      let data = null;
      if (isCar) {
        data = await getCarData(id);
      } else if (isBlog) {
        data = await getBlogPostData(id);
      }

      if (data) {
        // Remove existing OG/Twitter tags first
        html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, "");
        html = html.replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, "");

        // Inject new dynamic OG tags
        const ogTags = isCar
          ? generateOGTags(data, url.href)
          : generateBlogOGTags(data, url.href);
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
  async function getBlogPostData(postId) {
    try {
      const response = await fetch(
        "https://aloego.github.io/EgoCarz/blog-posts.json"
      );
      const posts = await response.json();
      const post = posts.find((p) => p.id === postId);
      return post || null;
    } catch (error) {
      return null;
    }
  }
  function generateBlogOGTags(post, url) {
    // Fallbacks for missing fields
    const title = post.title || "EgoCarz Blog Post";
    const description =
      post.excerpt ||
      post.content?.replace(/<[^>]+>/g, "").substring(0, 150) ||
      "Read this blog post on EgoCarz";
    const image = post.image
      ? `https://aloego.github.io/EgoCarz/${post.image.replace(/^\//, "")}`
      : "https://aloego.github.io/EgoCarz/images/lexusrx350010.jpeg";
    return `
      <!-- Open Graph / Facebook -->
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${image}">
      <meta property="og:image:secure_url" content="${image}">
      <meta property="og:image:type" content="image/jpeg">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:image:alt" content="${title}">
      <meta property="og:url" content="${url}">
      <meta property="og:type" content="article">
      <meta property="og:site_name" content="EgoCarz">
      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${image}">
      <meta name="twitter:url" content="${url}">
    `;
  }
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
  `;
}
