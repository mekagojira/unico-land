import { Hono } from "hono";
import {
  sendMessage,
  listMessages,
  getMessage,
  markRead,
} from "../controllers/contactController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = new Hono();

// Public: send message to admin
router.post("/", sendMessage);

// Admin-only: list and manage messages (specific routes before /:id)
router.get("/", authenticate, authorize("admin"), listMessages);
router.patch("/:id/read", authenticate, authorize("admin"), markRead);
router.get("/:id", authenticate, authorize("admin"), getMessage);

export default router;
