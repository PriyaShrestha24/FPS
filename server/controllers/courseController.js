// controllers/courseController.js
import Course from '../models/Course.js';

export const getCourses = async (req, res) => {
  try {
    const { universityId } = req.query; // Get universityId from query params
    const query = universityId ? { university: universityId } : {};
    const courses = await Course.find(query).populate('university');
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};