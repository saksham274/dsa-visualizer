import { createContext, useState, useContext, useEffect } from 'react'
import { getProfile } from '../utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      // fetch fresh profile from server to get latest progress
      getProfile(savedToken).then((data) => {
        if (data && !data.message) {
          setUser(data)
          localStorage.setItem('user', JSON.stringify(data))
        }
      })
    }
    setLoading(false)
  }, [])

  function login(userData, userToken) {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  function updateUserProgress(topic) {
    setUser((prev) => {
      const updated = {
        ...prev,
        progress: { ...prev.progress, [topic]: true }
      }
      localStorage.setItem('user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, updateUserProgress }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}