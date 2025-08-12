
const express = require("express");
const redisClient = require("../config/redis");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const totalHits = await redisClient.get("analytics:total_hits") || 0;
  const totalLogins = await redisClient.get("analytics:logins") || 0;

  const keys = await redisClient.keys("analytics:endpoint:*");
  const endpointStats = await Promise.all(
    keys.map(async (key) => ({
      endpoint: key.replace("analytics:endpoint:", ""),
      hits: Number(await redisClient.get(key))
    })));

    const ipKey = `rate:${req.ip}`;
    const limit = parseInt(process.env.RATE_LIMIT_MAX) || 10;
    const used = Number(await redisClient.get(ipKey)) || 0;
    const remaining = Math.max(limit - used, 0);
    const resetIn = await redisClient.ttl(ipKey);
    
  

  res.json({ totalHits: Number(totalHits), totalLogins: Number(totalLogins), endpoints: endpointStats, rateLimit: {
        limit,
        used,
        remaining,
        resetIn: resetIn > 0 ? resetIn : 0
      } });
});

module.exports = router;
