import { Hono } from "hono";
import { listPosts, getPostBySlug } from "../controllers/blogController.js";

const router = new Hono();

// Public routes – no auth
router.get("/", listPosts);
router.get("/:slug", getPostBySlug);

export default router;
