// server/routes/course.js
import express from 'express';
import { getCourses } from '../controllers/courseController.js';

const router = express.Router();

router.get('/', getCourses); // This means: GET /api/courses/

export default router;
