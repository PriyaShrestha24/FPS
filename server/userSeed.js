import User from './models/User.js';
import bcrypt from 'bcrypt';
import connecttoDatabase from './db/db.js';

const userRegister = async () => {
    try {
        await connecttoDatabase(); // Ensure the database connection is established

        // Check if the admin user already exists
        const existingUser = await User.findOne({ email: "admin@gmail.com" });
        if (existingUser) {
            console.log("Admin user already exists. Skipping insertion.");
            return;
        }

        // Hash password and create a new user
        const hashPassword = await bcrypt.hash("admin", 10);
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin"
        });

        await newUser.save();
        console.log("Admin user created successfully!");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit(); // Ensure the script exits properly
    }
};

userRegister();
