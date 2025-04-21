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

export const sendFeeReminderEmail = async (email, message, subject) => {
  try {
    console.log('Initializing fee reminder email:', {
      to: email,
      subject: subject,
      emailUser: process.env.EMAIL_USER,
      messageLength: message?.length
    });

    if (!email || !message) {
      throw new Error('Email and message are required');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject || 'Fee Payment Reminder',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Fee Reminder</h2>
          <p style="color: #666; line-height: 1.6;">${message}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">This is an automated message from the Fee Payment System.</p>
        </div>
      `
    };

    console.log('Email configuration:', {
      service: 'Gmail',
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASS,
      recipientEmail: email
    });

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    
    return true;
  } catch (error) {
    console.error('Fee reminder email error:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      recipientEmail: email,
      stack: error.stack
    });

    // Check for specific Gmail SMTP errors
    if (error.code === 'EAUTH') {
      console.error('Gmail authentication failed. Please check your email credentials.');
    } else if (error.code === 'ESOCKET') {
      console.error('Network error when connecting to Gmail SMTP server.');
    } else if (error.responseCode === 550) {
      console.error('Gmail rejected the email. This might be due to security settings or rate limiting.');
    }

    throw error;
  }
};