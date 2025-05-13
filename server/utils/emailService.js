const postmark = require("postmark");
const dotenv = require('dotenv').config();

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

const sendAdminCredentials = async ({ to, name, adminID, password }) => {
  try {
    await client.sendEmail({
      From: 'Alumni Connect <' + process.env.EMAIL_FROM + '>',
      To: to,
      Subject: "Welcome to Alumni Connect – Your Admin Access",
      HtmlBody: `
    <p>Hello ${name},</p>
        <p>Welcome to <strong>Alumni Connect</strong>! Your administrator account has been successfully created.</p>

        <p>Below are your login credentials:</p>
        <ul>
          <li><strong>Admin ID:</strong> ${adminID}</li>
          <li><strong>Temporary Password:</strong> ${password}</li>
        </ul>

        <p>This is a one-time password. For your security, please log in to the admin portal and change your password immediately after your first login.</p>

        <p>If you have any questions or need help getting started, our support team is here to help.</p>

        <p>We’re excited to have you on board!</p>
        <p>Best regards,<br/>The Alumni Connect Team</p>
      `,
      TextBody: `
Hello ${name},

Welcome to Alumni Connect! Your administrator account has been created.

Admin ID: ${adminID}
Temporary Password: ${password}

This is a one-time password. Please log in to the admin portal and change your password immediately after first login.

Admin Portal: ${process.env.ADMIN_ROUTE_EMAIL_SENT}

Need help? Reach out to our support team.

Best regards,
The Alumni Connect Team
      `
    });
  } catch (err) {
    console.error("Error sending email:", err.message);
    throw new Error("Failed to send credentials email.");
  }
};

const sendAdminResetLink = async ({ to, name, resetLink }) => {
  await client.sendEmail({
    From:'Alumni Connect <' + process.env.EMAIL_FROM + '>',
    To: to,
    Subject: "Reset Your Admin Password",
    HtmlBody: `
  <p>Hello ${name},</p>
      <p>We received a request to reset the password for your admin account on the <strong>Alumni Connect</strong> platform.</p>
      <p>If you initiated this request, click the button below to set a new password:</p>
      <p>
        <a href="${resetLink}" style="padding: 10px 15px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
          Reset Your Password
        </a>
      </p>
      <p>If you did not request a password reset, you can safely ignore this message. No changes will be made to your account.</p>
      <p><strong>Note:</strong> This link will expire in 15 minutes for security purposes.</p>
      <p>Need help? Contact our support team anytime.</p>
      <p>Best regards,<br/>The Alumni Connect Team</p>
    `,
    TextBody: `
Hello ${name},

We received a request to reset your Alumni Connect admin password.

If you made this request, use the link below to set a new password:
${resetLink}

This link will expire in 15 minutes.

If you didn’t request this, you can safely ignore this email.

Thank you,
The Alumni Connect Team
    `,
    MessageStream: "outbound"
  });
};

module.exports = { sendAdminCredentials, sendAdminResetLink};
