import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

// Import routes
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import contentRouter from "./routes/content.js";
import uploadRouter from "./routes/upload.js";
import companyRouter from "./routes/company.js";
import servicesRouter from "./routes/services.js";

// Import error handler
import { errorHandler } from "./middleware/errorHandler.js";

const app = new Hono();

// CORS middleware
app.use(
  "*",
  cors({
    origin: (origin) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173", // Vite dev server (admin panel)
        "https://uni-co-group.com",
      ];
      const corsOrigin = allowedOrigins.includes(origin) ? origin : "*";
      return corsOrigin;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Logger middleware
app.use("*", logger());

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.route("/", indexRouter);
app.route("/api/auth", authRouter);
app.route("/api/content", contentRouter);
app.route("/api/upload", uploadRouter);
app.route("/api/company", companyRouter);
app.route("/api/services", servicesRouter);

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: "Route not found",
    },
    404
  );
});

// Error handler (must be last)
app.onError(errorHandler);

// Export for Cloudflare Workers and Node.js
// When using wrangler dev or deploy, this ensures the environment is passed correctly
// Hono automatically makes env available via c.env in handlers
export default {
  fetch: (request, env, ctx) => {
    // Pass environment to Hono context
    // Hono will make env available as c.env in all handlers
    return app.fetch(request, env, ctx);
  },
};

