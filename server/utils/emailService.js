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
        <p>Please log in to your dashboard and change your password for security.</p>
      `,
      TextBody: `Admin ID: ${adminID}\nPassword: ${password}`,
    });
  } catch (err) {
    console.error("Error sending email:", err.message);
    throw new Error("Failed to send credentials email.");
  }
};

module.exports = { sendAdminCredentials };
