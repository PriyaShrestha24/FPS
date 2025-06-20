import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    studentId: { type: String, required: function() { return this.role === "student" } },
    university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: function() { return this.role === "student" } },
    //program: { type: String, required: function() { return this.role === "student" } },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    year: {type: String, required: true},
    emailVerified: { type: Boolean, default: false }, // Tracks if email is verified
  verificationToken: { type: String }, // Stores the verification token
  verificationTokenExpires: { type: Date },
    paymentHistory: [
      {
        transactionId: { type: String },
        amount: { type: Number },
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
      },
    ],
    dueDates: [
      {
        year: { type: String, required: true }, // e.g., "1st Year", "2nd Year"
        dueDate: { type: Date, required: true }, // Due date for that year
      },
    ],
    createAt: {type: Date, default: Date.now},
    updatesAt: {type: Date, default: Date.now}
  },
  
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
