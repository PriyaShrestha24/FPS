import express from "express";
import cors from "cors";
 import authRouter from "./routes/auth.js";
 import connectToDatabase from './db/db.js'

connectToDatabase()
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);


app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port ${process.env.PORT}`)
})

//Use routes
//app.use("/api/auth", authRoutes);

// Connect to MongoDB
// const connectDB = async () => {
//     try {
//       await mongoose.connect(process.env.MONGO_URI);
//       console.log("✅ MongoDB Connected!");
//     } catch (error) {
//       console.error("❌ MongoDB Connection Failed!", error);
//       process.exit(1);
//     }
//   };
  
// connectDB();

// // Default Route
// app.get("/", (req, res) => {
//   res.send("Welcome to the Fee Payment System API! 🎉");
// });

// // ✅ New Route: Update User by ID
// app.put("/api/users/:id", async (req, res) => {
//     const { id } = req.params;
//     const { name, email, studentId, program } = req.body;
  
//     try {
//       const updatedUser = await User.findByIdAndUpdate(
//         id,
//         { name, email, studentId, program },
//         { new: true } // Return the updated document
//       );
//       if (!updatedUser) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       res.json({ message: "User updated successfully!", user: updatedUser });
//     } catch (error) {
//       res.status(500).json({ message: "Server Error", error: error.message });
//     }
//   });
// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on port ${PORT}`);
// });