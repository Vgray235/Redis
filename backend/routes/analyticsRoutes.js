import express from "express";
import { ensureAuth } from "../middleware/auth.js";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();
router.get("/", ensureAuth, getAnalytics);
export default router;