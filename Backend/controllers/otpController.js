const crypto = require("crypto");
const User = require("../models/User");
const { sendEmail } = require("../config/emailConfig");

// In-memory OTP storage (Note: Should be replaced with a database solution in production)
const otpStorage = new Map();

// Helper to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate and send OTP
exports.generateOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email is valid
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Generate a 6-digit OTP
    const otp = generateOTP();

    // Store OTP with expiry time (15 minutes)
    otpStorage.set(email, {
      otp,
      expiry: Date.now() + 15 * 60 * 1000,
    });

    // Send OTP via email
    const emailResult = await sendEmail({
      email,
      subject: "Your OTP for Balance Buddy",
      html: `
        <h1>Your One-Time Password</h1>
        <p>Your OTP for Balance Buddy is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 15 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      `,
    });

    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("OTP generation error:", error);
    res.status(500).json({ message: "Error generating OTP" });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const storedOTPData = otpStorage.get(email);

    // Check if OTP exists and is valid
    if (!storedOTPData) {
      return res.status(400).json({ message: "No OTP found for this email" });
    }

    // Check if OTP has expired
    if (Date.now() > storedOTPData.expiry) {
      otpStorage.delete(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Verify OTP
    if (storedOTPData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid, but don't delete it yet (will be deleted on completion of registration/action)
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      verified: true,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate a new OTP
    const otp = generateOTP();

    // Store OTP with expiry time (15 minutes)
    otpStorage.set(email, {
      otp,
      expiry: Date.now() + 15 * 60 * 1000,
    });

    // Send OTP via email
    const emailResult = await sendEmail({
      email,
      subject: "Your New OTP for Balance Buddy",
      html: `
        <h1>Your New One-Time Password</h1>
        <p>Your OTP for Balance Buddy is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 15 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      `,
    });

    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

    res.status(200).json({
      success: true,
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error("OTP resend error:", error);
    res.status(500).json({ message: "Error resending OTP" });
  }
};

// Validate OTP for internal use
exports.validateOTP = (email, otp) => {
  const storedOTPData = otpStorage.get(email);

  if (!storedOTPData) {
    return false;
  }

  if (Date.now() > storedOTPData.expiry) {
    otpStorage.delete(email);
    return false;
  }

  return storedOTPData.otp === otp;
};

// Clear OTP after successful use
exports.clearOTP = (email) => {
  otpStorage.delete(email);
};

// Get OTP storage map (for testing/debugging only)
exports.getOtpStorage = () => {
  return otpStorage;
};
