import { useState, useRef } from 'react'
import './SearchingVisualizer.css'
import ProgressButton from '../ProgressButton/ProgressButton'

const COLORS = {
  default: '#38bdf8',
  checking: '#f59e0b',
  found: '#4ade80',
  discarded: '#475569',
  low: '#a78bfa',
  high: '#f87171',
  mid: '#fb923c'
}

function SearchingVisualizer() {
  const [array, setArray] = useState(generateSortedArray())
  const [barColors, setBarColors] = useState({})
  const [algorithm, setAlgorithm] = useState('Linear Search')
  const [speed, setSpeed] = useState(400)
  const [isSearching, setIsSearching] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState('')
  const isSearchingRef = useRef(false)

  function generateSortedArray() {
    const arr = Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 80) + 10
    )
    return [...new Set(arr)].sort((a, b) => a - b).slice(0, 12)
  }

  function resetArray() {
    if (isSearchingRef.current) return
    setArray(generateSortedArray())
    setBarColors({})
    setIsDone(false)
    setMessage('')
    setTarget('')
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function updateColors(colorMap, currentArray) {
    setBarColors({ ...colorMap })
    setArray([...currentArray])
    await sleep(speed)
  }

  // ── LINEAR SEARCH ──
  async function linearSearch(val) {
    const arr = [...array]
    const colors = {}

    for (let i = 0; i < arr.length; i++) {
      if (!isSearchingRef.current) return

      setMessage(`Checking index ${i} — is ${arr[i]} equal to ${val}?`)
      colors[i] = COLORS.checking
      await updateColors(colors, arr)

      if (arr[i] === val) {
        colors[i] = COLORS.found
        await updateColors(colors, arr)
        setMessage(`Found ${val} at index ${i}!`)
        return
      }

      colors[i] = COLORS.discarded
      await updateColors(colors, arr)
    }

    setMessage(`${val} was not found in the array`)
  }

  // ── BINARY SEARCH ──
  async function binarySearch(val) {
    const arr = [...array]
    let low = 0
    let high = arr.length - 1
    const colors = {}

    while (low <= high) {
      if (!isSearchingRef.current) return

      const mid = Math.floor((low + high) / 2)

      // color low, mid, high
      arr.forEach((_, i) => {
        if (i < low || i > high) colors[i] = COLORS.discarded
        else colors[i] = COLORS.default
      })
      colors[low] = COLORS.low
      colors[high] = COLORS.high
      colors[mid] = COLORS.mid

      setMessage(
        `Low: index ${low} (${arr[low]})  |  Mid: index ${mid} (${arr[mid]})  |  High: index ${high} (${arr[high]})`
      )
      await updateColors(colors, arr)

      if (arr[mid] === val) {
        colors[mid] = COLORS.found
        await updateColors(colors, arr)
        setMessage(`Found ${val} at index ${mid}!`)
        return
      }

      if (arr[mid] < val) {
        setMessage(`${arr[mid]} < ${val} — search right half`)
        low = mid + 1
      } else {
        setMessage(`${arr[mid]} > ${val} — search left half`)
        high = mid - 1
      }

      await sleep(speed)
    }

    setMessage(`${val} was not found in the array`)
  }

  async function startSearch() {
    const val = parseInt(target)
    if (isNaN(val)) {
      setMessage('Please enter a valid number to search')
      return
    }
    if (isSearchingRef.current || isDone) return

    isSearchingRef.current = true
    setIsSearching(true)
    setBarColors({})

    if (algorithm === 'Linear Search') await linearSearch(val)
    else await binarySearch(val)

    isSearchingRef.current = false
    setIsSearching(false)
    setIsDone(true)
  }

  function stopSearch() {
    isSearchingRef.current = false
    setIsSearching(false)
    setMessage('Search stopped')
  }

  const maxVal = Math.max(...array)

  return (
    <div className="searching-visualizer">

      <div className="sv-header">
        <h2>Searching Visualizer</h2>
        <p>
          Enter a number and watch the algorithm search for it step by step.
          Binary Search only works on sorted arrays — which this always is.
        </p>
      </div>

      {/* bars */}
      <div className="bars-container">
        {array.map((value, index) => (
          <div key={index} className="bar-wrapper">
            <div
              className="bar"
              style={{
                height: `${(value / maxVal) * 100}%`,
                backgroundColor: barColors[index] || COLORS.default
              }}
            />
            <span className="bar-value">{value}</span>
          </div>
        ))}
      </div>

      {/* message */}
      {message && (
        <div className="sv-message">{message}</div>
      )}

      {/* legend */}
      <div className="legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: COLORS.checking }} />
          <span>Checking</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: COLORS.found }} />
          <span>Found</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: COLORS.discarded }} />
          <span>Discarded</span>
        </div>
        {algorithm === 'Binary Search' && (
          <>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: COLORS.low }} />
              <span>Low</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: COLORS.mid }} />
              <span>Mid</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: COLORS.high }} />
              <span>High</span>
            </div>
          </>
        )}
      </div>

      {/* controls */}
      <div className="sv-controls">

        {/* algorithm selector */}
        <div className="control-group">
          <label>Algorithm</label>
          <div className="algo-buttons">
            {['Linear Search', 'Binary Search'].map((algo) => (
              <button
                key={algo}
                className={`btn-algo ${algorithm === algo ? 'active' : ''}`}
                onClick={() => {
                  if (!isSearching) {
                    setAlgorithm(algo)
                    setIsDone(false)
                    setBarColors({})
                    setMessage('')
                  }
                }}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        {/* speed */}
        <div className="control-group">
          <label>Speed: {speed === 100 ? 'Fast' : speed === 400 ? 'Medium' : 'Slow'}</label>
          <input
            type="range"
            min="100"
            max="700"
            step="300"
            value={speed}
            onChange={(e) => {
              const val = Number(e.target.value)
              const snapped = val <= 200 ? 100 : val <= 500 ? 400 : 700
              setSpeed(snapped)
            }}
            disabled={isSearching}
          />
        </div>

        {/* target input + actions */}
        <div className="input-row">
          <input
            type="number"
            placeholder="Enter number to search"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && startSearch()}
            disabled={isSearching}
          />
          <button
            className="btn-primary"
            onClick={startSearch}
            disabled={isSearching || isDone}
          >
            {isSearching ? 'Searching...' : 'Start Search'}
          </button>
          <button
            className="btn-danger"
            onClick={stopSearch}
            disabled={!isSearching}
          >
            Stop
          </button>
          <button
            className="btn-generate"
            onClick={resetArray}
            disabled={isSearching}
          >
            New Array
          </button>
        </div>

      </div>

      {/* info cards */}
      <div className="sv-info">
        <h3>About {algorithm}</h3>
        <div className="info-grid">
          {algorithm === 'Linear Search' && (
            <>
              <div className="info-card">
                <h4>How it works</h4>
                <p>Checks every element one by one from left to right until the target is found.</p>
              </div>
              <div className="info-card">
                <h4>Time Complexity</h4>
                <p>Best: <span>O(1)</span> &nbsp; Average: <span>O(n)</span> &nbsp; Worst: <span>O(n)</span></p>
              </div>
              <div className="info-card">
                <h4>When to use</h4>
                <p>Works on both sorted and unsorted arrays. Good for small arrays.</p>
              </div>
            </>
          )}
          {algorithm === 'Binary Search' && (
            <>
              <div className="info-card">
                <h4>How it works</h4>
                <p>Repeatedly divides the search space in half by comparing with the middle element.</p>
              </div>
              <div className="info-card">
                <h4>Time Complexity</h4>
                <p>Best: <span>O(1)</span> &nbsp; Average: <span>O(log n)</span> &nbsp; Worst: <span>O(log n)</span></p>
              </div>
              <div className="info-card">
                <h4>When to use</h4>
                <p>Only works on sorted arrays. Much faster than linear search for large arrays.</p>
              </div>
            </>
          )}
        </div>
      </div>
      <ProgressButton topic="searching" />

    </div>
  )
}

export default SearchingVisualizer