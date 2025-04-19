import express from 'express';
import { addUniversity, getUniversities } from '../controllers/universityController.js';
import verifyUser from '../middleware/authMiddleware.js';
import { admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', verifyUser, admin, addUniversity);
router.get('/get', getUniversities);

export default router;