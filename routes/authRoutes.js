const express = require("express");
const router = express.Router();

const { sendOtp } = require("../controllers/authController");

router.post("/otpsend", sendOtp);

module.exports = router;