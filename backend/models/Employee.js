const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  salary: Number
});

module.exports = mongoose.model("Employee", employeeSchema);
