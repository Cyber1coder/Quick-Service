const { generateOtp, sendOtpEmail } = require("../config/mail");

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateOtp();

    await sendOtpEmail(email, otp);

    res.status(200).json({
      message: "OTP sent successfully",
      otp, // Remove this later after testing
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

module.exports = {
  sendOtp,
};