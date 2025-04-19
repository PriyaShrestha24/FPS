import express from 'express';
import {
  sendFeeReminder,
  getNotifications,
  markNotificationAsRead,
  triggerCron,
} from '../controllers/notificationController.js';
import verifyUser from '../middleware/authMiddleware.js';
import { admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin routes
router.post('/send-fee-reminder', verifyUser, admin, sendFeeReminder);
router.get('/history', verifyUser, admin, getNotifications); // Alias for admin history
router.post('/trigger-cron', verifyUser, admin, triggerCron);

// User routes
router.get('/get', verifyUser, getNotifications);
router.post('/mark-read', verifyUser, markNotificationAsRead);

export default router;