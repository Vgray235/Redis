

import Employee from "../models/Employee.js";

export async function getAll(req, res) {
  try {
    // cache middleware will return cached if exists; otherwise continue
    const employees = await Employee.find().sort({ createdAt: -1 });
    if (res.saveEmployeesCache) await res.saveEmployeesCache(employees);
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
}

export async function getOne(req, res) {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ error: "Not found" });
    res.json(emp);
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
}

export async function createOne(req, res) {
  try {
    const { name, email, department } = req.body;
    if (!name || !email || !department) return res.status(400).json({ error: "Missing fields" });
    const existing = await Employee.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email exists" });

    const e = await Employee.create({ name, email, department });
    // invalidate cache
    req.app.locals.redis && req.app.locals.redis.del("employees:all");
    // analytics
    req.app.locals.redis && req.app.locals.redis.incr("analytics:employees:created");
    res.status(201).json(e);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Create failed" });
  }
}

export async function updateOne(req, res) {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    req.app.locals.redis && req.app.locals.redis.del("employees:all");
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
}

export async function deleteOne(req, res) {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    req.app.locals.redis && req.app.locals.redis.del("employees:all");
    res.json({ ok: true, deleted });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
}