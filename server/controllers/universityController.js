// server/controllers/universityController.js
import University from '../models/University.js';

export const addUniversity = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'University name is required' });
    }
    const existingUniversity = await University.findOne({ name });
    if (existingUniversity) {
      return res.status(400).json({ success: false, error: 'University already exists' });
    }
    const university = new University({ name });
    await university.save();
    res.status(201).json({ success: true, university });
  } catch (error) {
    console.error('AddUniversity Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code, // Useful for MongoDB errors like duplicate key
    });
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'University name already exists' });
    }
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const getUniversities = async (req, res) => {
  try {
    const universities = await University.find();
    res.status(200).json({ success: true, universities });
  } catch (error) {
    console.error('GetUniversities Error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};