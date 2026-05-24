import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './ArrayVisualizer.css'

function ArrayVisualizer() {
  const [array, setArray] = useState([10, 25, 8, 42, 16, 35])
  const [inputValue, setInputValue] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(null)
  const [message, setMessage] = useState('')

  // generate a new random array
  function generateRandom() {
    const newArray = Array.from(
      { length: 6 },
      () => Math.floor(Math.random() * 99) + 1
    )
    setArray(newArray)
    setMessage('Generated a new random array')
    setHighlightIndex(null)
  }

  // add element to end of array
  function addElement() {
    const val = parseInt(inputValue)
    if (isNaN(val)) {
      setMessage('Please enter a valid number')
      return
    }
    if (array.length >= 10) {
      setMessage('Array is full (max 10 elements)')
      return
    }
    setArray([...array, val])
    setHighlightIndex(array.length)
    setMessage(`Added ${val} at index ${array.length}`)
    setInputValue('')
  }

  // remove last element
  function removeElement() {
    if (array.length === 0) {
      setMessage('Array is already empty')
      return
    }
    const removed = array[array.length - 1]
    setArray(array.slice(0, -1))
    setHighlightIndex(null)
    setMessage(`Removed ${removed} from the end`)
  }

  // search for an element
  function searchElement() {
    const val = parseInt(inputValue)
    if (isNaN(val)) {
      setMessage('Please enter a valid number')
      return
    }
    const index = array.indexOf(val)
    if (index === -1) {
      setMessage(`${val} was not found in the array`)
      setHighlightIndex(null)
    } else {
      setHighlightIndex(index)
      setMessage(`Found ${val} at index ${index}`)
    }
    setInputValue('')
  }

  return (
    <div className="array-visualizer">

      <div className="av-header">
        <h2>Array Visualizer</h2>
        <p>
          An array stores elements in contiguous memory locations.
          Each element has an index starting from 0.
        </p>
      </div>

      {/* array display */}
      <div className="array-container">
        <AnimatePresence>
          {array.map((value, index) => (
            <motion.div
              key={index}
              className={`array-element ${highlightIndex === index ? 'highlighted' : ''}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="element-value">{value}</div>
              <div className="element-index">{index}</div>
            </motion.div>
          ))}
        </AnimatePresence>

        {array.length === 0 && (
          <p className="empty-message">Array is empty</p>
        )}
      </div>

      {/* message box */}
      {message && (
        <div className="av-message">
          {message}
        </div>
      )}

      {/* controls */}
      <div className="av-controls">
        <div className="input-row">
          <input
            type="number"
            placeholder="Enter a number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addElement()}
          />
          <button className="btn-primary" onClick={addElement}>Add</button>
          <button className="btn-danger" onClick={removeElement}>Remove Last</button>
          <button className="btn-search" onClick={searchElement}>Search</button>
        </div>

        <button className="btn-generate" onClick={generateRandom}>
          Generate Random Array
        </button>
      </div>

      {/* info section */}
      <div className="av-info">
        <h3>How Arrays Work</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>Access</h4>
            <p>Read any element instantly using its index. <span>O(1)</span></p>
          </div>
          <div className="info-card">
            <h4>Search</h4>
            <p>Check each element one by one until found. <span>O(n)</span></p>
          </div>
          <div className="info-card">
            <h4>Insert</h4>
            <p>Add at end is fast. Adding in middle shifts elements. <span>O(1) / O(n)</span></p>
          </div>
          <div className="info-card">
            <h4>Delete</h4>
            <p>Remove from end is fast. Middle deletion shifts elements. <span>O(1) / O(n)</span></p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ArrayVisualizer