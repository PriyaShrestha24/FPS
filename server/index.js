import express from "express";
import cors from "cors";
 import authRouter from "./routes/auth.js";
 import connectToDatabase from './db/db.js';
 import courseRoutes from './routes/course.js';

connectToDatabase()
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/courses', courseRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port ${process.env.PORT}`)
})
