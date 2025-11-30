import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { S3Client, GetBucketCorsCommand } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, "../.env") });

const checkCORS = async () => {
  try {
    const endpoint = process.env.R2_ENDPOINT;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME || "unico-land";

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      console.error("❌ Error: R2 credentials not found in .env file");
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

    const command = new GetBucketCorsCommand({
      Bucket: bucketName,
    });

    console.log("📋 Checking CORS configuration for bucket:", bucketName);
    const response = await s3Client.send(command);

    if (response.CORSRules && response.CORSRules.length > 0) {
      console.log("✅ CORS is configured:");
      response.CORSRules.forEach((rule, index) => {
        console.log(`\n  Rule ${index + 1}:`);
        console.log("    AllowedOrigins:", rule.AllowedOrigins?.join(", ") || "None");
        console.log("    AllowedMethods:", rule.AllowedMethods?.join(", ") || "None");
        console.log("    AllowedHeaders:", rule.AllowedHeaders?.join(", ") || "None");
        console.log("    MaxAgeSeconds:", rule.MaxAgeSeconds || "Not set");
      });
    } else {
      console.log("❌ No CORS configuration found");
      console.log("\n💡 Run: bun utils/setup-r2-cors.js to configure CORS");
    }
  } catch (error) {
    if (error.name === "NoSuchCORSConfiguration") {
      console.log("❌ No CORS configuration found");
      console.log("\n💡 Run: bun utils/setup-r2-cors.js to configure CORS");
    } else {
      console.error("❌ Error checking CORS:", error.message);
      if (error.stack) {
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
};

checkCORS();

