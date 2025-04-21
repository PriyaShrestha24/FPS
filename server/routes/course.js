// server/routes/course.js
import express from 'express';
import { getCourses, addCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import verifyUser from '../middleware/authMiddleware.js';
import { admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/get', getCourses); // This means: GET /api/courses/
router.post('/add', verifyUser, admin, addCourse);
router.put('/update', verifyUser, admin, updateCourse);
router.delete('/:courseId', verifyUser, admin, deleteCourse);

export default router;
