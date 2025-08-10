// import express from "express";
// import mongoose from "mongoose";
// import session from "express-session";
// import cors from "cors";
// import { createClient } from 'redis';
// import { RedisStore } from 'connect-redis';

// const app = express();

// const redisClient = createClient();
// redisClient.on('error', (err) => console.log('Redis Client Error', err));
// await redisClient.connect();

// app.use(session({
//   store: new RedisStore({ client: redisClient }),
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false }
// }));
// // =======================
// // 1. Setup Express
// // =======================
// // =======================
// // 2. MongoDB Connection
// // =======================
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mern_app")
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // =======================
// // 3. Redis Client & Store
// // =======================
// // const RedisStore = connectRedis(session);


// // // Create Redis client (legacyMode needed for connect-redis v7)
// // const redisClient = createClient({
// //   legacyMode: true,
// //   url: process.env.REDIS_URL || "redis://localhost:6379",
// // });

// redisClient.connect().catch(console.error);

// redisClient.on("connect", () => console.log("✅ Redis connected"));
// redisClient.on("error", (err) => console.error("❌ Redis error:", err));

// // =======================
// // 4. Session Middleware
// // =======================
// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     secret: process.env.SESSION_SECRET || "mysecret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false, // true if HTTPS
//       httpOnly: true,
//       maxAge: 1000 * 60 * 10, // 10 minutes
//     },
//   })
// );

// // =======================
// // 5. Routes
// // =======================
// app.get("/", (req, res) => {
//   res.send("Server is running ✅");
// });

// app.get("/set-session", (req, res) => {
//   req.session.user = { name: "Vineet", role: "Admin" };
//   res.send("Session set ✅");
// });

// app.get("/get-session", (req, res) => {
//   res.send(req.session.user || "No session found ❌");
// });

// // =======================
// // 6. Start Server
// // =======================
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { connectRedis, redisClient } from "./config/redisClient.js"; // exported earlier
import sessionMiddleware from "./config/session.js";

import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { rateLimit } from "./middleware/rateLimit.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB + Redis
await connectDB(process.env.MONGODB_URI);
await connectRedis();

// Expose redis client via app.locals for controllers
app.locals.redis = redisClient;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(sessionMiddleware());

// Simple analytics counter for every request (non-blocking)
app.use(async (req, res, next) => {
  try { app.locals.redis && app.locals.redis.incr("analytics:requests:total"); } catch (e) { /* ignore */ }
  next();
});

// Optional rate limiter applied globally
app.use(rateLimit({ windowSec: 60, limit: 120 }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/analytics", analyticsRoutes);

// Serve static if frontend built into ../frontend/dist (optional)
import path from "path";
import fs from "fs";
const dist = path.join(process.cwd(), "../frontend/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));