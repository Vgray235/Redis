// // backend/controllers/authController.js
// // backend/controllers/authController.js
// import bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';
// import User from '../models/User.js';
// import { client as redis } from '../config/redisClient.js'; // Adjust based on your redisClient.js

// const SESSION_TTL = parseInt(process.env.SESSION_TTL_SECONDS || '3600', 10);

// export const register = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ error: 'Email & password required' });

//   try {
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ error: 'Email already registered' });

//     const passwordHash = await bcrypt.hash(password, 10);
//     const user = await User.create({ email, passwordHash });

//     res.status(201).json({ message: 'Registered' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Register failed' });
//   }
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ error: 'Email & password required' });

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: 'Email not registered' });

//     const ok = await bcrypt.compare(password, user.passwordHash);
//     if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

//     const sessionId = uuidv4();
//     await redis.setex(`session:${sessionId}`, SESSION_TTL, user._id.toString());

//     res.json({ message: 'Logged in', sessionId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Login failed' });
//   }
// };

// export const logout = async (req, res) => {
//   try {
//     const token = req.headers['authorization'];
//     if (token) await redis.del(`session:${token}`);
//     res.json({ message: 'Logged out' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Logout failed' });
//   }
// };
import User from "../models/User.js";

export async function register(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Missing fields" });
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: "User exists" });

    const user = new User({ username, password });
    await user.save();
    // create session
    req.session.user = { id: user._id, username: user.username };
    // analytics
    req.app.locals.redis && req.app.locals.redis.incr("analytics:logins");
    res.status(201).json({ user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Missing fields" });
    const user = await User.findOne({ username });
    if (!user || !(await user.checkPassword(password))) return res.status(401).json({ error: "Invalid credentials" });

    req.session.user = { id: user._id, username: user.username };
    // analytics: count logins
    req.app.locals.redis && req.app.locals.redis.incr("analytics:logins");
    res.json({ user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
}

export async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ ok: true });
  });
}

export async function sessionCheck(req, res) {
  if (req.session && req.session.user) return res.json({ user: req.session.user });
  return res.status(401).json({ error: "No session" });
}