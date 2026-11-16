const emailjs = require("@emailjs/nodejs");

// EmailJS Environment Variables
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || "";
const EMAILJS_OTP_TEMPLATE_ID = process.env.EMAILJS_OTP_TEMPLATE_ID || EMAILJS_TEMPLATE_ID;
const EMAILJS_RESET_TEMPLATE_ID = process.env.EMAILJS_RESET_TEMPLATE_ID || EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || process.env.EMAILJS_USER_ID || "";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || process.env.EMAILJS_ACCESS_TOKEN || "";

/**
 * Validate that required EmailJS configuration is present
 */
const validateConfig = (templateId) => {
  const missing = [];
  if (!EMAILJS_SERVICE_ID) missing.push("EMAILJS_SERVICE_ID");
  if (!templateId) missing.push("EMAILJS_TEMPLATE_ID (or specific template ID)");
  if (!EMAILJS_PUBLIC_KEY) missing.push("EMAILJS_PUBLIC_KEY");
  if (!EMAILJS_PRIVATE_KEY) missing.push("EMAILJS_PRIVATE_KEY");

  if (missing.length > 0) {
    console.warn(
      `⚠️ [EmailJS Warning] Missing environment variables: ${missing.join(", ")}. Please configure them in your Backend/.env file.`
    );
    return false;
  }
  return true;
};

/**
 * Send an email using EmailJS
 *
 * @param {Object} options
 * @param {string} options.email - Recipient email address
 * @param {string} [options.name] - Recipient name
 * @param {string} [options.subject] - Subject line
 * @param {string} [options.message] - Main text message
 * @param {string} [options.otp] - One-time password (for verification/login)
 * @param {string} [options.resetUrl] - Password reset URL
 * @param {string} [options.html] - HTML content
 * @param {string|number} [options.expiry] - Expiry details (e.g., '2 minutes', '1 hour')
 * @param {string} [options.templateId] - Specific EmailJS template ID (optional)
 * @param {Object} [options.templateParams] - Additional custom template parameters
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendEmail = async (options) => {
  const recipientEmail = options.email || options.to_email || options.to;
  const targetTemplateId = options.templateId || EMAILJS_TEMPLATE_ID;

  if (!recipientEmail) {
    return { success: false, error: "Recipient email is required" };
  }

  if (!validateConfig(targetTemplateId)) {
    return {
      success: false,
      error: "EmailJS is not fully configured. Check your Backend/.env file.",
    };
  }

  // Comprehensive template parameters matching standard EmailJS template variable conventions
  const templateParams = {
    to_email: recipientEmail,
    email: recipientEmail,
    to_name: options.name || "User",
    name: options.name || "User",
    subject: options.subject || "BalanceBuddy Notification",
    message: options.message || "",
    otp: options.otp || "",
    passcode: options.otp || "",
    reset_url: options.resetUrl || "",
    link: options.resetUrl || "",
    expiry: options.expiry || "",
    html_content: options.html || "",
    html: options.html || "",
    ...options.templateParams,
  };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      targetTemplateId,
      templateParams,
      {
        publicKey: EMAILJS_PUBLIC_KEY,
        privateKey: EMAILJS_PRIVATE_KEY,
      }
    );

    console.log(`[EmailJS] Email sent successfully to ${recipientEmail} (Status: ${response.status})`);
    return {
      success: true,
      status: response.status,
      messageId: `emailjs-${Date.now()}`,
    };
  } catch (error) {
    console.error(`[EmailJS Error] Failed to send email to ${recipientEmail}:`, error);
    return {
      success: false,
      error: error.message || (typeof error === "string" ? error : JSON.stringify(error)),
    };
  }
};

/**
 * Helper to send registration / login OTP email via EmailJS
 */
const sendOTPEmail = async ({ email, otp, name = "User", expiryMinutes = 2 }) => {
  return sendEmail({
    email,
    name,
    otp,
    subject: "Verify Your Email - BalanceBuddy",
    message: `Thank you for registering with BalanceBuddy. Your verification code is: ${otp}. This code will expire in ${expiryMinutes} minutes.`,
    expiry: `${expiryMinutes} minutes`,
    templateId: EMAILJS_OTP_TEMPLATE_ID,
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10B981; margin-bottom: 20px;">BalanceBuddy</h1>
          <h2 style="color: #374151;">Email Verification</h2>
        </div>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #4B5563; margin-bottom: 20px;">Please use the verification code below to complete your registration:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #E5E7EB; padding: 15px; border-radius: 5px; display: inline-block; letter-spacing: 8px; font-size: 24px; font-weight: bold;">
              ${otp}
            </div>
          </div>
          <p style="color: #4B5563; margin-bottom: 10px;">This code will expire in ${expiryMinutes} minutes.</p>
          <p style="color: #4B5563; font-size: 0.9em;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="text-align: center; color: #6B7280; font-size: 0.8em;">
          <p>BalanceBuddy - Your Financial Management Solution</p>
        </div>
      </div>
    `,
  });
};

/**
 * Helper to send Password Reset email via EmailJS
 */
const sendPasswordResetEmail = async ({ email, resetUrl, name = "User", expiryHours = 1 }) => {
  return sendEmail({
    email,
    name,
    resetUrl,
    subject: "Password Reset Request - BalanceBuddy",
    message: `You requested a password reset for BalanceBuddy. Visit this link to reset your password: ${resetUrl}. This link will expire in ${expiryHours} hour(s).`,
    expiry: `${expiryHours} hour(s)`,
    templateId: EMAILJS_RESET_TEMPLATE_ID,
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
          <p>This link will expire in ${expiryHours} hour(s).</p>
          <p>If you didn't request this, please ignore this email.</p>
          <div style="margin-top: 30px; font-size: 12px; color: #666;">
            <p>If the button doesn't work, copy and paste this URL into your browser:</p>
            <p style="word-break: break-all;">${resetUrl}</p>
          </div>
        </div>
      </div>
    `,
  });
};

/**
 * Check EmailJS configuration status
 */
const verifyEmailConnection = async () => {
  const isConfigured = validateConfig(EMAILJS_TEMPLATE_ID);
  if (isConfigured) {
    console.log("[EmailJS] Configuration verified and ready.");
  }
  return isConfigured;
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendPasswordResetEmail,
  verifyEmailConnection,
};
