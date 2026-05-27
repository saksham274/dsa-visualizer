import express from 'express'
import {
  register,
  login,
  getProfile,
  updateProgress
} from '../controllers/authController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// public routes
router.post('/register', register)
router.post('/login', login)

// protected routes — need valid token
router.get('/profile', protect, getProfile)
router.put('/progress', protect, updateProgress)

export default router