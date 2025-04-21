import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { sendVerificationEmail, sendFeeReminderEmail } from '../utils/email.js';

export const sendFeeReminder = async (req, res) => {
  try {
    console.log('Send Fee Reminder Request:', {
      body: req.body,
      user: req.user,
      headers: req.headers
    });
    
    const { message, recipients } = req.body;
    if (req.user.role !== 'admin') {
      console.log('Unauthorized access attempt by non-admin user');
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      console.log('No recipients provided in request');
      return res.status(400).json({ success: false, error: 'No recipients provided' });
    }

    console.log(`Finding ${recipients.length} students with IDs:`, recipients);
    const students = await User.find({ _id: { $in: recipients }, role: 'student' });
    console.log(`Found ${students.length} valid students`);
    
    if (students.length === 0) {
      return res.status(404).json({ success: false, error: 'No valid students found' });
    }

    const notification = new Notification({
      message,
      recipients: students.map((s) => s._id),
    });
    await notification.save();
    console.log('Notification saved to database:', notification._id);

    let successCount = 0;
    let failureCount = 0;
    
    for (const student of students) {
      try {
        console.log(`Sending email to student: ${student.email}`);
        await sendFeeReminderEmail(student.email, message, 'Fee Payment Reminder');
        console.log(`Email sent successfully to ${student.email}`);
        successCount++;
      } catch (emailError) {
        console.error(`Error sending email to ${student.email}:`, emailError);
        failureCount++;
      }
    }

    console.log(`Email sending complete. Success: ${successCount}, Failures: ${failureCount}`);
    res.status(200).json({ 
      success: true, 
      message: 'Notifications sent successfully',
      stats: {
        total: students.length,
        success: successCount,
        failed: failureCount
      }
    });
  } catch (error) {
    console.error('Send Fee Reminder Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
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
      // Users see notifications where they are either the userId or in the recipients array
      const notifications = await Notification.find({
        $or: [
          { userId: req.user._id },
          { recipients: req.user._id }
        ]
      })
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

    const notification = await Notification.findOne({
      _id: notificationId,
      $or: [
        { userId: userId },
        { recipients: userId }
      ]
    });
    
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