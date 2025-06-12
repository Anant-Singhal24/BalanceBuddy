const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Fallbacks for environment variables
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
const EMAIL_USERNAME = process.env.EMAIL_USERNAME || "your_email@gmail.com";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "your_email_password";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// In-memory OTP storage (in production, should use a database)
const otpStorage = new Map();

// Register User with OTP Verification
exports.registerUser = async (req, res) => {
  const { fullName, email, password, sendOtpOnly } = req.body;

  // Validation: Check for missing fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with expiration time (2 minutes)
    const otpData = {
      otp,
      expires: Date.now() + 2 * 60 * 1000, // 2 minutes expiration
      userData: { fullName, email, password },
    };

    otpStorage.set(email, otpData);

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: EMAIL_USERNAME,
      to: email,
      subject: "Verify Your Email - BalanceBuddy",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #10B981; margin-bottom: 20px;">BalanceBuddy</h1>
            <h2 style="color: #374151;">Email Verification</h2>
          </div>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #4B5563; margin-bottom: 20px;">Thank you for registering with BalanceBuddy. Please use the verification code below to complete your registration:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #E5E7EB; padding: 15px; border-radius: 5px; display: inline-block; letter-spacing: 8px; font-size: 24px; font-weight: bold;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #4B5563; margin-bottom: 10px;">This code will expire in 2 minutes.</p>
            
            <p style="color: #4B5563; font-size: 0.9em;">If you didn't request this, please ignore this email.</p>
          </div>
          
          <div style="text-align: center; color: #6B7280; font-size: 0.8em;">
            <p>BalanceBuddy - Your Financial Management Solution</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // If this is just an OTP request without registration
    if (sendOtpOnly) {
      return res.status(200).json({
        success: true,
        message: "OTP sent to your email",
      });
    }

    // Otherwise, this is for legacy path - we shouldn't reach here normally
    const user = await User.create({
      fullName,
      email,
      password,
    });

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpData = otpStorage.get(email);

    if (!otpData) {
      return res
        .status(404)
        .json({ message: "OTP not found. Please request a new one." });
    }

    if (Date.now() > otpData.expires) {
      otpStorage.delete(email);
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    if (otpData.otp !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    // OTP is valid
    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error verifying OTP" });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists in database
    const existingUser = await User.findOne({ email });

    // Check if there's an OTP record
    const otpData = otpStorage.get(email);

    if (existingUser && !otpData) {
      return res
        .status(400)
        .json({ message: "User already registered. Please login." });
    }

    if (!otpData || !otpData.userData) {
      return res
        .status(400)
        .json({ message: "No registration in progress. Please start over." });
    }

    // Generate new OTP
    const newOTP = generateOTP();

    // Update OTP data
    otpStorage.set(email, {
      ...otpData,
      otp: newOTP,
      expires: Date.now() + 2 * 60 * 1000, // 2 minutes expiration
    });

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: EMAIL_USERNAME,
      to: email,
      subject: "New Verification Code - BalanceBuddy",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #10B981; margin-bottom: 20px;">BalanceBuddy</h1>
            <h2 style="color: #374151;">New Verification Code</h2>
          </div>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #4B5563; margin-bottom: 20px;">You requested a new verification code. Please use the code below to complete your registration:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #E5E7EB; padding: 15px; border-radius: 5px; display: inline-block; letter-spacing: 8px; font-size: 24px; font-weight: bold;">
                ${newOTP}
              </div>
            </div>
            
            <p style="color: #4B5563; margin-bottom: 10px;">This code will expire in 2 minutes.</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: "New OTP sent to your email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error resending OTP" });
  }
};

// Complete Registration after OTP verification
exports.completeRegistration = async (req, res) => {
  const { userData } = req.body;
  const { fullName, email, password } = userData;

  try {
    // Check if OTP verification happened
    const otpData = otpStorage.get(email);

    if (!otpData) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
    });

    // Clean up OTP storage
    otpStorage.delete(email);

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error completing registration" });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: err.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log("Forgot password request for email:", email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // console.log("Generated reset token:", resetToken);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    // console.log("Token saved to user:", user.email);

    // Create reset URL
    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;
    // console.log("Reset URL created:", resetUrl);

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: EMAIL_USERNAME,
      to: user.email,
      subject: "Password Reset Request - BalanceBuddy",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #10B981;">BalanceBuddy</h1>
          </div>
          
          <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            <p>You requested a password reset. Click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #10B981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">Reset Password</a>
            </div>
            
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            
            <div style="margin-top: 30px; font-size: 12px; color: #666;">
              <p>If the button doesn't work, copy and paste this URL into your browser:</p>
              <p style="word-break: break-all;">${resetUrl}</p>
            </div>
          </div>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent, ID:", info.messageId);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Error sending reset email" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    // console.log("Reset password request received");
    // console.log("Token received:", token);
    // console.log("Token length:", token ? token.length : 0);

    if (!token || !newPassword) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    // Get all users with reset tokens for debugging
    const usersWithTokens = await User.find({
      resetPasswordToken: { $exists: true, $ne: null },
    }).select("email resetPasswordToken resetPasswordExpires");


    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // console.log("User found with token:", user ? `Yes - ${user.email}` : "No");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    // console.log("Password reset successful for user:", user.email);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

// Verify Reset Token
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    // console.log("Verifying token:", token);
    // console.log("Token length:", token ? token.length : 0);

    if (!token) {
      return res
        .status(400)
        .json({ valid: false, message: "Token is required" });
    }

    // Log all users with tokens for debugging
    const usersWithTokens = await User.find({
      resetPasswordToken: { $exists: true, $ne: null },
    }).select("email resetPasswordToken resetPasswordExpires");

    console.log(
      "Active tokens in database:",
      usersWithTokens.map((u) => ({
        email: u.email,
        tokenMatch: u.resetPasswordToken === token,
        tokenLength: u.resetPasswordToken?.length,
        expires: u.resetPasswordExpires,
        expired: u.resetPasswordExpires < Date.now(),
      }))
    );

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // console.log(
    //   "User found for token verification:",
    //   user ? `Yes - ${user.email}` : "No"
    // );

    if (!user) {
      return res
        .status(400)
        .json({ valid: false, message: "Invalid or expired reset token" });
    }

    return res.status(200).json({ valid: true, message: "Token is valid" });
  } catch (error) {
    console.error("Error verifying reset token:", error);
    return res
      .status(500)
      .json({ valid: false, message: "Error verifying token" });
  }
};
