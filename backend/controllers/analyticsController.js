export async function getAnalytics(req, res) {
  try {
    const redis = req.app.locals.redis;
    if (!redis) return res.status(200).json({ message: "Redis not configured" });

    const total = parseInt(await redis.get("analytics:requests:total") || "0", 10);
    const logins = parseInt(await redis.get("analytics:logins") || "0", 10);
    const empCreated = parseInt(await redis.get("analytics:employees:created") || "0", 10);

    res.json({ totalRequests: total, logins, employeesCreated: empCreated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analytics failed" });
  }
}