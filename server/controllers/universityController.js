// controllers/universityController.js
import University from '../models/University.js';

export const getUniversities = async (req, res) => {
  try {
    const universities = await University.find({});
    res.status(200).json({ success: true, universities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};