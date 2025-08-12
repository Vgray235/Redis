const redisClient = require("../config/redis");

const storeSession = async (token, userId) => {
  await redisClient.set(`session:${token}`, userId, { EX: 3600 });
};

module.exports = { storeSession };
