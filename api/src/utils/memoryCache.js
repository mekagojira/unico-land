/**
 * In-Memory Cache Utility
 * Provides simple in-memory caching with TTL (Time To Live)
 */

class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  /**
   * Generate cache key from parts
   * @param {...string} parts - Key parts to join
   * @returns {string} Cache key
   */
  key(...parts) {
    return parts.join(":");
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null if not found/expired
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
   */
  set(key, value, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, {
      value,
      expiresAt,
    });
  }

  /**
   * Delete specific key from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Delete all keys matching a pattern
   * @param {string} pattern - Pattern to match (e.g., "services:*")
   */
  deletePattern(pattern) {
    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (this.matchesPattern(key, pattern)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Check if key matches pattern
   * Supports wildcard * at the end
   * @param {string} key - Cache key
   * @param {string} pattern - Pattern to match
   * @returns {boolean}
   */
  matchesPattern(key, pattern) {
    if (pattern.endsWith("*")) {
      const prefix = pattern.slice(0, -1);
      return key.startsWith(prefix);
    }
    return key === pattern;
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    const now = Date.now();
    let valid = 0;
    let expired = 0;

    for (const item of this.cache.values()) {
      if (Date.now() > item.expiresAt) {
        expired++;
      } else {
        valid++;
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired,
    };
  }

  /**
   * Clean expired entries
   */
  cleanExpired() {
    const now = Date.now();
    const keysToDelete = [];

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
    return keysToDelete.length;
  }
}

// Export singleton instance
export const memoryCache = new MemoryCache();

// Cache key generators
export const CacheKeys = {
  COMPANY_INFO: "company:info",
  SERVICES: (locale, active) =>
    `services:${locale}:${active ? "active" : "all"}`,
  SERVICE: (id, locale) => `service:${id}:${locale}`,
  CONTENT: (id) => `content:${id}`,
  CONTENT_SLUG: (slug, locale) => `content:slug:${slug}:${locale}`,
  CONTENT_LIST: (type, status, locale, page, limit) =>
    `content:list:${type || "all"}:${status || "all"}:${
      locale || "all"
    }:${page}:${limit}`,
};

// Auto-clean expired entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    memoryCache.cleanExpired();
  }, 10 * 60 * 1000);
}
