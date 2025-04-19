import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

export const getFeeCollectionReport = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const report = {
      totalTransactions: transactions.length,
      totalCollected: transactions
        .filter((t) => t.status === 'COMPLETE')
        .reduce((sum, t) => sum + t.amount, 0),
      totalPending: transactions
        .filter((t) => t.status === 'PENDING')
        .reduce((sum, t) => sum + t.amount, 0),
      totalFailed: transactions
        .filter((t) => t.status === 'FAILED')
        .reduce((sum, t) => sum + t.amount, 0),
    };
    res.json({ success: true, report });
  } catch (error) {
    console.error('GetFeeCollectionReport Error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getUserActivityReport = async (req, res) => {
  try {
    const users = await User.find();
    const report = {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.lastLogin).length,
      students: users.filter((u) => u.role === 'student').length,
      admins: users.filter((u) => u.role === 'admin').length,
    };
    res.json({ success: true, report });
  } catch (error) {
    console.error('GetUserActivityReport Error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};