const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (to, name, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify Your Email - OTP',
    html: `
      <h3>Hello ${name},</h3>
      <p>Use this OTP to verify your email:</p>
      <h2>${otp}</h2>
      <p>Valid for 10 minutes.</p>
      <p>Best regards,<br/>The Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};

const sendWelcomeEmail = async (to, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Welcome to Alumni Connect!',
    html: `
      <h3>Hello ${name},</h3>
      <p>Welcome aboard!</p>
      <p>We're excited to have you join our alumni community. Please take a moment to complete your profile and stay connected with your fellow alumni.</p>
      <p>Best regards,<br/>The Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

const sendMonthlyProfileUpdateReminder = async (alumniList) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    bcc: alumniList.map(alumni => alumni.email).join(','),
    subject: 'Profile Update Reminder - Alumni Connect',
    html: `
      <h3>Dear Alumni,</h3>
      <p>This is a friendly reminder to keep your alumni profile up to date!</p>
      <p>Updating your profile helps us:</p>
      <ul>
        <li>Keep track of your professional journey</li>
        <li>Connect you with relevant opportunities</li>
        <li>Maintain an active and engaged alumni community</li>
      </ul>
      <p>Please take a moment to review and update your profile information, including:</p>
      <ul>
        <li>Current employment details</li>
        <li>Contact information</li>
        <li>Profile picture</li>
      </ul>
      <p>You can update your profile by logging into your account at Alumni Connect.</p>
      <p>Thank you for staying connected!</p>
      <p>Best regards,<br/>The Alumni Connect Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Monthly profile update reminder sent to ${alumniList.length} alumni`);
  } catch (error) {
    console.error('Error sending monthly profile update reminder:', error);
  }
};

module.exports = { 
  sendOtpEmail, 
  sendWelcomeEmail, 
  sendMonthlyProfileUpdateReminder 
};