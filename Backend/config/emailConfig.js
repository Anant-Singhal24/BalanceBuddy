const nodemailer = require("nodemailer");

// Configure email transporter
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || "gmail";
const EMAIL_USER = process.env.EMAIL_USER || "your_email@gmail.com";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "your_email_password";
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "Balance Buddy";
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

// Test email connection on startup
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    // console.log("Email server connection established");
  } catch (error) {
    console.error("Email server connection failed:", error);
  }
};

// Helper function to send emails
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`,
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
