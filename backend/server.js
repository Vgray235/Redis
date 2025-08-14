// require("dotenv").config();
// const express = require("express");
// const connectDB = require("./config/db");
// const analyticsTracker = require("./middleware/analyticsMiddleware");
// const rateLimiter = require("./middleware/rateLimit");
// const { protect } = require("./middleware/authMiddleware");
// const cors = require('cors');
// const app = express();
// app.use(cors({
//   origin: ""|| '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

// // https://keen-marshmallow-8449ba.netlify.app

// // DB + Middleware
// connectDB();
// app.use(express.json());

// console.log("hi");
// app.use(analyticsTracker);
// app.use(rateLimiter);

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/employees", protect, require("./routes/employeeRoutes"));
// app.use("/api/analytics", require("./routes/analyticsRoutes"));
// app.use("/api/pubsub", require("./routes/pubsubRoutes"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const analyticsTracker = require("./middleware/analyticsMiddleware");
const rateLimiter = require("./middleware/rateLimit");
const { protect } = require("./middleware/authMiddleware");
const cors = require('cors');
const app = express();

const allowedOrigins = [
  'http://localhost:3000', // local React dev server
  'https://heroic-meringue-257924.netlify.app' // production frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or curl
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed from this origin: ' + origin));
  },
  credentials: true
}));

// app.use(cors({
//   origin: "http://localhost:5000/api"|| '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true
// }));

// https://keen-marshmallow-8449ba.netlify.app

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
