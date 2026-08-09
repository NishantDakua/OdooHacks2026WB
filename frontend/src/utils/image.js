/**
 * Image optimization utilities for Cloudinary, Unsplash, and standard image assets.
 */

/**
 * Generates an optimized image URL using Cloudinary/Unsplash dynamic transformation parameters.
 * @param {string} url - Original image URL
 * @param {object} options - Transformation options
 * @param {number} [options.width=400] - Target width in pixels
 * @param {string} [options.quality="auto"] - Quality setting ("auto", "80", etc.)
 * @param {string} [options.format="auto"] - Format setting ("auto" selects AVIF/WebP)
 * @returns {string} - Optimized URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== "string") return "";

  const { width = 400, quality = "auto", format = "auto" } = options;

  // Cloudinary URL Optimization
  if (url.includes("cloudinary.com") && url.includes("/upload/")) {
    const transformStr = `f_${format},q_${quality},w_${width},c_limit`;
    // Insert transformation string right after '/upload/'
    return url.replace("/upload/", `/upload/${transformStr}/`);
  }

  // Unsplash Image Optimization
  if (url.includes("images.unsplash.com")) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set("w", width.toString());
      urlObj.searchParams.set("q", quality === "auto" ? "80" : quality);
      urlObj.searchParams.set("auto", "format");
      return urlObj.toString();
    } catch {
      return url;
    }
  }

  return url;
}

/**
 * Generates a responsive srcset attribute string for Cloudinary / Unsplash images.
 * @param {string} url - Original image URL
 * @param {number[]} [widths=[320, 640, 960, 1200]] - Array of target widths
 * @returns {string} - srcset attribute string
 */
export function getResponsiveSrcSet(url, widths = [320, 640, 960, 1200]) {
  if (!url || typeof url !== "string") return "";

  if (url.includes("cloudinary.com") || url.includes("images.unsplash.com")) {
    return widths
      .map((w) => `${getOptimizedImageUrl(url, { width: w })} ${w}w`)
      .join(", ");
  }

  return "";
}
