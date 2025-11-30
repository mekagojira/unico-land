import { Hono } from "hono";
import {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = new Hono();

// Get routes (public)
router.get("/", getAllServices);
router.get("/:id", getService);

// Create, update, delete routes (editor/admin)
router.post("/", authenticate, authorize("editor", "admin"), createService);
router.put("/:id", authenticate, authorize("editor", "admin"), updateService);
router.delete("/:id", authenticate, authorize("admin"), deleteService);

export default router;

