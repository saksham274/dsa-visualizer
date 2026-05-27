import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// generate JWT token
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// ── REGISTER ──
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // check all fields present
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // check if username taken
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' })
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      message: 'Account created successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        progress: user.progress
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ── LOGIN ──
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    res.json({
      message: 'Logged in successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        progress: user.progress
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ── GET PROFILE ──
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ── UPDATE PROGRESS ──
export const updateProgress = async (req, res) => {
  try {
    const { topic } = req.body

    const validTopics = ['arrays', 'sorting', 'searching', 'stackQueue', 'trees', 'graphs']
    if (!validTopics.includes(topic)) {
      return res.status(400).json({ message: 'Invalid topic' })
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { [`progress.${topic}`]: true },
      { new: true }
    ).select('-password')

    res.json({
      message: `${topic} marked as completed`,
      progress: user.progress
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}