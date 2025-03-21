import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: "User Not Found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, error: "Password is incorrect" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: "10d" }
        );

        res.status(200).json({
            success: true,
            token,
            user: { _id: user._id, name: user.name, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
const verify = async (req, res) => {    
    return res.status(200).json({ success: true, user: req.user })
}

const signup = async (req, res) => {
    try {
        const { name, email, password, role, studentId, program } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "User already exists" });
        }

        // Validate student-specific fields
        if (role === "student" && (!studentId || !program)) {
            return res.status(400).json({ success: false, error: "Student ID and program are required for students." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            studentId: role === "student" ? studentId : undefined,
            program: role === "student" ? program : undefined,
            year: role === "student" ? "1" : undefined
        });

        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign(
            { _id: newUser._id, role: newUser.role },
            process.env.JWT_KEY,
            { expiresIn: "10d" }
        );

        res.status(201).json({
            success: true,
            token,
            user: { _id: newUser._id, name: newUser.name, role: newUser.role }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Fetch all users
const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Don't return the password field
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  // Update user information
  const updateUser = async (req, res) => {
    try {
      const { userId, name, email, role, studentId, program, year } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, role, studentId, program, year },
        { new: true }
      );
      
      if (!updatedUser) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
  
      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
 export { getAllUsers, updateUser };
  

export { login, verify, signup };
