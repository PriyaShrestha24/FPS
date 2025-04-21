// server/controllers/universityController.js
import University from '../models/University.js';

export const addUniversity = async (req, res) => {
  try {
    console.log('Add University Request Body:', req.body);
    console.log('Add University Request User:', req.user);
    console.log('Add University Request Headers:', req.headers);
    
    const { name, code } = req.body;
    if (!name) {
      console.log('University name is missing in request');
      return res.status(400).json({ success: false, error: 'University name is required' });
    }
    
    // Normalize the name by trimming whitespace
    const normalizedName = name.trim();
    
    console.log('Checking if university already exists:', normalizedName);
    const existingUniversity = await University.findOne({ 
      $or: [
        { name: normalizedName },
        { name: { $regex: new RegExp(`^${normalizedName}$`, 'i') } } // Case-insensitive match
      ]
    });
    
    if (existingUniversity) {
      console.log('University already exists:', existingUniversity);
      return res.status(400).json({ success: false, error: `University "${existingUniversity.name}" already exists` });
    }
    
    // Generate a code if not provided
    let universityCode = code;
    if (!universityCode) {
      // Create a simple code from the first letters of each word
      universityCode = normalizedName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('');
      
      // Check if this code already exists
      const existingCode = await University.findOne({ code: universityCode });
      if (existingCode) {
        // If code exists, append a random number
        universityCode = `${universityCode}${Math.floor(Math.random() * 1000)}`;
      }
    }
    
    console.log('Creating new university:', normalizedName, 'with code:', universityCode);
    const university = new University({ 
      name: normalizedName,
      code: universityCode
    });
    await university.save();
    console.log('University saved successfully:', university);
    
    res.status(201).json({ success: true, university });
  } catch (error) {
    console.error('AddUniversity Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code, // Useful for MongoDB errors like duplicate key
    });
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: `University "${req.body.name}" already exists` });
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

export const updateUniversity = async (req, res) => {
  try {
    const { universityId, name, code, location } = req.body;
    
    if (!universityId || !name) {
      return res.status(400).json({ success: false, error: 'University ID and name are required' });
    }

    // Normalize the name by trimming whitespace
    const normalizedName = name.trim();

    // Check if another university already exists with the same name (excluding current university)
    const existingUniversity = await University.findOne({
      _id: { $ne: universityId },
      $or: [
        { name: normalizedName },
        { name: { $regex: new RegExp(`^${normalizedName}$`, 'i') } }
      ]
    });

    if (existingUniversity) {
      return res.status(400).json({ 
        success: false, 
        error: `Another university with name "${existingUniversity.name}" already exists` 
      });
    }

    const updateData = {
      name: normalizedName,
      ...(code && { code }),
      ...(location && { location })
    };

    const university = await University.findByIdAndUpdate(
      universityId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!university) {
      return res.status(404).json({ success: false, error: 'University not found' });
    }

    res.status(200).json({ success: true, university });
  } catch (error) {
    console.error('UpdateUniversity Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'University with this name already exists' });
    }
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};