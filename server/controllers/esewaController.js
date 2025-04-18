import { EsewaPaymentGateway, EsewaCheckStatus } from "esewajs";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

const EsewaInitiatePayment = async (req, res) => {
  const { amount, productId, year } = req.body;

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "User not authenticated. Please log in." });
  }

  try {
    if (!amount || !productId || !year) {
      return res.status(400).json({ message: "Amount, product ID, and year are required" });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(productId)) {
      return res.status(400).json({ message: "Product ID must contain only alphanumeric characters, hyphens, and underscores" });
    }
    // Use req.userData instead of req.user
    const user = req.userData;

    // Check if program exists
    if (!user.program) {
      return res.status(400).json({ message: "User does not have a program assigned. Please update your profile." });
    }

    // Fetch the user's program fees
    const yearlyFees = user.program.yearlyFees instanceof Map
      ? Object.fromEntries(user.program.yearlyFees.entries())
      : user.program.yearlyFees;

    const requiredFee = yearlyFees[year];
    if (!requiredFee) {
      return res.status(400).json({ message: `No fee defined for ${year}` });
    }

    // Calculate the total amount already paid for this year
    const completedTransactions = await Transaction.find({
      user_id: user._id,
      year: year,
      status: "COMPLETE",
    });

    const totalPaid = completedTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    // Check if the user has already paid the full amount
    if (totalPaid >= requiredFee) {
      return res.status(400).json({ message: `You have already paid the full fee of NPR ${requiredFee} for ${year}.` });
    }

    // Check if the new payment would exceed the required fee
    const remainingAmount = requiredFee - totalPaid;
    if (parsedAmount > remainingAmount) {
      return res.status(400).json({
        message: `You can only pay up to NPR ${remainingAmount} more for ${year}. Please adjust the payment amount.`,
      });
    }

    const reqPayment = await EsewaPaymentGateway(
      parsedAmount,
      0, // productDeliveryCharge
      0, // productServiceCharge
      0, // taxAmount
      productId,
      process.env.MERCHANT_ID,
      process.env.SECRET,
      process.env.SUCCESS_URL,
      process.env.FAILURE_URL,
      process.env.ESEWAPAYMENT_URL,
      undefined,
      undefined
    );

    if (!reqPayment) {
      return res.status(400).json({ message: "Error initiating payment" });
    }

    if (reqPayment.status === 200) {
      const transaction = new Transaction({
        product_id: productId,
        amount: parsedAmount,
        user_id: user._id,
        year: year,
      });
      await transaction.save();
      console.log("Transaction saved:", transaction);

      return res.status(200).json({
        url: reqPayment.request.res.responseUrl,
      });
    } else {
      return res.status(400).json({ message: "Failed to initiate payment" });
    }
  } catch (error) {
    console.error("EsewaInitiatePayment Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const paymentStatus = async (req, res) => {
  const { product_id } = req.body;

  if (!req.userData || !req.userData._id) {
    return res.status(401).json({ message: "User not authenticated. Please log in." });
  }

  try {
    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    console.log("Product ID:", product_id);
    console.log("User ID:", req.userData._id);

    // Check if req.user._id is already an ObjectId; if not, convert it
    let userId = req.userData._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    // If userId is not already an ObjectId instance, convert it
    if (!(userId instanceof mongoose.Types.ObjectId)) {
      userId = new mongoose.Types.ObjectId(userId);
    }

    console.log("Converted User ID:", userId);

    const transaction = await Transaction.findOne({
      product_id,
      user_id: userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    console.log("Found Transaction:", transaction);

    const paymentStatusCheck = await EsewaCheckStatus(
      transaction.amount,
      transaction.product_id,
      process.env.MERCHANT_ID,
      process.env.ESEWAPAYMENT_STATUS_CHECK_URL
    );

    console.log("EsewaCheckStatus Response:", paymentStatusCheck);

    if (paymentStatusCheck.status === 200) {
      const esewaStatus = paymentStatusCheck.data.status;
      console.log("eSewa Status:", esewaStatus);
      transaction.status = esewaStatus === "COMPLETE" ? "COMPLETE" : esewaStatus; // Adjust based on eSewa response
      await transaction.save();
      return res.status(200).json({
        message: "Transaction status updated successfully",
        status: transaction.status,
      });
    } else {
      console.log("EsewaCheckStatus Failed with Status:", paymentStatusCheck.status);
      return res.status(400).json({ 
        message: "Failed to verify payment status", 
        esewaResponse: paymentStatusCheck 
      });
    }
  } catch (error) {
    console.error("PaymentStatus Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getFeeSummary = async (req, res) => {
  try {
    if (!req.userData || !req.userData._id) {
      return res.status(401).json({ message: "User not authenticated. Please log in." });
    }

    const user = req.userData;
    const yearlyFees = user.program.yearlyFees instanceof Map
      ? Object.fromEntries(user.program.yearlyFees.entries())
      : user.program.yearlyFees;

      if (!user.program || !yearlyFees) {
        return res.status(400).json({ message: "User does not have a program assigned or fees are not defined." });
      }

    const transactions = await Transaction.find({ user_id: user._id });
    const summary = [];

    // Calculate paid and remaining amounts for each year
    for (let year = 1; year <= user.program.duration; year++) {
      const yearLabel = `${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year`;
      const totalFee = yearlyFees[yearLabel] || 0;
      const completedTransactions = transactions.filter(
        (tx) => tx.year === yearLabel && tx.status === "COMPLETE"
      );
      const paidAmount = completedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      const remainingAmount = totalFee - paidAmount;

      // Assume fees are due annually, starting from the user's enrollment date
      const dueDate = new Date(user.createdAt);
      dueDate.setFullYear(dueDate.getFullYear() + (year - 1));

      summary.push({
        year: yearLabel,
        totalFee,
        paidAmount,
        remainingAmount,
        dueDate,
      });
    }

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("GetFeeSummary Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// New endpoint to fetch user transactions
const getUserTransactions = async (req, res) => {
  try {
    if (!req.userData || !req.userData._id) {
      return res.status(401).json({ message: "User not authenticated. Please log in." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ user_id: req.userData._id })
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .skip(skip)
      .limit(limit)
      .select('product_id amount status createdAt year'); // Select only the fields we need
      const total = await Transaction.countDocuments({ user_id: req.userData._id });

    res.status(200).json({ success: true, transactions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
     });
  } catch (error) {
    console.error("GetUserTransactions Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }


};

export { EsewaInitiatePayment, paymentStatus, getUserTransactions, getFeeSummary };