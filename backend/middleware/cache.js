// backend/middleware/cache.js
// backend/middleware/cache.js
import { redisClient } from "../config/redisClient.js";

export async function cacheEmployees(req, res, next) {
  try {
    const cached = await redisClient.get("employees:all");
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }
    // attach a helper to save cache
    res.saveEmployeesCache = async (data) => {
      await redisClient.setEx("employees:all", 60, JSON.stringify(data)); // 60 sec TTL
    };
    next();
  } catch (err) {
    console.error("Cache error", err);
    next();
  }
}