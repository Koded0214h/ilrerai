const sendVerificationEmail = (email, token) => {
  // Mock email sending - in production, use nodemailer with real SMTP
  console.log(`📧 Verification email sent to ${email}`);
  console.log(`🔗 Verification link: http://localhost:5000/api/auth/verify/${token}`);
  
  // In production, implement actual email sending:
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransporter({...});
  // await transporter.sendMail({...});
};

module.exports = { sendVerificationEmail };