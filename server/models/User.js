import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
   // studentId: { type: String, required: true },
    // program: { type: String, required: true },
     password: { type: String, required: true },
     role: { type: String, enum: ["student", "admin"], default: "student" },
     createAt: {type: Date, default: Date.now},
     updatesAt: {type: Date, default: Date.now}
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
