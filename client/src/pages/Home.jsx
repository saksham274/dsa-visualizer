import { useNavigate } from 'react-router-dom'
import './Home.css'

const topics = [
  {
    id: 1,
    title: 'Arrays',
    description: 'Visualize array operations like insert, delete, and update with animations.',
    icon: '📊',
    path: '/arrays',
    color: '#38bdf8'
  },
  {
    id: 2,
    title: 'Sorting',
    description: 'Watch Bubble, Merge, Quick and more sorting algorithms step by step.',
    icon: '🔃',
    path: '/sorting',
    color: '#a78bfa'
  },
  {
    id: 3,
    title: 'Searching',
    description: 'See how Linear and Binary Search find elements in an array.',
    icon: '🔍',
    path: '/searching',
    color: '#34d399'
  },
  {
    id: 4,
    title: 'Stack & Queue',
    description: 'Understand push, pop, enqueue and dequeue with live animations.',
    icon: '📦',
    path: '/stack-queue',
    color: '#fb923c'
  },
  {
    id: 5,
    title: 'Trees',
    description: 'Explore Binary Search Trees with insert, delete and traversal animations.',
    icon: '🌳',
    path: '/trees',
    color: '#4ade80'
  },
  {
    id: 6,
    title: 'Graphs',
    description: 'Visualize BFS, DFS and Dijkstra algorithms on interactive graphs.',
    icon: '🕸️',
    path: '/graphs',
    color: '#f472b6'
  }
]

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      <div className="home-hero">
        <h1>Learn DSA <span>Visually</span></h1>
        <p>
          Stop memorizing. Start understanding. Watch every algorithm
          come to life with step by step animations.
        </p>
      </div>

      <div className="topics-grid">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="topic-card"
            style={{ '--card-color': topic.color }}
            onClick={() => navigate(topic.path)}
          >
            <div className="card-icon">{topic.icon}</div>
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
            <div className="card-footer">
              <span>Explore →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home