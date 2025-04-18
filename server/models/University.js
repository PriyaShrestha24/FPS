// models/University.js
import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Tribhuvan University"
  code: { type: String, required: true, unique: true }, // e.g., "TU"
  location: { type: String }, // e.g., "Kathmandu, Nepal"
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('University', universitySchema);