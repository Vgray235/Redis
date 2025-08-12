import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    // tls: true, // Redis Cloud uses TLS
    rejectUnauthorized: false
  }
});

client.on("error", (err) => console.error("Redis Error:", err));

async function connectRedis() {
  await client.connect();
  console.log("✅ Connected to Redis Cloud");
}

export { client as redisClient, connectRedis };
