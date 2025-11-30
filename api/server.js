// Load environment variables
// Bun has built-in .env support, but we'll use dotenv for compatibility
import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file explicitly
config({ path: resolve(__dirname, ".env") });

import { serve } from "bun";
import app from "./src/index.js";

// Verify .env is loaded
if (typeof process !== "undefined" && process.env) {
  const hasD1Config =
    process.env.D1_ACCOUNT_ID &&
    process.env.D1_DATABASE_ID &&
    process.env.D1_API_TOKEN;
  if (!hasD1Config && process.env.NODE_ENV !== "production") {
    console.warn(
      "⚠️  Warning: D1 environment variables not found in .env file"
    );
    console.warn(
      "   Make sure you have a .env file in the api/ directory with:"
    );
    console.warn("   D1_ACCOUNT_ID=...");
    console.warn("   D1_DATABASE_ID=...");
    console.warn("   D1_API_TOKEN=...");
  } else if (hasD1Config) {
    console.log("✅ D1 environment variables loaded from .env");
  }
}

const port = parseInt(process.env.PORT || "3000", 10);

console.log(`🚀 Server starting on port ${port}...`);
console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
console.log(`⚡ Runtime: Bun ${Bun.version}`);

// MongoDB HTTP API doesn't require a persistent connection
// Connections are made per-request via HTTP

serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});

console.log(`✅ Server is running on http://localhost:${port}`);
console.log(`📡 Health check: http://localhost:${port}/health`);
console.log(`📚 API base: http://localhost:${port}/api`);
