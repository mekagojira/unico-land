/**
 * LocalStorage Cache Utility
 * Provides caching functionality with expiration
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

const CACHE_PREFIX = 'unico_api_cache_';
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached data if it exists and hasn't expired
 */
export function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return null;

    const item: CacheItem<T> = JSON.parse(cached);
    const now = Date.now();

    // Check if cache has expired
    if (now - item.timestamp > item.expiresIn) {
      // Cache expired, remove it
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return item.data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

/**
 * Set data in cache with expiration
 */
export function setCachedData<T>(
  key: string,
  data: T,
  expiresIn: number = DEFAULT_CACHE_DURATION
): void {
  try {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
  } catch (error) {
    console.error('Error writing to cache:', error);
    // If localStorage is full, try to clear old cache entries
    if (error instanceof DOMException && error.code === 22) {
      clearExpiredCache();
      // Try again
      try {
        const item: CacheItem<T> = {
          data,
          timestamp: Date.now(),
          expiresIn,
        };
        localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
      } catch (retryError) {
        console.error('Failed to cache after clearing expired entries:', retryError);
      }
    }
  }
}

/**
 * Remove cached data
 */
export function removeCachedData(key: string): void {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } catch (error) {
    console.error('Error removing from cache:', error);
  }
}

/**
 * Clear all expired cache entries
 */
export function clearExpiredCache(): void {
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();

    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const item: CacheItem<any> = JSON.parse(cached);
            if (now - item.timestamp > item.expiresIn) {
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          // Invalid cache entry, remove it
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error clearing expired cache:', error);
  }
}

/**
 * Clear all cache entries
 */
export function clearAllCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
}

/**
 * Cache keys
 */
export const CacheKeys = {
  COMPANY_INFO: 'company_info',
  SERVICES: (locale: string, active?: boolean) => 
    `services_${locale}_${active ? 'active' : 'all'}`,
  SERVICE: (id: string, locale: string) => `service_${id}_${locale}`,
} as const;

