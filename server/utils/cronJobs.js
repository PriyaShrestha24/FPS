// utils/cronJobs.js
import cron from 'node-cron';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendVerificationEmail } from './email.js';

export const scheduleFeeReminders = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('Running fee reminder cron job...');
    try {
      const now = new Date();
      const thresholdDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

      const students = await User.find({
        role: 'student',
        feeDueDate: { $gte: now, $lte: thresholdDate },
      });

      if (students.length === 0) {
        console.log('No students with upcoming fee due dates.');
        return;
      }

      for (const student of students) {
        const message = `Reminder: Your fee payment is due on ${new Date(student.feeDueDate).toLocaleDateString()}. Please pay on time to avoid late fees.`;
        
        const notification = new Notification({
          userId: student._id,
          message,
        });
        await notification.save();

        try {
          await sendVerificationEmail(student.email, null, 'Fee Payment Reminder', message);
        } catch (emailError) {
          console.error(`Error sending email to ${student.email}:`, emailError);
        }
      }

      console.log(`Sent fee reminders to ${students.length} students.`);
    } catch (error) {
      console.error('Cron Job Error:', error);
    }
  });
};