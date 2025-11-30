import { Hono } from "hono";

const router = new Hono();

// GET API status
router.get("/", (c) => {
  return c.json({
    success: true,
    message: "Uni-Co CMS API is running",
    version: "1.0.0",
  });
});

export default router;

