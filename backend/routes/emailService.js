// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail App Password (or regular password if less secure apps are enabled)
  },
});

const sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Welcome to Our Alumni Connect Platform!',
    html: `
      <h3>Hello ${name},</h3>
      <p>Welcome to our platform! We're excited to have you on board.</p>
      <p>If you have any questions, feel free to reach out to us.</p>
      <p>Best regards,<br/>The Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendResetEmail = async (to, resetUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset Request',
    html: `
      <h3>Password Reset Request</h3>
      <p>You requested to reset your password. Click the link below to set a new password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendResetEmail };

module.exports = { sendWelcomeEmail };