const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    // Check in Redis session store
    const session = await redisClient.get(`session:${token}`);
    if (!session) return res.status(401).json({ message: "Session expired" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {id:decoded.id};
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { protect };
