// models/University.js
import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Tribhuvan University"
  code: { type: String, required: false, unique: false }, // e.g., "TU"
  location: { type: String }, // e.g., "Kathmandu, Nepal"
  createdAt: { type: Date, default: Date.now },
});

// Remove any existing indexes
universitySchema.index({ code: 1 }, { unique: false });

export default mongoose.model('University', universitySchema);