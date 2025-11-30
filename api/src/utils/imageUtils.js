/**
 * Image utilities for handling R2 keys and presigned URLs
 */

import { getR2Client } from "../config/r2.js";

/**
 * Extract R2 key from a URL
 * Handles various URL formats:
 * - https://s3.uni-co-group.com/company/image.png
 * - https://unico-land.xxx.r2.cloudflarestorage.com/unico-land/company/image.png
 * - company/image.png (already a key)
 */
export const extractKeyFromUrl = (url) => {
  if (!url) return null;
  
  // If it's already a key (no http/https), return as is
  if (!url.startsWith("http")) {
    return url;
  }
  
  try {
    const urlObj = new URL(url);
    // Remove bucket name prefix if present
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    if (pathParts.length > 1 && pathParts[0] === "unico-land") {
      return pathParts.slice(1).join("/");
    }
    return pathParts.join("/");
  } catch {
    // If it's not a full URL, assume it's already a key
    if (url.startsWith("http")) {
      // Try to extract from R2 public URL format
      const match = url.match(/\/unico-land\/(.+)$/);
      if (match && match[1]) {
        return match[1];
      }
      // Try generic URL pattern
      const match2 = url.match(/https?:\/\/[^\/]+\/(.+)$/);
      if (match2 && match2[1]) {
        return match2[1];
      }
    }
    return url; // Assume it's already a key
  }
};

/**
 * Generate presigned GET URL for an R2 key
 * @param {Object} env - Environment variables
 * @param {string} key - R2 key
 * @param {number} expiresIn - Expiration time in seconds (default: 7 days)
 * @returns {Promise<string|null>} Presigned URL or null if generation fails
 */
export const getPresignedUrlForKey = async (env, key, expiresIn = 3600 * 24 * 7) => {
  if (!key) return null;
  
  try {
    const r2Client = getR2Client(env || {});
    
    // Only works in Node.js (has s3Client)
    if (r2Client.s3Client && r2Client.getPresignedGetUrl) {
      return await r2Client.getPresignedGetUrl(key, expiresIn);
    }
    
    // In Workers, we can't generate presigned URLs
    // Return null to indicate we should use public URL or handle differently
    return null;
  } catch (error) {
    console.error("Error generating presigned URL for key:", key, error);
    return null;
  }
};

/**
 * Convert an array of image keys/URLs to presigned URLs
 * @param {Object} env - Environment variables
 * @param {string[]} images - Array of image keys or URLs
 * @returns {Promise<string[]>} Array of presigned URLs
 */
export const convertImageKeysToPresignedUrls = async (env, images) => {
  if (!Array.isArray(images) || images.length === 0) {
    return [];
  }
  
  const presignedUrls = await Promise.all(
    images.map(async (image) => {
      // Extract key from URL if it's a URL
      const key = extractKeyFromUrl(image);
      if (!key) return image; // Return original if we can't extract key
      
      // Generate presigned URL
      const presignedUrl = await getPresignedUrlForKey(env, key);
      return presignedUrl || image; // Fallback to original if presigned URL generation fails
    })
  );
  
  return presignedUrls;
};

