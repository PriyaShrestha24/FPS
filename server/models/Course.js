// models/Course.js
import mongoose from 'mongoose';
//import University from './University';

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },         // e.g., BSc Computing
  code: { type: String, unique: true },           // e.g., BSC-COMP
  duration: { type: Number },                     // years
  yearlyFees: {                                   
    type: Map,                                     // key: year (1st Year, 2nd...), value: amount
    of: Number,
    default: {}
  },
  university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true }, // e.g., TU
  //test: [{yearly: String, amount: String}],             // e.g., ["CAT", "Final"]
});

export default mongoose.model('Course', courseSchema);
