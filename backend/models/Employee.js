

import mongoose from "mongoose";
import validator from "validator";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String, required: true, unique: true, trim: true, lowercase: true,
    validate: { validator: v => validator.isEmail(v), message: "Invalid email" }
  },
  department: { type: String, required: true, trim: true }
}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);