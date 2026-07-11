const express = require("express");
const router = express.Router();

const { sendOtp } = require("../controllers/authController");
const register = require("../controllers/registerController");
const login = require("../controllers/loginController");

router.post("/otpsend", sendOtp);
router.post("/register",register);
router.post("/login",login)
module.exports = router;