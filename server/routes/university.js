import express from 'express';
import { addUniversity, getUniversities, updateUniversity, deleteUniversity } from '../controllers/universityController.js';
import verifyUser from '../middleware/authMiddleware.js';
import { admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', verifyUser, admin, addUniversity);
router.get('/get', getUniversities);
router.put('/update', verifyUser, admin, updateUniversity);
router.delete('/:universityId', verifyUser, admin, deleteUniversity);

export default router;