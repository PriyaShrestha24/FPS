import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "COMPLETE", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    year: {
      type: String,
      required: true, // Store the year the payment is for (e.g., "1st Year")
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);