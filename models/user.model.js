const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qcuStud: { type: Boolean, required: true },
  studentNo: { type: String, default: null }, // No unique or sparse constraint
  course: { type: String },
  contactNo: { type: String },
  email: { type: String, unique: true, required: true },
  address: { type: String, required: true },
  fbLink: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String, required: false },
});

module.exports = mongoose.model("User", userSchema);
