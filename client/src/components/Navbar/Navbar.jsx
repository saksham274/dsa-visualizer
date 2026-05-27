import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" onClick={closeMenu}>DSA Visualizer</NavLink>
      </div>

      {/* hamburger button — only visible on mobile */}
      <button
        className="hamburger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
        <NavLink to="/arrays" onClick={closeMenu}>Arrays</NavLink>
        <NavLink to="/sorting" onClick={closeMenu}>Sorting</NavLink>
        <NavLink to="/searching" onClick={closeMenu}>Searching</NavLink>
        <NavLink to="/stack-queue" onClick={closeMenu}>Stack & Queue</NavLink>
        <NavLink to="/trees" onClick={closeMenu}>Trees</NavLink>
        <NavLink to="/graphs" onClick={closeMenu}>Graphs</NavLink>
      </div>
    </nav>
  )
}

export default Navbar