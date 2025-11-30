import { Hono } from "hono";
import { register, login, getMe } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = new Hono();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);

export default router;

