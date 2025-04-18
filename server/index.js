// index.js
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import connectToDatabase from './db/db.js';
import courseRoutes from './routes/course.js';
import universityRoutes from './routes/university.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { scheduleFeeReminders } from './utils/cronJobs.js'; // Import cron job

connectToDatabase();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend origin
  credentials: true, // If you plan to use cookies/auth headers later
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use('/api/auth', authRouter);
console.log("Auth routes mounted at /api/auth");
app.use('/api/courses', courseRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/notifications', notificationRoutes);

// Start the cron jobs for automatic fee reminders
scheduleFeeReminders();

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is Running on port ${process.env.PORT || 5000}`);
});