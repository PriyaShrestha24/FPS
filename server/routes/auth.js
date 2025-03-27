import express from 'express'
import { login, verify, signup, getAllUsers, updateUser, deleteUser } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()
router.post('/login',login)
router.post('/signup',signup)   
router.get('/verify',authMiddleware, verify)
router.get('/users', getAllUsers)
router.put('/users/update', updateUser); // Update user
router.delete('/users/delete', deleteUser); // Delete user

export default router;