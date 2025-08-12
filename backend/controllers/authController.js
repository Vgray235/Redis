
import User from "../models/User.js";

export async function register(req, res) {
  try {

    const { username, password } = req.body;
    console.log(username+"  "+password);
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