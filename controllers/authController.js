const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateOtp, sendOtpEmail } = require("../config/mail");
const Otp = require("../models/otp");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ===========================================================
   SEND OTP
   ===========================================================
   Generates an OTP, stores it in the database with an expiry
   time of 5 minutes, and sends it to the user's email.
=========================================================== */

const sendOtp = async (req, res) => {
  try {
    // Get email from request body
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Generate random OTP
    const otp = generateOtp();

    // Remove any previous OTP for this email
    await Otp.deleteOne({ email });

    // OTP expiry time (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save OTP in database
    await Otp.create({
      email,
      otp,
      expiresAt,
    });

    // Send OTP to email
    await sendOtpEmail(email, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================================================
   REGISTER USER
   ===========================================================
   Steps:
   1. Validate inputs
   2. Check if email already exists
   3. Verify OTP
   4. Hash password
   5. Save user
   6. Delete used OTP
=========================================================== */

const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role, otp } = req.body;

    // Validate input
    if (!name || !email || !phoneNumber || !password || !role || !otp) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Find OTP for the email
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({
        message: "OTP not found. Please request a new OTP.",
      });
    }

    // Check OTP expiry
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email });

      return res.status(400).json({
        message: "OTP has expired.",
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    // Delete OTP after successful registration
    await Otp.deleteOne({ email });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================================================
   LOGIN USER
   ===========================================================
   Steps:
   1. Validate input
   2. Find user
   3. Compare password
   4. Generate JWT
   5. Return user details and token
=========================================================== */

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  sendOtp,
  register,
  login,
};
