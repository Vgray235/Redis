// models/employeeModel.js
// import mongoose from "mongoose";
// import validator from "validator";

// const employeeSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//     },
//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       validate: [validator.isEmail, "Invalid email format"],
//     },
//     department: {
//       type: String,
//       required: [true, "Department is required"],
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Employee", employeeSchema);

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