import { useState } from 'react'
import './TreeVisualizer.css'
import ProgressButton from '../ProgressButton/ProgressButton'

// ── BST NODE ──
class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

// ── BST OPERATIONS ──
function insertNode(root, value) {
  if (!root) return new Node(value)
  if (value < root.value) root.left = insertNode(root.left, value)
  else if (value > root.value) root.right = insertNode(root.right, value)
  return root
}

function buildTree(values) {
  let root = null
  values.forEach((v) => (root = insertNode(root, v)))
  return root
}

// assign x/y positions to each node for rendering
function assignPositions(node, depth = 0, left = 0, right = 1, positions = {}) {
  if (!node) return positions
  const x = (left + right) / 2
  const y = depth
  positions[node.value] = { x, y }
  assignPositions(node.left, depth + 1, left, x, positions)
  assignPositions(node.right, depth + 1, x, right, positions)
  return positions
}

// collect edges for drawing lines
function collectEdges(node, positions, edges = []) {
  if (!node) return edges
  if (node.left) {
    edges.push({ from: node.value, to: node.left.value })
    collectEdges(node.left, positions, edges)
  }
  if (node.right) {
    edges.push({ from: node.value, to: node.right.value })
    collectEdges(node.right, positions, edges)
  }
  return edges
}

// traversal helpers — return array of values in order
function inorder(node, result = []) {
  if (!node) return result
  inorder(node.left, result)
  result.push(node.value)
  inorder(node.right, result)
  return result
}

function preorder(node, result = []) {
  if (!node) return result
  result.push(node.value)
  preorder(node.left, result)
  preorder(node.right, result)
  return result
}

function postorder(node, result = []) {
  if (!node) return result
  postorder(node.left, result)
  postorder(node.right, result)
  result.push(node.value)
  return result
}

const DEFAULT_VALUES = [40, 20, 60, 10, 30, 50, 70]

function TreeVisualizer() {
  const [values, setValues] = useState(DEFAULT_VALUES)
  const [inputValue, setInputValue] = useState('')
  const [highlightedNodes, setHighlightedNodes] = useState([])
  const [foundNode, setFoundNode] = useState(null)
  const [message, setMessage] = useState('')
  const [traversalResult, setTraversalResult] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)

  const root = buildTree(values)
  const positions = assignPositions(root)
  const edges = collectEdges(root, positions)

  // SVG dimensions
  const SVG_WIDTH = 700
  const SVG_HEIGHT = 380
  const NODE_RADIUS = 24

  function getCoords(value) {
    const pos = positions[value]
    if (!pos) return { cx: 0, cy: 0 }
    return {
      cx: pos.x * SVG_WIDTH,
      cy: pos.y * 90 + 50
    }
  }

  // insert a new node
  function handleInsert() {
    const val = parseInt(inputValue)
    if (isNaN(val)) {
      setMessage('Please enter a valid number')
      return
    }
    if (values.includes(val)) {
      setMessage(`${val} already exists in the tree`)
      return
    }
    if (values.length >= 15) {
      setMessage('Tree is full (max 15 nodes)')
      return
    }
    setValues([...values, val])
    setHighlightedNodes([val])
    setFoundNode(null)
    setTraversalResult([])
    setMessage(`Inserted ${val} into the BST`)
    setInputValue('')
    setTimeout(() => setHighlightedNodes([]), 1500)
  }

  // search for a node
  function handleSearch() {
    const val = parseInt(inputValue)
    if (isNaN(val)) {
      setMessage('Please enter a valid number')
      return
    }

    // animate search path
    const path = []
    let current = root
    while (current) {
      path.push(current.value)
      if (val === current.value) break
      else if (val < current.value) current = current.left
      else current = current.right
    }

    if (!path.includes(val)) {
      setMessage(`${val} was not found in the tree`)
      setHighlightedNodes(path)
      setFoundNode(null)
      setTimeout(() => setHighlightedNodes([]), 2000)
      return
    }

    // animate step by step
    setIsAnimating(true)
    setTraversalResult([])
    path.forEach((nodeVal, i) => {
      setTimeout(() => {
        setHighlightedNodes(path.slice(0, i + 1))
        if (nodeVal === val) {
          setFoundNode(val)
          setMessage(`Found ${val} in the tree!`)
          setIsAnimating(false)
        } else {
          setMessage(
            `${val} ${val < nodeVal ? '<' : '>'} ${nodeVal} — go ${val < nodeVal ? 'left' : 'right'}`
          )
        }
      }, i * 700)
    })
    setInputValue('')
  }

  // animate traversal
  async function handleTraversal(type) {
    if (isAnimating) return
    setIsAnimating(true)
    setFoundNode(null)
    setHighlightedNodes([])

    let order = []
    if (type === 'Inorder') order = inorder(root)
    else if (type === 'Preorder') order = preorder(root)
    else order = postorder(root)

    setTraversalResult([])
    setMessage(`Starting ${type} traversal...`)

    for (let i = 0; i < order.length; i++) {
      await new Promise((r) => setTimeout(r, 600))
      setHighlightedNodes([order[i]])
      setTraversalResult(order.slice(0, i + 1))
      setMessage(`${type}: visiting node ${order[i]}`)
    }

    setMessage(`${type} traversal complete: [ ${order.join(' → ')} ]`)
    setHighlightedNodes([])
    setIsAnimating(false)
  }

  // reset tree
  function resetTree() {
    if (isAnimating) return
    setValues(DEFAULT_VALUES)
    setHighlightedNodes([])
    setFoundNode(null)
    setTraversalResult([])
    setMessage('')
    setInputValue('')
  }

  return (
    <div className="tree-visualizer">

      <div className="tv-header">
        <h2>Binary Search Tree Visualizer</h2>
        <p>
          In a BST, left child is always smaller and right child is always larger than the parent.
          Insert values and watch them find their correct position.
        </p>
      </div>

      {/* SVG tree */}
      <div className="tree-svg-container">
        <svg width="100%" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>

          {/* edges */}
          {edges.map((edge, i) => {
            const from = getCoords(edge.from)
            const to = getCoords(edge.to)
            return (
              <line
                key={i}
                x1={from.cx}
                y1={from.cy}
                x2={to.cx}
                y2={to.cy}
                stroke="#334155"
                strokeWidth="2"
              />
            )
          })}

          {/* nodes */}
          {values.map((val) => {
            const { cx, cy } = getCoords(val)
            const isHighlighted = highlightedNodes.includes(val)
            const isFound = foundNode === val

            return (
              <g key={val}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={NODE_RADIUS}
                  fill={
                    isFound
                      ? '#4ade80'
                      : isHighlighted
                      ? '#fb923c'
                      : '#1e293b'
                  }
                  stroke={
                    isFound
                      ? '#4ade80'
                      : isHighlighted
                      ? '#fb923c'
                      : '#4ade80'
                  }
                  strokeWidth="2"
                  style={{ transition: 'fill 0.3s, stroke 0.3s' }}
                />
                <text
                  x={cx}
                  y={cy + 5}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill={isHighlighted || isFound ? '#0f172a' : '#e2e8f0'}
                  style={{ transition: 'fill 0.3s' }}
                >
                  {val}
                </text>
              </g>
            )
          })}

        </svg>
      </div>

      {/* message */}
      {message && (
        <div className="tv-message">{message}</div>
      )}

      {/* traversal result */}
      {traversalResult.length > 0 && (
        <div className="traversal-result">
          {traversalResult.map((val, i) => (
            <span key={i} className="traversal-node">
              {val}
              {i < traversalResult.length - 1 && (
                <span className="traversal-arrow"> → </span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* controls */}
      <div className="tv-controls">

        {/* insert / search */}
        <div className="input-row">
          <input
            type="number"
            placeholder="Enter a number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
            disabled={isAnimating}
          />
          <button
            className="btn-primary"
            onClick={handleInsert}
            disabled={isAnimating}
          >
            Insert
          </button>
          <button
            className="btn-search"
            onClick={handleSearch}
            disabled={isAnimating}
          >
            Search
          </button>
          <button
            className="btn-generate"
            onClick={resetTree}
            disabled={isAnimating}
          >
            Reset Tree
          </button>
        </div>

        {/* traversal buttons */}
        <div className="traversal-buttons">
          <span className="traversal-label">Traversal:</span>
          {['Inorder', 'Preorder', 'Postorder'].map((type) => (
            <button
              key={type}
              className="btn-traversal"
              onClick={() => handleTraversal(type)}
              disabled={isAnimating}
            >
              {type}
            </button>
          ))}
        </div>

      </div>

      {/* info cards */}
      <div className="tv-info">
        <h3>BST Operations</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>Insert</h4>
            <p>Compare with root, go left if smaller, right if larger. Repeat until empty spot found. <span>O(log n)</span></p>
          </div>
          <div className="info-card">
            <h4>Search</h4>
            <p>Same as insert — follow left/right based on comparison. Very fast on balanced trees. <span>O(log n)</span></p>
          </div>
          <div className="info-card">
            <h4>Inorder</h4>
            <p>Left → Root → Right. Visits nodes in <span>ascending order</span>.</p>
          </div>
          <div className="info-card">
            <h4>Preorder</h4>
            <p>Root → Left → Right. Used to <span>copy or serialize</span> the tree.</p>
          </div>
          <div className="info-card">
            <h4>Postorder</h4>
            <p>Left → Right → Root. Used to <span>delete</span> the tree safely.</p>
          </div>
        </div>
      </div>
      <ProgressButton topic="trees" />

    </div>
  )
}

export default TreeVisualizer