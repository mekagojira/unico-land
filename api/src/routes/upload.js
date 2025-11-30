import { Hono } from "hono";
import {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  generatePresignedUrl,
} from "../controllers/uploadController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = new Hono();

// All routes require authentication
router.use("*", authenticate);

// Generate presigned URL for direct upload (editor and above)
router.post("/presigned", authorize("editor", "admin"), generatePresignedUrl);

// Upload routes (editor and above) - kept for backward compatibility
router.post("/", authorize("editor", "admin"), uploadFile);
router.post("/multiple", authorize("editor", "admin"), uploadMultipleFiles);

// Delete route (editor and above)
router.delete("/:key", authorize("editor", "admin"), deleteFile);

export default router;

