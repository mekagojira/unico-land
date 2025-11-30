/**
 * HTTP Cache Headers Utility
 * Provides cache control headers for API responses
 */

// Cache duration constants (in seconds)
export const CACHE_DURATIONS = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
};

/**
 * Set cache headers for GET requests
 * @param {Object} c - Hono context
 * @param {number} maxAge - Cache duration in seconds (default: 5 minutes)
 * @param {boolean} mustRevalidate - Whether to require revalidation (default: true)
 */
export const setCacheHeaders = (
  c,
  maxAge = CACHE_DURATIONS.MEDIUM,
  mustRevalidate = true
) => {
  const cacheControl = mustRevalidate
    ? `public, max-age=${maxAge}, must-revalidate`
    : `public, max-age=${maxAge}`;

  c.header("Cache-Control", cacheControl);
  c.header("Vary", "Accept, Accept-Language");
};

/**
 * Set cache invalidation headers for POST/PUT/DELETE requests
 * This tells browsers and CDNs to not cache the response
 * @param {Object} c - Hono context
 */
export const setNoCacheHeaders = (c) => {
  c.header(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  c.header("Pragma", "no-cache");
  c.header("Expires", "0");
};
