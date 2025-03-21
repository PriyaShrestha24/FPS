import express from 'express'
import { login, verify, signup, getAllUsers } from '../controllers/authController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()
router.post('/login',login)
router.post('/signup',signup)   
router.get('/verify',authMiddleware, verify)
router.get('/users',authMiddleware, getAllUsers)
export default router;