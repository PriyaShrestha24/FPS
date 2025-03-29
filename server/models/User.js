import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    studentId: { type: String, required: function() { return this.role === "student" } },
    //program: { type: String, required: function() { return this.role === "student" } },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    year: {type: String, required: true},
    createAt: {type: Date, default: Date.now},
    updatesAt: {type: Date, default: Date.now}
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
