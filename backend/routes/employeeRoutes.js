// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/employeeControllers");
// const cache = require('../middleware/cache');
// router.get('/', cache('employees', 30), employeeController.getAllEmployees);

// router.get("/", controller.getAllEmployees);
// router.get("/:id", controller.getEmployeeById);
// router.post("/", controller.createEmployee);
// router.put("/:id", controller.updateEmployee);
// router.delete("/:id", controller.deleteEmployee);

// module.exports = router;

// backend/routes/employees.js
// backend/routes/employees.js
// import express from 'express';
// import { getAll, getOne, create, update, remove } from '../controllers/employeeController.js';
// import auth from '../middleware/auth.js';
// import cacheMiddleware from '../middleware/cache.js';

// const router = express.Router();
// const cache = cacheMiddleware('cache:employees:all', 60); // 60s TTL
// // Public read of all employees uses cache
// router.get('/', cache, getAll);
// router.get('/:id', getOne);

// // Protected create/update/delete
// router.post('/', auth, create);
// router.put('/:id', auth, update);
// router.delete('/:id', auth, remove);

// export default router;

import express from "express";
import { ensureAuth } from "../middleware/auth.js";
import { cacheEmployees } from "../middleware/cache.js";
import { getAll, getOne, createOne, updateOne, deleteOne } from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", ensureAuth, cacheEmployees, getAll);
router.get("/:id", ensureAuth, getOne);
router.post("/", ensureAuth, createOne);
router.put("/:id", ensureAuth, updateOne);
router.delete("/:id", ensureAuth, deleteOne);

export default router;