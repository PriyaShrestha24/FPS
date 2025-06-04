// controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import Course from '../models/Course.js';
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
        dueDates: user.dueDates,
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
        dueDates: user.dueDates,
      },
    });
  } catch (error) {
    console.error('Verify Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, studentId, program, university } = req.body;

    // Validate required fields
    if (!name || !email || !password || !university || !program) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

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

  
    const course = await Course.findById(program);
    if (!course) {
      return res.status(400).json({ success: false, error: 'Invalid course' });
    }

    // Generate default due dates based on course duration
    const dueDates = [];
    const currentYear = new Date().getFullYear();
    for (let i = 1; i <= course.duration; i++) {
      const yearLabel = `${i}${i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'} Year`;
      // Set due date to June 1st of the current or future year
      dueDates.push({
        year: yearLabel,
        dueDate: new Date(currentYear + i - 1, 5, 1), // June 1st
      });
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      studentId: role === 'student' ? studentId : undefined,
      university: role === 'student' ? university : undefined,
      program: role === 'student' ? program : undefined,
      year: role === 'student' ? '1st Year' : undefined, // Default to 1st Year for students
      emailVerified: false,
      verificationToken,
      verificationTokenExpires,
      dueDates,
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
        dueDates: populatedUser.dueDates,
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

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: 'Current password is incorrect' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (error) {
    console.error('ChangePassword Error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
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
    const { userId, name, email, role, studentId, university, program, year, dueDates } = req.body;
    
    // Find the user first to check if they exist
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Update the user with all fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        name, 
        email, 
        role, 
        studentId, 
        university, 
        program, 
        year, 
        dueDates 
      },
      { 
        new: true, 
        runValidators: true 
      }
    )
    .select('-password')
    .populate('program')
    .populate('university');

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'Failed to update user' });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update User Error:', error);
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
