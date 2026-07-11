const User = require("../models/User");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role, otp } = req.body;

    if (!name || !email || !phoneNumber || !password || !role || !otp) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      try {
        const user = await User.create({
          name,
          email,
          phoneNumber,
          password: hash,
          role,
          otp,
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

module.exports = register;
