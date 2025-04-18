// controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import Course from '../models/Course.js';
import Notification from '../models/Notification.js';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/email.js';

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('program').populate('university');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Password is incorrect' });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role, emailVerified: user.emailVerified },
      process.env.JWT_KEY,
      { expiresIn: '10d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        year: user.year,
        program: user.program,
        university: user.university,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    // Use req.userData for the populated user object
    const user = req.userData;
    console.log('Verify User:', user);
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        year: user.year,
        program: user.program,
        university: user.university,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error('Verify Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, studentId, program, university, year } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    if (role === 'student' && (!studentId || !program || !university)) {
      return res.status(400).json({
        success: false,
        error: 'Student ID, program, and university are required for students.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 3600000;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      studentId: role === 'student' ? studentId : undefined,
      university: role === 'student' ? university : undefined,
      program: role === 'student' ? program : undefined,
      year: role === 'student' ? year : undefined,
      emailVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    await newUser.save();

    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      return res.status(500).json({ success: false, error: 'Failed to send verification email' });
    }

    const populatedUser = await User.findById(newUser._id)
      .select('-password')
      .populate('program')
      .populate('university');

    const token = jwt.sign(
      { _id: populatedUser._id, role: populatedUser.role, emailVerified: populatedUser.emailVerified },
      process.env.JWT_KEY,
      { expiresIn: '10d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        role: populatedUser.role,
        studentId: populatedUser.studentId,
        year: populatedUser.year,
        program: populatedUser.program,
        university: populatedUser.university,
        emailVerified: populatedUser.emailVerified,
      },
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect('http://localhost:5173/signup?verification-failed');
      //return res.status(400).json({ success: false, error: 'Invalid or expired verification token' });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.redirect('http://localhost:5173/login');
    //res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.redirect('http://localhost:5173/signup?verification-failed');
    //res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const resendVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.emailVerified) {
      return res.status(400).json({ success: false, error: 'Email already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 3600000;

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Error resending verification email:', emailError);
      return res.status(500).json({ success: false, error: 'Failed to resend verification email' });
    }

    res.status(200).json({ success: true, message: 'Verification email resent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const sendFeeReminder = async (req, res) => {
  try {
    const { message, recipients } = req.body;
    // Use req.user for the decoded token data
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, error: 'No recipients provided' });
    }

    const students = await User.find({ _id: { $in: recipients }, role: 'student' });
    if (students.length === 0) {
      return res.status(404).json({ success: false, error: 'No valid students found' });
    }

    const notifications = [];
    for (const student of students) {
      const notification = new Notification({
        userId: student._id,
        message,
      });
      await notification.save();
      notifications.push(notification);

      try {
        await sendVerificationEmail(student.email, null, 'Fee Payment Reminder', message);
      } catch (emailError) {
        console.error(`Error sending email to ${student.email}:`, emailError);
      }
    }

    res.status(200).json({ success: true, message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Send Fee Reminder Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    // Use req.user for the decoded token data
    const userId = req.user._id;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    // Use req.user for the decoded token data
    const userId = req.user._id;

    const notification = await Notification.findOne({ _id: notificationId, userId });
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark Notification Read Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    console.log('Fetching users, token:', req.headers.authorization);
    // Use req.user for the decoded token data
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const users = await User.find({})
      .select('-password')
      .populate('university')
      .populate('program');

    console.log('Users found:', users);
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Fetch Users Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId, name, email, role, studentId, program, year } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role, studentId, program, year },
      { new: true, runValidators: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};