// routes/notificationRoutes.js
import express from 'express';
import { sendFeeReminder, getNotifications, markNotificationAsRead } from '../controllers/authController.js';
import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send-fee-reminder', verifyUser, sendFeeReminder);
router.get('/get', verifyUser, getNotifications);
router.post('/mark-read', verifyUser, markNotificationAsRead);

export default router;