import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './StackQueueVisualizer.css'
import ProgressButton from '../ProgressButton/ProgressButton'

function StackQueueVisualizer() {
  const [mode, setMode] = useState('Stack')
  const [items, setItems] = useState([20, 35, 15, 42])
  const [inputValue, setInputValue] = useState('')
  const [message, setMessage] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(null)

  function switchMode(newMode) {
    setMode(newMode)
    setItems([20, 35, 15, 42])
    setMessage('')
    setInputValue('')
    setHighlightIndex(null)
  }

  // ── STACK OPERATIONS ──
  function push() {
    const val = parseInt(inputValue)
    if (isNaN(val)) {
      setMessage('Please enter a valid number')
      return
    }
    if (items.length >= 8) {
      setMessage('Stack Overflow! Stack is full (max 8 elements)')
      return
    }
    setItems([...items, val])
    setHighlightIndex(items.length)
    setMessage(`Pushed ${val} onto the top of the stack`)
    setInputValue('')
  }

  function pop() {
    if (items.length === 0) {
      setMessage('Stack Underflow! Stack is empty')
      return
    }
    const val = items[items.length - 1]
    setHighlightIndex(null)
    setItems(items.slice(0, -1))
    setMessage(`Popped ${val} from the top of the stack`)
  }

  function peek() {
    if (items.length === 0) {
      setMessage('Stack is empty — nothing to peek')
      return
    }
    const val = items[items.length - 1]
    setHighlightIndex(items.length - 1)
    setMessage(`Peek — top element is ${val}`)
  }

  // ── QUEUE OPERATIONS ──
  function enqueue() {
    const val = parseInt(inputValue)
    if (isNaN(val)) {
      setMessage('Please enter a valid number')
      return
    }
    if (items.length >= 8) {
      setMessage('Queue is full (max 8 elements)')
      return
    }
    setItems([...items, val])
    setHighlightIndex(items.length)
    setMessage(`Enqueued ${val} at the rear of the queue`)
    setInputValue('')
  }

  function dequeue() {
    if (items.length === 0) {
      setMessage('Queue is empty — nothing to dequeue')
      return
    }
    const val = items[0]
    setHighlightIndex(null)
    setItems(items.slice(1))
    setMessage(`Dequeued ${val} from the front of the queue`)
  }

  function front() {
    if (items.length === 0) {
      setMessage('Queue is empty — nothing at front')
      return
    }
    setHighlightIndex(0)
    setMessage(`Front element is ${items[0]}`)
  }

  function rear() {
    if (items.length === 0) {
      setMessage('Queue is empty — nothing at rear')
      return
    }
    setHighlightIndex(items.length - 1)
    setMessage(`Rear element is ${items[items.length - 1]}`)
  }

  return (
    <div className="sq-visualizer">

      <div className="sq-header">
        <h2>{mode} Visualizer</h2>
        <p>
          {mode === 'Stack'
            ? 'A Stack follows LIFO — Last In First Out. The last element pushed is the first to be popped.'
            : 'A Queue follows FIFO — First In First Out. The first element enqueued is the first to be dequeued.'}
        </p>
      </div>

      {/* mode switcher */}
      <div className="mode-switcher">
        {['Stack', 'Queue'].map((m) => (
          <button
            key={m}
            className={`btn-mode ${mode === m ? 'active' : ''}`}
            onClick={() => switchMode(m)}
          >
            {m}
          </button>
        ))}
      </div>

      {/* visual area */}
      <div className="sq-visual">

        {mode === 'Stack' ? (
          <div className="stack-container">
            {/* top label */}
            {items.length > 0 && (
              <div className="pointer-label top-label">← TOP</div>
            )}

            <AnimatePresence>
              {[...items].reverse().map((value, index) => {
                const actualIndex = items.length - 1 - index
                return (
                  <motion.div
                    key={actualIndex}
                    className={`sq-element ${highlightIndex === actualIndex ? 'highlighted' : ''}`}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="sq-value">{value}</span>
                    {actualIndex === items.length - 1 && (
                      <span className="sq-tag">TOP</span>
                    )}
                    {actualIndex === 0 && items.length > 1 && (
                      <span className="sq-tag bottom-tag">BOTTOM</span>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {items.length === 0 && (
              <div className="empty-message">Stack is empty</div>
            )}
          </div>
        ) : (
          <div className="queue-container">
            {items.length > 0 && (
              <div className="queue-labels">
                <span className="queue-pointer">FRONT ↓</span>
                <span className="queue-pointer rear-pointer">↓ REAR</span>
              </div>
            )}

            <div className="queue-items">
              <AnimatePresence>
                {items.map((value, index) => (
                  <motion.div
                    key={index}
                    className={`sq-element horizontal ${highlightIndex === index ? 'highlighted' : ''}`}
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="sq-value">{value}</span>
                    {index === 0 && <span className="sq-tag">F</span>}
                    {index === items.length - 1 && items.length > 1 && (
                      <span className="sq-tag bottom-tag">R</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {items.length === 0 && (
              <div className="empty-message">Queue is empty</div>
            )}
          </div>
        )}

      </div>

      {/* message */}
      {message && (
        <div className="sq-message">{message}</div>
      )}

      {/* controls */}
      <div className="sq-controls">
        <div className="input-row">
          <input
            type="number"
            placeholder="Enter a number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                mode === 'Stack' ? push() : enqueue()
              }
            }}
          />

          {mode === 'Stack' ? (
            <>
              <button className="btn-primary" onClick={push}>Push</button>
              <button className="btn-danger" onClick={pop}>Pop</button>
              <button className="btn-secondary" onClick={peek}>Peek</button>
            </>
          ) : (
            <>
              <button className="btn-primary" onClick={enqueue}>Enqueue</button>
              <button className="btn-danger" onClick={dequeue}>Dequeue</button>
              <button className="btn-secondary" onClick={front}>Front</button>
              <button className="btn-secondary" onClick={rear}>Rear</button>
            </>
          )}
        </div>
      </div>

      {/* info cards */}
      <div className="sq-info">
        <h3>How {mode} Works</h3>
        <div className="info-grid">
          {mode === 'Stack' ? (
            <>
              <div className="info-card">
                <h4>Push</h4>
                <p>Add an element to the <span>top</span> of the stack. <span>O(1)</span></p>
              </div>
              <div className="info-card">
                <h4>Pop</h4>
                <p>Remove the element from the <span>top</span> of the stack. <span>O(1)</span></p>
              </div>
              <div className="info-card">
                <h4>Peek</h4>
                <p>View the <span>top</span> element without removing it. <span>O(1)</span></p>
              </div>
              <div className="info-card">
                <h4>Real world use</h4>
                <p>Undo/redo in editors, browser back button, function call stack.</p>
              </div>
            </>
          ) : (
            <>
              <div className="info-card">
                <h4>Enqueue</h4>
                <p>Add an element to the <span>rear</span> of the queue. <span>O(1)</span></p>
              </div>
              <div className="info-card">
                <h4>Dequeue</h4>
                <p>Remove the element from the <span>front</span> of the queue. <span>O(1)</span></p>
              </div>
              <div className="info-card">
                <h4>Front / Rear</h4>
                <p>View the <span>first</span> or <span>last</span> element without removing it. <span>O(1)</span></p>
              </div>
              <div className="info-card">
                <h4>Real world use</h4>
                <p>Print queue, CPU scheduling, BFS graph traversal.</p>
              </div>
            </>
          )}
        </div>
      </div>
      <ProgressButton topic="stackQueue" />

    </div>
  )
}

export default StackQueueVisualizer