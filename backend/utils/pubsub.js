// // utils/pubsub.js
// const redisClient = require("../config/redis");
// const subClient = redisClient.duplicate();

// (async () => {
//   try {
//     if (!redisClient.isOpen) await redisClient.connect();
//     if (!subClient.isOpen) await subClient.connect();
//   } catch (err) {
//     console.error("Redis connection error:", err);
//   }
// })();

// const publishNewEmployee = async (employee) => {
//   await redisClient.publish(
//     "employee:new",
//     JSON.stringify({
//       type: "employee:new",
//       employee,
//     })
//   );
// };

// module.exports = { publishNewEmployee, subClient };
const redisClient = require("../config/redis");

// Create dedicated clients for pub/sub
const pubClient = redisClient.duplicate();
const subClient = redisClient.duplicate();

const initializeRedis = async () => {
  try {
    // Connect all clients
    const connections = [];
    
    if (!redisClient.isOpen) {
      connections.push(redisClient.connect());
    }
    
    if (!pubClient.isOpen) {
      connections.push(pubClient.connect());
    }
    
    if (!subClient.isOpen) {
      connections.push(subClient.connect());
    }
    
    await Promise.all(connections);
    
    console.log("All Redis clients connected successfully");
  } catch (err) {
    console.error("Redis connection error:", err);
    throw err;
  }
};

// Initialize connections
initializeRedis();

const publishNewEmployee = async (employee) => {
  try {
    // Ensure publisher is connected
    if (!pubClient.isOpen) {
      await pubClient.connect();
    }
    
    const message = JSON.stringify({
      type: "employee:new",
      employee,
      timestamp: new Date().toISOString()
    });
    
    console.log("Publishing message:", message);
    
    const result = await pubClient.publish("employee:new", message);
    console.log(`Message published to ${result} subscribers`);
    
    return result;
  } catch (err) {
    console.error("Error publishing message:", err);
    throw err;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing Redis connections...');
  await Promise.all([
    redisClient.quit(),
    pubClient.quit(),
    subClient.quit()
  ]);
  process.exit(0);
});

module.exports = { 
  publishNewEmployee, 
  subClient,
  pubClient,
  redisClient 
};