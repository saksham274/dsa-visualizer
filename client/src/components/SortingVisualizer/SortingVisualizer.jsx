import { useState, useRef } from 'react'
import './SortingVisualizer.css'
import ProgressButton from '../ProgressButton/ProgressButton'

const ALGORITHMS = ['Bubble Sort', 'Selection Sort', 'Insertion Sort']

const COLORS = {
  default: '#38bdf8',
  comparing: '#f59e0b',
  swapping: '#f87171',
  sorted: '#4ade80',
  selected: '#a78bfa'
}

function SortingVisualizer() {
  const [array, setArray] = useState(generateArray())
  const [barColors, setBarColors] = useState({})
  const [algorithm, setAlgorithm] = useState('Bubble Sort')
  const [speed, setSpeed] = useState(400)
  const [isSorting, setIsSorting] = useState(false)
  const [isSorted, setIsSorted] = useState(false)
  const [message, setMessage] = useState('')
  const isSortingRef = useRef(false)

  function generateArray() {
    return Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 80) + 10
    )
  }

  function resetArray() {
    if (isSortingRef.current) return
    const newArray = generateArray()
    setArray(newArray)
    setBarColors({})
    setIsSorted(false)
    setMessage('')
  }

  // delay helper for animations
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // update color of specific bars
  async function colorBars(indices, color, currentArray) {
    setBarColors((prev) => {
      const updated = { ...prev }
      indices.forEach((i) => (updated[i] = color))
      return updated
    })
    setArray([...currentArray])
    await sleep(speed)
  }

  // mark all bars as sorted
  function markAllSorted(arr) {
    const allGreen = {}
    arr.forEach((_, i) => (allGreen[i] = COLORS.sorted))
    setBarColors(allGreen)
    setArray([...arr])
  }

  // ── BUBBLE SORT ──
  async function bubbleSort() {
    const arr = [...array]
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!isSortingRef.current) return

        setMessage(`Comparing index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]})`)
        await colorBars([j, j + 1], COLORS.comparing, arr)

        if (arr[j] > arr[j + 1]) {
          setMessage(`${arr[j]} > ${arr[j + 1]} — swapping them`)
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          await colorBars([j, j + 1], COLORS.swapping, arr)
        }

        await colorBars([j, j + 1], COLORS.default, arr)
      }

      // mark last sorted element green
      setBarColors((prev) => ({ ...prev, [n - 1 - i]: COLORS.sorted }))
    }

    markAllSorted(arr)
    setMessage('Array is fully sorted!')
  }

  // ── SELECTION SORT ──
  async function selectionSort() {
    const arr = [...array]
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
      if (!isSortingRef.current) return

      let minIndex = i
      setMessage(`Finding minimum element from index ${i} to ${n - 1}`)
      await colorBars([minIndex], COLORS.selected, arr)

      for (let j = i + 1; j < n; j++) {
        if (!isSortingRef.current) return

        setMessage(`Comparing ${arr[j]} with current minimum ${arr[minIndex]}`)
        await colorBars([j], COLORS.comparing, arr)

        if (arr[j] < arr[minIndex]) {
          await colorBars([minIndex], COLORS.default, arr)
          minIndex = j
          setMessage(`New minimum found: ${arr[minIndex]} at index ${minIndex}`)
          await colorBars([minIndex], COLORS.selected, arr)
        } else {
          await colorBars([j], COLORS.default, arr)
        }
      }

      if (minIndex !== i) {
        setMessage(`Swapping ${arr[i]} with minimum ${arr[minIndex]}`)
        ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
        await colorBars([i, minIndex], COLORS.swapping, arr)
      }

      setBarColors((prev) => ({ ...prev, [i]: COLORS.sorted }))
      await colorBars([minIndex], COLORS.default, arr)
    }

    markAllSorted(arr)
    setMessage('Array is fully sorted!')
  }

  // ── INSERTION SORT ──
  async function insertionSort() {
    const arr = [...array]
    const n = arr.length

    for (let i = 1; i < n; i++) {
      if (!isSortingRef.current) return

      const key = arr[i]
      let j = i - 1
      setMessage(`Taking element ${key} at index ${i} and finding correct position`)
      await colorBars([i], COLORS.selected, arr)

      while (j >= 0 && arr[j] > key) {
        if (!isSortingRef.current) return

        setMessage(`${arr[j]} > ${key} — shifting ${arr[j]} one position right`)
        arr[j + 1] = arr[j]
        await colorBars([j, j + 1], COLORS.comparing, arr)
        j--
      }

      arr[j + 1] = key
      await colorBars([j + 1], COLORS.swapping, arr)
      await colorBars([j + 1], COLORS.default, arr)
    }

    markAllSorted(arr)
    setMessage('Array is fully sorted!')
  }

  // start sorting
  async function startSorting() {
    if (isSortingRef.current || isSorted) return
    isSortingRef.current = true
    setIsSorting(true)
    setBarColors({})

    if (algorithm === 'Bubble Sort') await bubbleSort()
    else if (algorithm === 'Selection Sort') await selectionSort()
    else if (algorithm === 'Insertion Sort') await insertionSort()

    isSortingRef.current = false
    setIsSorting(false)
    setIsSorted(true)
  }

  // stop sorting
  function stopSorting() {
    isSortingRef.current = false
    setIsSorting(false)
    setMessage('Sorting stopped')
  }

  const maxVal = Math.max(...array)

  return (
    <div className="sorting-visualizer">

      <div className="sv-header">
        <h2>Sorting Visualizer</h2>
        <p>
          Watch sorting algorithms work step by step.
          Each bar represents an element — the taller the bar, the larger the value.
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

      {/* color legend */}
      <div className="legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: COLORS.default }} />
          <span>Default</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: COLORS.comparing }} />
          <span>Comparing</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: COLORS.swapping }} />
          <span>Swapping</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: COLORS.selected }} />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: COLORS.sorted }} />
          <span>Sorted</span>
        </div>
      </div>

      {/* controls */}
      <div className="sv-controls">

        {/* algorithm selector */}
        <div className="control-group">
          <label>Algorithm</label>
          <div className="algo-buttons">
            {ALGORITHMS.map((algo) => (
              <button
                key={algo}
                className={`btn-algo ${algorithm === algo ? 'active' : ''}`}
                onClick={() => {
                  if (!isSorting) {
                    setAlgorithm(algo)
                    setIsSorted(false)
                    setBarColors({})
                  }
                }}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        {/* speed control */}
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
            disabled={isSorting}
          />
        </div>

        {/* action buttons */}
        <div className="action-buttons">
          <button
            className="btn-primary"
            onClick={startSorting}
            disabled={isSorting || isSorted}
          >
            {isSorting ? 'Sorting...' : 'Start Sort'}
          </button>
          <button
            className="btn-danger"
            onClick={stopSorting}
            disabled={!isSorting}
          >
            Stop
          </button>
          <button
            className="btn-generate"
            onClick={resetArray}
            disabled={isSorting}
          >
            New Array
          </button>
        </div>

      </div>

      {/* info cards */}
      <div className="sv-info">
        <h3>About {algorithm}</h3>
        <div className="info-grid">
          {algorithm === 'Bubble Sort' && (
            <>
              <div className="info-card">
                <h4>How it works</h4>
                <p>Repeatedly compares adjacent elements and swaps them if they are in the wrong order.</p>
              </div>
              <div className="info-card">
                <h4>Time Complexity</h4>
                <p>Best: <span>O(n)</span> &nbsp; Average: <span>O(n²)</span> &nbsp; Worst: <span>O(n²)</span></p>
              </div>
              <div className="info-card">
                <h4>Space Complexity</h4>
                <p><span>O(1)</span> — sorts in place, no extra memory needed.</p>
              </div>
            </>
          )}
          {algorithm === 'Selection Sort' && (
            <>
              <div className="info-card">
                <h4>How it works</h4>
                <p>Finds the minimum element and places it at the beginning. Repeats for remaining elements.</p>
              </div>
              <div className="info-card">
                <h4>Time Complexity</h4>
                <p>Best: <span>O(n²)</span> &nbsp; Average: <span>O(n²)</span> &nbsp; Worst: <span>O(n²)</span></p>
              </div>
              <div className="info-card">
                <h4>Space Complexity</h4>
                <p><span>O(1)</span> — sorts in place, no extra memory needed.</p>
              </div>
            </>
          )}
          {algorithm === 'Insertion Sort' && (
            <>
              <div className="info-card">
                <h4>How it works</h4>
                <p>Builds sorted array one element at a time by inserting each element in its correct position.</p>
              </div>
              <div className="info-card">
                <h4>Time Complexity</h4>
                <p>Best: <span>O(n)</span> &nbsp; Average: <span>O(n²)</span> &nbsp; Worst: <span>O(n²)</span></p>
              </div>
              <div className="info-card">
                <h4>Space Complexity</h4>
                <p><span>O(1)</span> — sorts in place, no extra memory needed.</p>
              </div>
            </>
          )}
        </div>
      </div>
      <ProgressButton topic="sorting" />

    </div>
  )
}

export default SortingVisualizer