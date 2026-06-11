import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Arrays from './pages/Arrays'
import Sorting from './pages/Sorting'
import Searching from './pages/Searching'
import StackQueue from './pages/StackQueue'
import Trees from './pages/Trees'
import Graphs from './pages/Graphs'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/arrays" element={<Arrays />} />
          <Route path="/sorting" element={<Sorting />} />
          <Route path="/searching" element={<Searching />} />
          <Route path="/stack-queue" element={<StackQueue />} />
          <Route path="/trees" element={<Trees />} />
          <Route path="/graphs" element={<Graphs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App