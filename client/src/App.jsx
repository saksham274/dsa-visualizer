import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Arrays from './pages/Arrays'
import Sorting from './pages/Sorting'
import Searching from './pages/Searching'
import StackQueue from './pages/StackQueue'
import Trees from './pages/Trees'
import Graphs from './pages/Graphs'

function App() {
  return (
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
      </Routes>
    </BrowserRouter>
  )
}

export default App