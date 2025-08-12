const Employee = require("../models/Employee");
const redisClient = require("../config/redis");
const { publishNewEmployee } = require("../utils/pubsub");
// TTL for cache (in seconds)
const CACHE_TTL = 60;
const subscriber = redisClient.duplicate();
subscriber.connect();
// @desc Get all employees (with caching)
exports.getEmployees = async (req, res) => {
  try {
    // Check cache first
    const cacheData = await redisClient.get("employees:list");
    if (cacheData) {
      return res.json({
        source: "cache",
        employees: JSON.parse(cacheData)
      });
    }

    // Fetch from DB
    const employees = await Employee.find();
    await redisClient.setEx("employees:list", CACHE_TTL, JSON.stringify(employees));

    res.json({
      source: "db",
      employees
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

// @desc Get single employee (no caching for now)
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: "Invalid employee ID" });
  }
};

// @desc Create new employee (invalidate cache)
exports.createEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();



    // Invalidate cache
    await redisClient.del("employees:list");

    await publishNewEmployee({
      message: `Welcome ${newEmployee.name} for joining! 🎉`,
      name: newEmployee.name,
      createdAt: newEmployee.createdAt
    });


    res.status(201).json(newEmployee);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: "Email already exists" });
    } else if (err.name === "ValidationError") {
      res.status(400).json({
        error: Object.values(err.errors).map(e => e.message).join(", ")
      });
    } else {
      res.status(500).json({ error: "Failed to create employee" });
    }
  }
};

// @desc Update employee (invalidate cache)
exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) return res.status(404).json({ error: "Employee not found" });

    await redisClient.del("employees:list");

    res.json(updatedEmployee);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).json({
        error: Object.values(err.errors).map(e => e.message).join(", ")
      });
    } else {
      res.status(400).json({ error: "Invalid update or ID" });
    }
  }
};

// @desc Delete employee (invalidate cache)
exports.deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ error: "Employee not found" });

    await redisClient.del("employees:list");

    res.json(deletedEmployee);
  } catch (err) {
    res.status(400).json({ error: "Invalid employee ID" });
  }
};
