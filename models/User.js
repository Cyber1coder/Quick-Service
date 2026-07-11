const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    required: true,
    enum: ["customer", "worker", "admin"],
  },
  otp:{
    type:Number
  },
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
