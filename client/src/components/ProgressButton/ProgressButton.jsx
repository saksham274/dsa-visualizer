import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { updateProgress } from '../../utils/api'
import './ProgressButton.css'

function ProgressButton({ topic }) {
  const { user, token, updateUserProgress } = useAuth()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  // check if already completed
  const isCompleted = user?.progress?.[topic] || done

  if (!user) {
    return (
      <div className="progress-btn-wrapper">
        <p className="progress-login-hint">
          <span onClick={() => navigate('/login')}>Login</span> to track your progress
        </p>
      </div>
    )
  }

  async function handleClick() {
    if (isCompleted || loading) return
    setLoading(true)
    const data = await updateProgress(topic, token)
    if (data && data.progress) {
      updateUserProgress(topic)
      setDone(true)
    }
    setLoading(false)
  }

  return (
    <div className="progress-btn-wrapper">
      <button
        className={`progress-btn ${isCompleted ? 'completed' : ''}`}
        onClick={handleClick}
        disabled={isCompleted || loading}
      >
        {isCompleted ? '✓ Topic Completed' : loading ? 'Saving...' : 'Mark as Complete'}
      </button>
    </div>
  )
}

export default ProgressButton