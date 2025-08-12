// utils/pubsub.js
const redisClient = require("../config/redis");
const subClient = redisClient.duplicate();

(async () => {
  try {
    if (!redisClient.isOpen) await redisClient.connect();
    if (!subClient.isOpen) await subClient.connect();
  } catch (err) {
    console.error("Redis connection error:", err);
  }
})();

const publishNewEmployee = async (employee) => {
  await redisClient.publish(
    "employee:new",
    JSON.stringify({
      type: "employee:new",
      employee,
    })
  );
};

module.exports = { publishNewEmployee, subClient };
