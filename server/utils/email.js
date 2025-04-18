// utils/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let mailOptions;

export const sendVerificationEmail = async (email, token, subject = 'Email Verification') => {
  // Update the path to include /api/auth
  const verificationLink = `${process.env.BASE_URL}${process.env.AUTH_PREFIX}/verify-email?token=${token}`;
  mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: `
      <h3>Verify Your Email</h3>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Email Sending Error:', error);
    throw error;
  }
};

export const sendFeeReminderEmail = async (email, message, subject = 'Fee Payment Reminder') => {
  mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: `
      <h3>Fee Payment Reminder</h3>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Fee reminder email sent to ${email}`);
  } catch (error) {
    console.error('Email Sending Error:', error);
    throw error;
  }
};