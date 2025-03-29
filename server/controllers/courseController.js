// server/controllers/courseController.js
import Course from '../models/Course.js';

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
