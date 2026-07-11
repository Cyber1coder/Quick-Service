const express = require("express");
const router = express.Router();

const { sendOtp } = require("../controllers/authController");
const register = require("../controllers/registerController");

router.post("/otpsend", sendOtp);
router.post("/register",register);

module.exports = router;