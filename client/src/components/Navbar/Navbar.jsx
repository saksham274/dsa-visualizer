import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">DSA Visualizer</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/arrays">Arrays</Link>
        <Link to="/sorting">Sorting</Link>
        <Link to="/searching">Searching</Link>
        <Link to="/stack-queue">Stack & Queue</Link>
        <Link to="/trees">Trees</Link>
        <Link to="/graphs">Graphs</Link>
      </div>
    </nav>
  )
}

export default Navbar