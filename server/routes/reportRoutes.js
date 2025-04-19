import express from 'express';
import { getFeeCollectionReport, getUserActivityReport } from '../controllers/reportController.js';
import verifyUser from '../middleware/authMiddleware.js';
import { admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/fee-collection', verifyUser, admin, getFeeCollectionReport);
router.get('/user-activity', verifyUser, admin, getUserActivityReport);

export default router;