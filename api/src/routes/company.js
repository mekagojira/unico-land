import { Hono } from "hono";
import { getCompanyInfo, updateCompanyInfo } from "../controllers/companyController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = new Hono();

// Get company info (public)
router.get("/", getCompanyInfo);

// Update company info (admin only)
router.put("/", authenticate, authorize("admin"), updateCompanyInfo);

export default router;

