import { useState } from 'react'
import './GraphVisualizer.css'

// default graph — nodes with x,y positions and adjacency list
const DEFAULT_NODES = [
  { id: 0, label: 'A', x: 350, y: 60 },
  { id: 1, label: 'B', x: 180, y: 160 },
  { id: 2, label: 'C', x: 520, y: 160 },
  { id: 3, label: 'D', x: 100, y: 280 },
  { id: 4, label: 'E', x: 280, y: 280 },
  { id: 5, label: 'F', x: 460, y: 280 },
  { id: 6, label: 'G', x: 620, y: 280 },
]

const DEFAULT_EDGES = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 2, to: 6 },
  { from: 4, to: 5 },
]

// build adjacency list from edges
function buildAdjList(nodes, edges) {
  const adj = {}
  nodes.forEach((n) => (adj[n.id] = []))
  edges.forEach(({ from, to }) => {
    adj[from].push(to)
    adj[to].push(from)
  })
  return adj
}

const NODE_COLORS = {
  default: '#1e293b',
  visiting: '#f59e0b',
  visited: '#f472b6',
  current: '#f87171',
  start: '#a78bfa',
}

function GraphVisualizer() {
  const [nodes] = useState(DEFAULT_NODES)
  const [edges] = useState(DEFAULT_EDGES)
  const [nodeColors, setNodeColors] = useState({})
  const [visitedOrder, setVisitedOrder] = useState([])
  const [algorithm, setAlgorithm] = useState('BFS')
  const [startNode, setStartNode] = useState(0)
  const [speed, setSpeed] = useState(400)
  const [isRunning, setIsRunning] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [message, setMessage] = useState('')
  const [queue, setQueue] = useState([])

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms))
  }

  function reset() {
    if (isRunning) return
    setNodeColors({})
    setVisitedOrder([])
    setMessage('')
    setQueue([])
    setIsDone(false)
  }

  // ── BFS ──
  async function runBFS() {
    const adj = buildAdjList(nodes, edges)
    const visited = new Set()
    const bfsQueue = [startNode]
    const colors = {}
    const order = []

    visited.add(startNode)
    colors[startNode] = NODE_COLORS.start
    setNodeColors({ ...colors })
    setMessage(`Starting BFS from node ${nodes[startNode].label}`)
    await sleep(speed)

    while (bfsQueue.length > 0) {
      const current = bfsQueue.shift()
      colors[current] = NODE_COLORS.current
      setNodeColors({ ...colors })
      setQueue([...bfsQueue])
      order.push(nodes[current].label)
      setVisitedOrder([...order])
      setMessage(
        `Visiting node ${nodes[current].label} — checking its neighbors`
      )
      await sleep(speed)

      for (const neighbor of adj[current]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          colors[neighbor] = NODE_COLORS.visiting
          setNodeColors({ ...colors })
          bfsQueue.push(neighbor)
          setQueue([...bfsQueue])
          setMessage(
            `Found unvisited neighbor ${nodes[neighbor].label} — adding to queue`
          )
          await sleep(speed)
        }
      }

      colors[current] = NODE_COLORS.visited
      setNodeColors({ ...colors })
    }

    setMessage(`BFS complete! Visited order: ${order.join(' → ')}`)
    setQueue([])
  }

  // ── DFS ──
  async function runDFS() {
    const adj = buildAdjList(nodes, edges)
    const visited = new Set()
    const colors = {}
    const order = []

    async function dfsHelper(nodeId) {
      visited.add(nodeId)
      colors[nodeId] = NODE_COLORS.current
      setNodeColors({ ...colors })
      order.push(nodes[nodeId].label)
      setVisitedOrder([...order])
      setMessage(`Visiting node ${nodes[nodeId].label} — going deeper`)
      await sleep(speed)

      for (const neighbor of adj[nodeId]) {
        if (!visited.has(neighbor)) {
          colors[neighbor] = NODE_COLORS.visiting
          setNodeColors({ ...colors })
          setMessage(
            `Found unvisited neighbor ${nodes[neighbor].label} — diving in`
          )
          await sleep(speed / 2)
          await dfsHelper(neighbor)
        }
      }

      colors[nodeId] = NODE_COLORS.visited
      setNodeColors({ ...colors })
    }

    colors[startNode] = NODE_COLORS.start
    setNodeColors({ ...colors })
    setMessage(`Starting DFS from node ${nodes[startNode].label}`)
    await sleep(speed)

    await dfsHelper(startNode)
    setMessage(`DFS complete! Visited order: ${order.join(' → ')}`)
  }

  async function startTraversal() {
    if (isRunning || isDone) return
    setIsRunning(true)
    setNodeColors({})
    setVisitedOrder([])
    setQueue([])

    if (algorithm === 'BFS') await runBFS()
    else await runDFS()

    setIsRunning(false)
    setIsDone(true)
  }

  return (
    <div className="graph-visualizer">

      <div className="gv-header">
        <h2>Graph Visualizer</h2>
        <p>
          A graph is a collection of nodes connected by edges.
          Watch BFS and DFS explore every node from a starting point.
        </p>
      </div>

      {/* SVG graph */}
      <div className="graph-svg-container">
        <svg width="100%" viewBox="0 0 720 360">

          {/* edges */}
          {edges.map((edge, i) => {
            const from = nodes[edge.from]
            const to = nodes[edge.to]
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#334155"
                strokeWidth="2"
              />
            )
          })}

          {/* nodes */}
          {nodes.map((node) => {
            const color = nodeColors[node.id] || NODE_COLORS.default
            return (
              <g
                key={node.id}
                onClick={() => {
                  if (!isRunning) {
                    setStartNode(node.id)
                    reset()
                    setMessage(`Start node set to ${node.label}`)
                  }
                }}
                style={{ cursor: isRunning ? 'default' : 'pointer' }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={28}
                  fill={color}
                  stroke={
                    node.id === startNode ? '#a78bfa' : '#f472b6'
                  }
                  strokeWidth={node.id === startNode ? 3 : 2}
                  style={{ transition: 'fill 0.3s' }}
                />
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="700"
                  fill="#e2e8f0"
                >
                  {node.label}
                </text>
              </g>
            )
          })}

        </svg>
      </div>

      {/* message */}
      {message && (
        <div className="gv-message">{message}</div>
      )}

      {/* visited order */}
      {visitedOrder.length > 0 && (
        <div className="visited-order">
          <span className="visited-label">Visited: </span>
          {visitedOrder.map((label, i) => (
            <span key={i} className="visited-node">
              {label}
              {i < visitedOrder.length - 1 && (
                <span className="visited-arrow"> → </span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* queue/stack display for BFS */}
      {algorithm === 'BFS' && queue.length > 0 && (
        <div className="queue-display">
          <span className="queue-label">Queue: </span>
          {queue.map((id, i) => (
            <span key={i} className="queue-node">
              {nodes[id].label}
              {i < queue.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}

      {/* color legend */}
      <div className="legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: NODE_COLORS.start }} />
          <span>Start</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: NODE_COLORS.current }} />
          <span>Current</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: NODE_COLORS.visiting }} />
          <span>Discovered</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: NODE_COLORS.visited }} />
          <span>Visited</span>
        </div>
      </div>

      {/* controls */}
      <div className="gv-controls">

        {/* algorithm */}
        <div className="control-group">
          <label>Algorithm</label>
          <div className="algo-buttons">
            {['BFS', 'DFS'].map((algo) => (
              <button
                key={algo}
                className={`btn-algo ${algorithm === algo ? 'active' : ''}`}
                onClick={() => {
                  if (!isRunning) {
                    setAlgorithm(algo)
                    reset()
                  }
                }}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        {/* start node */}
        <div className="control-group">
          <label>Start Node (click a node on the graph or select here)</label>
          <div className="algo-buttons">
            {nodes.map((node) => (
              <button
                key={node.id}
                className={`btn-algo ${startNode === node.id ? 'active' : ''}`}
                onClick={() => {
                  if (!isRunning) {
                    setStartNode(node.id)
                    reset()
                  }
                }}
              >
                {node.label}
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
            disabled={isRunning}
          />
        </div>

        {/* action buttons */}
        <div className="action-buttons">
          <button
            className="btn-primary"
            onClick={startTraversal}
            disabled={isRunning || isDone}
          >
            {isRunning ? 'Running...' : `Start ${algorithm}`}
          </button>
          <button
            className="btn-generate"
            onClick={reset}
            disabled={isRunning}
          >
            Reset
          </button>
        </div>

      </div>

      {/* info cards */}
      <div className="gv-info">
        <h3>About {algorithm}</h3>
        <div className="info-grid">
          {algorithm === 'BFS' ? (
            <>
              <div className="info-card">
                <h4>How it works</h4>
                <p>Explores all neighbors of current node first before going deeper. Uses a <span>Queue</span>.</p>
              </div>
              <div className="info-card">
                <h4>Time Complexity</h4>
                <p><span>O(V + E)</span> where V = vertices and E = edges.</p>
              </div>
              <div className="info-card">
                <h4>When to use</h4>
                <p>Finding <span>shortest path</span> in unweighted graphs. Level order traversal.</p>
              </div>
            </>
          ) : (
            <>
              <div className="info-card">
                <h4>How it works</h4>
                <p>Goes as deep as possible along each branch before backtracking. Uses a <span>Stack</span> (or recursion).</p>
              </div>
              <div className="info-card">
                <h4>Time Complexity</h4>
                <p><span>O(V + E)</span> where V = vertices and E = edges.</p>
              </div>
              <div className="info-card">
                <h4>When to use</h4>
                <p>Detecting <span>cycles</span>, topological sorting, solving mazes.</p>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  )
}

export default GraphVisualizer