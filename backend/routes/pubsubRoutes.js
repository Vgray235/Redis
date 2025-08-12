const express = require("express");
const { subClient } = require("../utils/pubsub");
const router = express.Router();

let clients = [];

(async () => {
  
  await subClient.subscribe("employee:new", (message) => {
    clients.forEach(res => res.write(`data: ${message}\n\n`));
  });
})();

router.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();
  res.write("retry: 10000\n\n");

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter(client => client !== res);
  });
});

module.exports = router;
