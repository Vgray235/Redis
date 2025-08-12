import { redisClient } from "../config/redisClient.js";

export function rateLimit({ windowSec = 60, limit = 10 } = {}) {
  return async (req, res, next) => {
    try {
      const key = `rate:${req.ip}`;
      const current = await redisClient.incr(key);
      if (current === 1) await redisClient.expire(key, windowSec);
      if (current > limit) return res.status(429).json({ error: "Too many requests" });
    } catch (err) {
      // Send friendly error message to frontend
      return res.status(500).json({
        error:
          "You have attempted too many requests. Please try again after some time.",
      });
    }
    next();
  };
}
