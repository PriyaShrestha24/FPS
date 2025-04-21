import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyUser = async (req, res, next) => {
    try {
        console.log("=== Auth Middleware ===");
        console.log("Request path:", req.path);
        console.log("Request method:", req.method);
        console.log("Auth Header:", req.headers.authorization);
        
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            console.log("No token provided or invalid format");
            return res.status(401).json({ message: "No token provided or invalid format" });
        }
        
        const token = req.headers.authorization?.split(' ')[1]; // Ensure token exists
        console.log("Extracted Token:", token ? "Token exists" : "No token");
        
        if (!token) {
            console.log("Token Not Provided");
            return res.status(401).json({ success: false, error: "Token Not Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log("Decoded Token:", decoded);
        
        if (!decoded) {
            console.log("Token Not Valid");
            return res.status(403).json({ success: false, error: "Token Not Valid" });
        }

        const user = await User.findById(decoded._id)
            .select('-password')
            .populate("program")
            .populate("university");
            
        console.log("Found User:", user ? "User exists" : "User not found");
        
        if (!user) {
            console.log("User Not Found");
            return res.status(404).json({ success: false, error: "User Not Found" });
        }

        req.user = decoded; // Store decoded token data in req.user
        req.userData = user; // Store the populated user in req.userData for the controller
        console.log('User Role:', user.role);
        console.log('=== End Auth Middleware ===');
        
        next();
    } catch (error) {
        console.error("Verify User Error:", error); // Log full error for debugging
        return res.status(500).json({ success: false, error: error.message || "Server Error" });
    }
};

// Middleware to check if user is an admin
export const admin = (req, res, next) => {
    console.log("=== Admin Middleware ===");
    console.log("User in admin middleware:", req.user);
    console.log("User role:", req.user?.role);
    
    if (req.user && req.user.role === 'admin') {
        console.log("Admin access granted");
        console.log("=== End Admin Middleware ===");
        next();
    } else {
        console.log("Admin access denied");
        console.log("=== End Admin Middleware ===");
        res.status(403).json({ success: false, error: 'Admin access required' });
    }
};

export default verifyUser;