// Cloudflare Worker for Blog Post Social Cards
// Serves optimized meta tags and images for Facebook, Twitter, WhatsApp, Instagram, etc.

export default {
  async fetch(request, env, ctx) {
    return handleBlogSocialRequest(request);
  },
};

async function handleBlogSocialRequest(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get("User-Agent") || "";
  const isSocialBot =
    /facebookexternalhit|Twitterbot|WhatsApp|LinkedInBot|Pinterest|facebookcatalog/i.test(
      userAgent
    );

  // Only intercept blog post requests for social bots
  if (isSocialBot && url.pathname.includes("blog-post.html")) {
    const postId = url.searchParams.get("id");
    if (postId) {
      // Fetch blog post data
      const response = await fetch(
        "https://aloego.github.io/EgoCarz/blog-posts.json"
      );
      const posts = await response.json();
      const post = posts.find((p) => p.id === postId);
      if (post) {
        // Ensure image is absolute and sized to 1200x630px
        let imageUrl = post.image || "images/placeholder.jpg";
        if (!/^https?:\/\//.test(imageUrl)) {
          imageUrl = `https://aloego.github.io/EgoCarz/${imageUrl.replace(
            /^\/+/,
            ""
          )}`;
        }
        // If you have a resizing service, use it here
        // imageUrl = `https://img-resize.example.com/1200x630/${imageUrl}`;

        // Generate canonical URL
        const canonicalUrl = `https://aloego.github.io/EgoCarz/blog-post.html?id=${postId}`;

        // Generate meta tags
        const metaTags = `
          <meta property="og:title" content="${post.title}">
          <meta property="og:description" content="${post.excerpt}">
          <meta property="og:image" content="${imageUrl}">
          <meta property="og:image:secure_url" content="${imageUrl}">
          <meta property="og:image:type" content="image/jpeg">
          <meta property="og:image:width" content="1200">
          <meta property="og:image:height" content="630">
          <meta property="og:url" content="${canonicalUrl}">
          <meta property="og:type" content="article">
          <meta property="og:site_name" content="EgoCarz">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${post.title}">
          <meta name="twitter:description" content="${post.excerpt}">
          <meta name="twitter:image" content="${imageUrl}">
          <meta name="twitter:url" content="${canonicalUrl}">
        `;

        // Fetch original HTML
        const originalResponse = await fetch(url.href);
        let html = await originalResponse.text();
        // Remove existing OG/Twitter tags
        html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, "");
        html = html.replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, "");
        // Inject new meta tags
        html = html.replace("</head>", `${metaTags}\n</head>`);

        return new Response(html, {
          headers: { "content-type": "text/html;charset=UTF-8" },
        });
      }
    }
  }
  // Fallback: fetch normally
  return fetch(request);
}
