const User = require("../models/User");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    // Check whether user is present
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // If user is not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Compare password
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (!result) {
        return res.status(401).json({
          message: "Invalid password",
        });
      }

      return res.status(200).json({
        message: "Login Success",
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = login;
