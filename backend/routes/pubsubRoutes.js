// const express = require("express");
// const { subClient } = require("../utils/pubsub");
// const router = express.Router();

// let clients = [];

// (async () => {
  
//   await subClient.subscribe("employee:new", (message) => {
//     clients.forEach(res => res.write(`data: ${message}\n\n`));
//   });
// })();

// router.get("/events", (req, res) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

//   res.flushHeaders();
//   res.write("retry: 10000\n\n");

//   clients.push(res);

//   req.on("close", () => {
//     clients = clients.filter(client => client !== res);
//   });
// });

// module.exports = router;
const express = require("express");
const { subClient } = require("../utils/pubsub");
const router = express.Router();

let clients = [];

// Properly initialize subscription after ensuring connection
const initializeSubscription = async () => {
  try {
    // Ensure subClient is connected
    if (!subClient.isOpen) {
      await subClient.connect();
    }
    
    // Subscribe to the channel
    await subClient.subscribe("employee:new", (message) => {
      console.log("Received message:", message);
      clients.forEach(res => {
        try {
          res.write(`data: ${message}\n\n`);
        } catch (err) {
          console.error("Error writing to client:", err);
          // Remove failed client
          clients = clients.filter(client => client !== res);
        }
      });
    });
    
    console.log("Successfully subscribed to employee:new channel");
  } catch (err) {
    console.error("Failed to initialize subscription:", err);
  }
};

// Initialize subscription
initializeSubscription();

router.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*"); // Add CORS if needed
  
  res.flushHeaders();
  res.write("retry: 10000\n\n");
  
  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: "connected", message: "SSE connected" })}\n\n`);
  
  clients.push(res);
  console.log(`Client connected. Total clients: ${clients.length}`);
  
  req.on("close", () => {
    clients = clients.filter(client => client !== res);
    console.log(`Client disconnected. Total clients: ${clients.length}`);
  });
  
  req.on("error", () => {
    clients = clients.filter(client => client !== res);
  });
});

module.exports = router;