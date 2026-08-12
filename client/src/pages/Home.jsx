import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const topics = [
  {
    id: 1,
    title: 'Arrays',
    description: 'Visualize array operations like insert, delete, and update with animations.',
    icon: '📊',
    path: '/arrays',
    color: '#38bdf8',
    progressKey: 'arrays'
  },
  {
    id: 2,
    title: 'Sorting',
    description: 'Watch Bubble, Merge, Quick and more sorting algorithms step by step.',
    icon: '🔃',
    path: '/sorting',
    color: '#a78bfa',
    progressKey: 'sorting'
  },
  {
    id: 3,
    title: 'Searching',
    description: 'See how Linear and Binary Search find elements in an array.',
    icon: '🔍',
    path: '/searching',
    color: '#34d399',
    progressKey: 'searching'
  },
  {
    id: 4,
    title: 'Stack & Queue',
    description: 'Understand push, pop, enqueue and dequeue with live animations.',
    icon: '📦',
    path: '/stack-queue',
    color: '#fb923c',
    progressKey: 'stackQueue'
  },
  {
    id: 5,
    title: 'Trees',
    description: 'Explore Binary Search Trees with insert, delete and traversal animations.',
    icon: '🌳',
    path: '/trees',
    color: '#4ade80',
    progressKey: 'trees'
  },
  {
    id: 6,
    title: 'Graphs',
    description: 'Visualize BFS, DFS and Dijkstra algorithms on interactive graphs.',
    icon: '🕸️',
    path: '/graphs',
    color: '#f472b6',
    progressKey: 'graphs'
  }
]

function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const completedCount = user
    ? Object.values(user.progress || {}).filter(Boolean).length
    : 0

  const totalCount = topics.length

  return (
    <div className="home">
      <div className="home-hero">
        <h1>Learn DSA <span>Visually</span></h1>
        <p>
          Stop memorizing. Start understanding. Watch every algorithm
          come to life with step by step animations.
        </p>

        {/* progress bar — only show if logged in */}
        {user && (
          <div className="progress-section">
            <div className="progress-text">
              <span>Your Progress</span>
              <span>{completedCount} / {totalCount} completed</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="topics-grid">
        {topics.map((topic) => {
          const isCompleted = user?.progress?.[topic.progressKey] || false
          return (
            <div
              key={topic.id}
              className={`topic-card ${isCompleted ? 'completed' : ''}`}
              style={{ '--card-color': topic.color }}
              onClick={() => navigate(topic.path)}
            >
              {isCompleted && (
                <div className="completed-badge">✓ Completed</div>
              )}
              <div className="card-icon">{topic.icon}</div>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <div className="card-footer">
                <span>{isCompleted ? 'Review →' : 'Explore →'}</span>
              </div>
            </div>
          )
        })}
      </div>

      {!user && (
        <p className="login-hint">
          <span onClick={() => navigate('/login')}>Login</span> or{' '}
          <span onClick={() => navigate('/register')}>Register</span> to track your progress
        </p>
      )}
    </div>
  )
}

export default Home