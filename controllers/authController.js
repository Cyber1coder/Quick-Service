const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateOtp, sendOtpEmail } = require("../config/mail");
const Otp = require("../models/otp");
var jwt = require("jsonwebtoken");
require("dotenv").config();

//otp
const sendOtp = async (req, res) => {
  //input of email and otp generation
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const otp = generateOtp();
    await Otp.deleteOne({ email }); //delete the email

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); //create exprires At - 5 minutes

    await Otp.create({
      email,
      otp,
      expiresAt,
    });

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//register
const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role } = req.body;

    if (!name || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check existing email
    // Check existing phone number
    // Verify OTP

    bcrypt.hash(password, 10, async function (err, hash) {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      try {
        const user = await User.create({
          name,
          email,
          phoneNumber,
          password: hash,
          role,
        });

        return res.status(201).json({
          message: "User registered successfully",
          user,
        });
      } catch (error) {
        return res.status(500).json({
          message: error.message,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (!result) {
        return res.status(401).json({
          message: "Invalid Password",
        });
      }

      //generate jwt
      var token = jwt.sign({ user }, process.env.JWT_SECRET_KEY);


      return res.status(200).json({
        message: "Login Successful",
      });
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
