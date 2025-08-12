const redisClient = require("../config/redis");

const analyticsTracker = async (req, res, next) => {
  try {
    await redisClient.incr("analytics:total_hits");

    const endpointKey = `analytics:endpoint:${req.method} ${req.originalUrl}`;
    await redisClient.incr(endpointKey);

    if (req.originalUrl.includes("/auth/login") && req.method === "POST") {
      await redisClient.incr("analytics:logins");
    }

    next();
  } catch (err) {
    console.error("Analytics error:", err);
    next();
  }
};

module.exports = analyticsTracker;
