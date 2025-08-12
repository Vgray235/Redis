

import express from "express";
import { ensureAuth } from "../middleware/auth.js";
import { cacheEmployees } from "../middleware/cache.js";
import { getAll, getOne, createOne, updateOne, deleteOne } from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", ensureAuth, cacheEmployees, getAll);
router.get("/:id", ensureAuth, getOne);
router.post("/", ensureAuth, createOne);
router.put("/:id", ensureAuth, updateOne);
router.delete("/:id", ensureAuth, deleteOne);

export default router;