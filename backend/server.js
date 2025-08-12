

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { connectRedis, redisClient } from "./config/redisClient.js"; // exported earlier
import sessionMiddleware from "./config/session.js";

import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import {rateLimit} from "./middleware/rateLimit.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB + Redis
await connectDB(process.env.MONGODB_URI);
await connectRedis();

// Expose redis client via app.locals for controllers
app.locals.redis = redisClient;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(sessionMiddleware());

// Simple analytics counter for every request (non-blocking)
app.use(async (req, res, next) => {
  try { app.locals.redis && app.locals.redis.incr("analytics:requests:total"); } catch (e) { /* ignore */ }
  next();
});

// Optional rate limiter applied globally

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/analytics", analyticsRoutes);

// console.log("authRoutes:", authRoutes);
// console.log("employeeRoutes:", employeeRoutes);
// console.log("analyticsRoutes:", analyticsRoutes);


// Serve static if frontend built into ../frontend/dist (optional)
import path from "path";
import fs from "fs";
const dist = path.join(process.cwd(), "../frontend/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));