const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: String,
  designation: String,
  email:String,
  salary:Number 
});

module.exports = mongoose.model("Employee", employeeSchema);
