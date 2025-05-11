const postmark = require("postmark");
const dotenv = require('dotenv').config();

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

const sendAdminCredentials = async ({ to, name, adminID, password }) => {
  try {
    await client.sendEmail({
      From: process.env.EMAIL_FROM, // Verified sender in Postmark
      To: to,
      Subject: "Your Admin Account Credentials",
      HtmlBody: `
        <h2>Welcome, ${name}!</h2>
        <p>Your admin account has been created successfully.</p>
        <p><strong>Admin ID:</strong> ${adminID}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>This is a one-time password Please log in to your dashboard and change your password for security.</p>
      `,
      TextBody: `Admin ID: ${adminID}\nPassword: ${password}`,
    });
  } catch (err) {
    console.error("Error sending email:", err.message);
    throw new Error("Failed to send credentials email.");
  }
};

const sendAdminResetLink = async ({ to, name, resetLink }) => {
  await client.sendEmail({
    From: process.env.EMAIL_FROM,
    To: to,
    Subject: "Reset Your Admin Password",
    HtmlBody: `
      <p>Hi ${name},</p>
      <p>You requested to reset your admin password. Click the button below to proceed:</p>
      <p><a href="${resetLink}" style="padding: 10px 15px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>If you did not request this, please ignore this email.</p>
      <p>This link will expire in 15 minutes.</p>
    `,
    TextBody: `Hi ${name},\n\nReset your admin password: ${resetLink}\n\nIf you didn’t request this, ignore the email.`,
    MessageStream: "outbound"
  });
};

module.exports = { sendAdminCredentials, sendAdminResetLink};
