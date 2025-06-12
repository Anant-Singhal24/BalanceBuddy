const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController");

// Generate and send OTP
router.post("/generate", otpController.generateOTP);
// Verify OTP
router.post("/verify", otpController.verifyOTP);
// Resend OTP
router.post("/resend", otpController.resendOTP);

module.exports = router;
