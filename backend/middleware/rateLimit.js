import { publisher } from "../workers/pubsub.js";

 export const rateLimit = async (req, res, next) => {
  const ip = req.ip;
  const key = `rate-limit:${ip}`;
  
  const current = await redisClient.incr(key);
  
  if (current === 1) {
    await redisClient.expire(key, 60); // 1 minute window
  }
  
  if (current > 5) {
    // Send Pub/Sub alert to admins
    await publisher.publish("rate-limit-alerts", JSON.stringify({
      ip,
      path: req.originalUrl,
      time: new Date().toISOString()
    }));

    return res.status(429).json({ error: "Too many requests, slow down!" });
  }
  
  next();
};


