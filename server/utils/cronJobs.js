import cron from 'node-cron';
import User from '../models/User.js';
import { triggerCron } from '../controllers/notificationController.js';
import Course from '../models/Course.js';
import Notification from '../models/Notification.js';
import { sendVerificationEmail } from './email.js';

export const scheduleFeeReminders = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('Running fee reminder cron job...');
    await triggerCron({ user: { role: 'admin' } }, { json: () => {} });
    try {
      const now = new Date();
      const thresholdDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

      // Find students with due dates within the next 3 days
      const students = await User.find({
        role: 'student',
        dueDates: {
          $elemMatch: {
            dueDate: { $gte: now, $lte: thresholdDate },
          },
        },
      }).populate('program');

      if (students.length === 0) {
        console.log('No students with upcoming fee due dates.');
        return;
      }

      for (const student of students) {
        // Filter due dates within the 3-day window
        const upcomingDueDates = student.dueDates.filter(
          (due) => new Date(due.dueDate) >= now && new Date(due.dueDate) <= thresholdDate
        );

        for (const due of upcomingDueDates) {
          // Get fee amount from Course.yearlyFees
          const yearlyFees = student.program.yearlyFees instanceof Map
            ? Object.fromEntries(student.program.yearlyFees.entries())
            : student.program.yearlyFees;
          const feeAmount = yearlyFees[due.year] || 0;

          const message = `Reminder: Your ${due.year} fee of NPR ${feeAmount} is due on ${new Date(due.dueDate).toLocaleDateString()}. Please pay on time to avoid late fees.`;

          // Create notification
          const notification = new Notification({
            userId: student._id,
            message,
          });
          await notification.save();

          // Send email
          try {
            await sendVerificationEmail(student.email, null, 'Fee Payment Reminder', message);
          } catch (emailError) {
            console.error(`Error sending email to ${student.email}:`, emailError);
          }
        }
      }

      console.log(`Sent fee reminders to ${students.length} students.`);
    } catch (error) {
      console.error('Cron Job Error:', error);
    }
  });
};