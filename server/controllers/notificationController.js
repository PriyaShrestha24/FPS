import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { sendVerificationEmail } from '../utils/email.js';

export const sendFeeReminder = async (req, res) => {
  try {
    const { message, recipients } = req.body;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, error: 'No recipients provided' });
    }

    const students = await User.find({ _id: { $in: recipients }, role: 'student' });
    if (students.length === 0) {
      return res.status(404).json({ success: false, error: 'No valid students found' });
    }

    const notification = new Notification({
      message,
      recipients: students.map((s) => s._id),
    });
    await notification.save();

    for (const student of students) {
      try {
        await sendVerificationEmail(student.email, null, 'Fee Payment Reminder', message);
      } catch (emailError) {
        console.error(`Error sending email to ${student.email}:`, emailError);
      }
    }

    res.status(200).json({ success: true, message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Send Fee Reminder Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      // Admin sees all notifications
      const notifications = await Notification.find()
        .populate('recipients', 'name email')
        .sort({ createdAt: -1 })
        .limit(50);
      res.status(200).json({ success: true, notifications });
    } else {
      // Users see only their notifications
      const notifications = await Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(10);
      res.status(200).json({ success: true, notifications });
    }
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const userId = req.user._id;

    const notification = await Notification.findOne({ _id: notificationId, userId });
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark Notification Read Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

export const triggerCron = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const users = await User.find({ role: 'student' });
    const today = new Date();
    const notifications = [];

    for (const user of users) {
      const transactions = await Transaction.find({
        user_id: user._id,
        status: 'PENDING',
      });

      for (const transaction of transactions) {
        const dueDate = user.dueDates.find((d) => d.year === transaction.year)?.dueDate;
        if (!dueDate) continue;

        const daysUntilDue = Math.ceil((new Date(dueDate) - today) / (1000 * 60 * 60 * 24));
        if (daysUntilDue <= 7 && daysUntilDue >= 0) {
          const message = `Reminder: Your fee payment of NPR ${transaction.amount} for ${transaction.year} is due on ${new Date(dueDate).toLocaleDateString()}.`;
          const notification = new Notification({
            userId: user._id,
            message,
            recipients: [user._id],
          });
          await notification.save();
          notifications.push(notification);

          try {
            await sendVerificationEmail(user.email, null, 'Fee Payment Reminder', message);
          } catch (emailError) {
            console.error(`Error sending email to ${user.email}:`, emailError);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Cron job executed successfully',
      notifications: notifications.length,
    });
  } catch (error) {
    console.error('TriggerCron Error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};