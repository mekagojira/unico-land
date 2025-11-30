// R2 configuration for Cloudflare Workers and Node.js
// R2 is accessed via bindings in Workers, or AWS SDK in Node.js

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Helper to get env value
const getEnv = (env, key, defaultValue = null) => {
  if (env && env[key]) return env[key];
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return defaultValue;
};

// Get R2 client - works in both Workers (bindings) and Node.js (AWS SDK)
export const getR2Client = (env = null) => {
  // In Workers, use the binding
  if (env && env.R2_BUCKET) {
    return env.R2_BUCKET;
  }
  
  // In Node.js, use AWS SDK with R2 credentials
  const endpoint = getEnv(env, 'R2_ENDPOINT');
  const accessKeyId = getEnv(env, 'R2_ACCESS_KEY_ID');
  const secretAccessKey = getEnv(env, 'R2_SECRET_ACCESS_KEY');
  const bucketName = getEnv(env, 'R2_BUCKET_NAME', 'unico-land');
  
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 credentials not found. For Node.js, set R2_ENDPOINT, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY. " +
      "For Workers, configure R2_BUCKET binding in wrangler.toml"
    );
  }
  
  // Create S3-compatible client for R2
  const s3Client = new S3Client({
    region: "auto",
    endpoint: endpoint,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
  
  // Return a compatible interface
  return {
    bucketName,
    s3Client, // Expose S3Client for presigned URLs
    async put(key, data, options = {}) {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: data,
        ContentType: options.httpMetadata?.contentType,
        Metadata: options.customMetadata,
      });
      await s3Client.send(command);
    },
    async delete(key) {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      await s3Client.send(command);
    },
    async getPresignedUrl(key, contentType, expiresIn = 3600) {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
      });
      return await getSignedUrl(s3Client, command, { expiresIn });
    },
    async getPresignedGetUrl(key, expiresIn = 3600) {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      return await getSignedUrl(s3Client, command, { expiresIn });
    },
  };
};

export const getR2PublicUrl = (env = null) => {
  return getEnv(env, 'R2_PUBLIC_URL', 'https://s3.uni-co-group.com');
};

