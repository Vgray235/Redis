const redisClient = require("../config/redis");

const rateLimiter = async (req, res, next) => {
  const ip = req.ip;
  const key = `rate:${ip}`;
  const limit = parseInt(process.env.RATE_LIMIT_MAX) || 10;
  const window = parseInt(process.env.RATE_LIMIT_WINDOW) || 60;

  const current = await redisClient.incr(key);

  if (current === 1) {
    await redisClient.expire(key, window);
  }

  if (current > limit) {
    const ttl = await redisClient.ttl(key);
    return res.status(429).json({
      message: `Rate limit exceeded. Try again in ${ttl} seconds.`,
      retryAfter: ttl
    });
  }

  res.set("X-RateLimit-Remaining", limit - current);
  next();
};

module.exports = rateLimiter;
