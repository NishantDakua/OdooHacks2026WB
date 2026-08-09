import crypto from "crypto";

/**
 * Express Middleware for public GET endpoint HTTP caching and ETag validation.
 * @param {number} [maxAgeSeconds=300] - Browser max age (5 mins)
 * @param {number} [staleWhileRevalidateSeconds=600] - Stale while revalidate window (10 mins)
 */
export function cacheMiddleware(maxAgeSeconds = 300, staleWhileRevalidateSeconds = 600) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Set Cache-Control header
    res.setHeader(
      "Cache-Control",
      `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`
    );

    // ETag generation override
    const originalSend = res.send;
    res.send = function (body) {
      if (typeof body === "string" || Buffer.isBuffer(body)) {
        const etag = `W/"${crypto.createHash("md5").update(body).digest("hex")}"`;
        res.setHeader("ETag", etag);

        if (req.headers["if-none-match"] === etag) {
          res.status(304).end();
          return;
        }
      }
      return originalSend.call(this, body);
    };

    next();
  };
}
