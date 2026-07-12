require("dotenv").config();

const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.HOST,
    pass: process.env.MPASS,
  },
});

const generateOtp = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

const sendOtpEmail = async (email, otp) => {
  const mailOption = {
    from: process.env.HOST,
    to: email,
    subject: "Your OTP for Quick-Service",
    text: `Your OTP is ${otp}`,
  };

  await transport.sendMail(mailOption);

  
};

module.exports = {
  generateOtp,
  sendOtpEmail,
};