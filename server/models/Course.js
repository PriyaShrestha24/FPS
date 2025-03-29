// models/Course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },         // e.g., BSc Computing
  code: { type: String, unique: true },           // e.g., BSC-COMP
  duration: { type: Number },                     // years
  yearlyFees: {                                   
    type: Map,                                     // key: year (1st Year, 2nd...), value: amount
    of: Number,
    default: {}
  }
});

export default mongoose.model('Course', courseSchema);
