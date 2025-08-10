// // backend/routes/authRoutes.js
// import express from "express";
// import bcrypt from "bcrypt";
// import User from "../models/User.js";
// import redis from "../config/redisClient.js";
// import { v4 as uuidv4 } from "uuid";

// const router = express.Router();

// router.post("/register", async (req, res) => {
//   const { email, password } = req.body;
  
//   if (!email || !password)
//     return res.status(400).json({ error: "Email and password required" });

//   const existingUser = await User.findOne({ email });
//   if (existingUser)
//     return res.status(400).json({ error: "Email already registered" });

//   const hashed = await bcrypt.hash(password, 10);
//   const user = new User({ email, password: hashed });
//   await user.save();

//   res.status(201).json({ message: "User registered successfully" });
// });


// backend/routes/auth.js

import express from "express";
import { register, login, logout, sessionCheck } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/session", sessionCheck);

export default router;
