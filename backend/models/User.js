// backend/models/User.js
// backend/models/User.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';

// const userSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true, lowercase: true },
//     passwordHash: { type: String, required: true },
//     verified: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// userSchema.methods.verifyPassword = function (password) {
//   return bcrypt.compare(password, this.passwordHash);
// };

// const User = mongoose.model('User', userSchema);

// export default User;
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);