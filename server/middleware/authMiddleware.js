import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Auth Header:", req.headers.authorization);
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided or invalid format" });
        }
        
        const token = req.headers.authorization?.split(' ')[1]; // Ensure token exists
        console.log("Extracted Token:", token);
        if (!token) {
            return res.status(401).json({ success: false, error: "Token Not Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (!decoded) {
            return res.status(403).json({ success: false, error: "Token Not Valid" });
        }

        const user = await User.findById(decoded._id)
            .select('-password')
            .populate("program")// Populate the program field to get the Course document
            .populate("university");
        if (!user) {
            return res.status(404).json({ success: false, error: "User Not Found" });
        }

        req.user = decoded; // Store decoded token data in req.user
    req.userData = user; // Store the populated user in req.userData for the controller
    console.log('Decoded Token:', decoded);
    console.log('Populated User:', user);

        // req.user = user;
        // console.log("Populated User:", user); // Add this for debugging
        next();
    } catch (error) {
        console.error("Verify User Error:", error); // Log full error for debugging
        return res.status(500).json({ success: false, error: error.message || "Server Error" });
    }
};
// Middleware to check if user is an admin
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ success: false, error: 'Admin access required' });
    }
  };

export default verifyUser;