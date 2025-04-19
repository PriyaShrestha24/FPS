import Transaction from '../models/Transaction.js';

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user', 'name email');
    res.json({ success: true, transactions });
  } catch (error) {
    console.error('GetAllTransactions Error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const markTransactionPaid = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    transaction.status = 'COMPLETE';
    await transaction.save();
    res.json({ success: true, transaction });
  } catch (error) {
    console.error('MarkTransactionPaid Error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};