const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserInfo,
  forgotPassword,
  resetPassword,
  verifyOTP,
  resendOTP,
  completeRegistration,
  verifyResetToken,
} = require("../controllers/authController");

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/complete-registration", completeRegistration);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.get("/getUser", protect, getUserInfo);

module.exports = router;
