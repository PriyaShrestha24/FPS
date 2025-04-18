import express from 'express'
import { login, verify, signup, getAllUsers, updateUser, deleteUser, verifyEmail, resendVerification } from '../controllers/authController.js'
import { EsewaInitiatePayment, paymentStatus, getUserTransactions, getFeeSummary } from '../controllers/esewaController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()
router.post('/login', (req, res) => {
    console.log("Login route hit");
    login(req, res);
  });
router.post('/signup',signup)   
router.get('/verify',authMiddleware, verify)
router.get('/users',authMiddleware, getAllUsers)
router.put('/users/update',authMiddleware, updateUser); // Update user
router.delete('/users/delete',authMiddleware, deleteUser); // Delete user
router.post('/initiate-esewa', authMiddleware, EsewaInitiatePayment);
router.post("/payment-status", authMiddleware, paymentStatus);
router.get('/transactions', authMiddleware, getUserTransactions);
router.get('/fee-summary',authMiddleware, getFeeSummary);
router.get('/verify-email', verifyEmail); // Add this route
router.post('/resend-verification', resendVerification);

export default router;