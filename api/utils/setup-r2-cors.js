import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, "../.env") });

const setupCORS = async () => {
  try {
    const endpoint = process.env.R2_ENDPOINT;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME || "unico-land";

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      console.error("❌ Error: R2 credentials not found in .env file");
      console.error(
        "Required: R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY"
      );
      process.exit(1);
    }

    const s3Client = new S3Client({
      region: "auto",
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    // CORS configuration
    // Note: R2 CORS doesn't support wildcards in AllowedOrigins, so we need to list each origin explicitly
    const corsConfiguration = {
      CORSRules: [
        {
          AllowedOrigins: [
            "http://localhost:5173", // Vite dev server
            "http://localhost:3000", // Alternative dev port
            "http://localhost:3001", // Alternative dev port
            "https://uni-co-group.com", // Production domain
            // Note: Wildcards like "https://*.uni-co-group.com" don't work in R2 CORS
            // Add specific subdomains if needed
          ],
          AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD", "OPTIONS"],
          AllowedHeaders: [
            "*", // Allow all headers for presigned URL uploads
            "Content-Type",
            "Content-Length",
            "Content-MD5",
            "Authorization",
            "x-amz-date",
            "x-amz-content-sha256",
            "x-amz-user-agent",
            "x-amz-security-token",
            "x-amz-checksum-crc32",
            "x-amz-sdk-checksum-algorithm",
            "x-id",
          ],
          ExposeHeaders: [
            "ETag",
            "x-amz-request-id",
            "x-amz-id-2",
            "x-amz-version-id",
          ],
          MaxAgeSeconds: 3600,
        },
      ],
    };

    const command = new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: corsConfiguration,
    });

    console.log("📝 Configuring CORS for R2 bucket:", bucketName);
    console.log(
      "   Allowed origins:",
      corsConfiguration.CORSRules[0].AllowedOrigins.join(", ")
    );
    console.log(
      "   Allowed methods:",
      corsConfiguration.CORSRules[0].AllowedMethods.join(", ")
    );

    const result = await s3Client.send(command);
    console.log("Result:", result);

    console.log("✅ CORS configuration applied successfully!");
    console.log(
      "\n💡 Note: If you're using Cloudflare Workers, you may also need to configure CORS via the Cloudflare Dashboard:"
    );
    console.log(
      "   1. Go to Cloudflare Dashboard > R2 > Your Bucket > Settings"
    );
    console.log("   2. Add CORS policy with the same configuration");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error configuring CORS:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
};

setupCORS();
