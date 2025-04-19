// server/controllers/courseController.js
import Course from '../models/Course.js';
import University from '../models/University.js';

export const getCourses = async (req, res) => {
  try {
    const { universityId } = req.query;
    const query = universityId ? { university: universityId } : {};
    const courses = await Course.find(query).populate('university');
    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error('GetCourses Error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const addCourse = async (req, res) => {
  try {
    const { name, code, duration, university, yearlyFees } = req.body;
    if (!name || !code || !duration || !university || !yearlyFees) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const universityExists = await University.findById(university);
    if (!universityExists) {
      return res.status(400).json({ success: false, error: 'University not found' });
    }

    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res.status(400).json({ success: false, error: 'Course code already exists' });
    }

    const course = new Course({
      name,
      code,
      duration: parseInt(duration),
      university,
      yearlyFees,
    });

    await course.save();
    res.status(201).json({ success: true, course });
  } catch (error) {
    console.error('AddCourse Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'Course code already exists' });
    }
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};