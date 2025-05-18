const nodemailer = require("nodemailer");

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test email connection on startup
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Email server connection established");
  } catch (error) {
    console.error("Email server connection failed:", error);
  }
};

// Helper function to send emails
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "Balance Buddy"} <${
        process.env.EMAIL_FROM || process.env.EMAIL_USER
      }>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  transporter,
  verifyEmailConnection,
  sendEmail,
};
