require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const analyticsTracker = require("./middleware/analyticsMiddleware");
const rateLimiter = require("./middleware/rateLimit");
const { protect } = require("./middleware/authMiddleware");
const cors = require('cors');
const app = express();
app.use(cors({
  origin: "https://keen-marshmallow-8449ba.netlify.app"|| '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


// DB + Middleware
connectDB();
app.use(express.json());

console.log("hi");
app.use(analyticsTracker);
app.use(rateLimiter);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", protect, require("./routes/employeeRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/pubsub", require("./routes/pubsubRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
