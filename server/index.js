import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()

// connect to database
connectDB()

// middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://dsa-visualizer-roan-psi.vercel.app'
  ],
  credentials: true
}))
app.use(express.json())

// routes
app.use('/api/auth', authRoutes)

// test route
app.get('/', (req, res) => {
  res.json({ message: 'DSA Visualizer API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})