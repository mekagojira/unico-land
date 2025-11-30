import { Hono } from "hono";
import {
  getAllContent,
  getContent,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
} from "../controllers/contentController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = new Hono();

// All routes require authentication
// router.use("*", authenticate);

// Get routes (viewer and above)
router.get("/", getAllContent);
router.get("/slug/:slug", getContentBySlug);
router.get("/:id", getContent);

// Create, update, delete routes (editor and above)
router.post("/", authorize("editor", "admin"), createContent);
router.put("/:id", authorize("editor", "admin"), updateContent);
router.delete("/:id", authorize("admin"), deleteContent);

export default router;
