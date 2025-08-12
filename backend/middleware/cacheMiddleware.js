const redisClient = require("../config/redis");

const cacheEmployees = async (req, res, next) => {
  try {
    const cacheData = await redisClient.get("employees:list");
    if (cacheData) {
      return res.json({
        source: "redis",
        data: JSON.parse(cacheData)
      });
    }
    next();
  } catch (err) {
    console.error("Cache error:", err);
    next();
  }
};

module.exports = cacheEmployees;
