import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function closeMenu() {
    setIsOpen(false)
  }

  function handleLogout() {
    logout()
    navigate('/')
    closeMenu()
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" onClick={closeMenu}>DSA Visualizer</NavLink>
      </div>

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

        {user ? (
          <>
            <span className="navbar-username">Hi, {user.username}</span>
            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
            <NavLink to="/register" className="navbar-register" onClick={closeMenu}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar