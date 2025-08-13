const jwt = require("jsonwebtoken");
const User = require("../models/User");
const redisClient = require("../config/redis");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
};

// @desc Register user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create user (pre-save hook hashes password)
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    // Store session in Redis keyed by token (1 hour)
    await redisClient.setEx(`session:${token}`, 3600, user._id.toString());

    res.status(201).json({
      message: "User registered successfully",
      token
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials1" });

    console.log(user);

    // Use model method to check password
    const isMatch = await user.matchPassword(password);
    console.log(isMatch);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials2" });

    const token = generateToken(user._id);

    // Store session in Redis keyed by token
    await redisClient.setEx(`session:${token}`, 3600, user._id.toString());

    res.json({ message: "Login successful", token });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc Logout user
exports.logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({ error: "Not authorized" });
    }

    await redisClient.del(`session:${token}`);

    res.json({ message: "Logged out successfully" });

  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
