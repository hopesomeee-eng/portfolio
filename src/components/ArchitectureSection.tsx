import { useRef, useState, useLayoutEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'

interface NodeData {
  id: string
  label: string
  sub?: string
  layer: number
}

interface ConnectionData {
  source: string
  target: string
  color: string
}

const ARCH_NODES: NodeData[] = [
  // Layer 0: Edge
  { id: 'mobile', label: 'Mobile App', sub: 'Flutter', layer: 0 },
  { id: 'web',    label: 'Web Client', sub: 'React', layer: 0 },
  { id: 'cli',    label: 'Agent CLI',  sub: 'Python', layer: 0 },
  
  // Layer 1: Gateway
  { id: 'gw',     label: 'API Gateway', sub: 'Nginx / LB', layer: 1 },

  // Layer 2: Compute
  { id: 'micro',  label: 'Microservices', sub: 'Go / Node', layer: 2 },
  { id: 'ai',     label: 'AI Orchestrator', sub: 'LangChain / MCP', layer: 2 },

  // Layer 3: Data
  { id: 'pg',     label: 'PostgreSQL', sub: 'Relational DB', layer: 3 },
  { id: 'vec',    label: 'Vector DB',  sub: 'Pinecone / Embeddings', layer: 3 },
]

const ARCH_CONNECTIONS: ConnectionData[] = [
  { source: 'mobile', target: 'gw', color: '#3b82f6' },
  { source: 'web',    target: 'gw', color: '#14b8a6' },
  { source: 'cli',    target: 'gw', color: '#f59e0b' },
  
  { source: 'gw',     target: 'micro', color: '#fafafa' },
  { source: 'gw',     target: 'ai',    color: '#a855f7' },
  
  { source: 'micro',  target: 'pg',  color: '#3b82f6' },
  { source: 'ai',     target: 'vec', color: '#f59e0b' },
  { source: 'ai',     target: 'micro', color: '#71717a' }, // Internal comms
]

export function ArchitectureSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '-10%' })
  
  // Store DOM nodes for coordinate math
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [paths, setPaths] = useState<{ id: string, d: string, color: string }[]>([])

  const setNodeRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) {
      nodeRefs.current.set(id, el)
    } else {
      nodeRefs.current.delete(id)
    }
  }, [])

  // The engine that calculates bezier curves between DOM nodes
  const updatePaths = useCallback(() => {
    if (!containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    
    const newPaths = ARCH_CONNECTIONS.map(conn => {
      const sourceEl = nodeRefs.current.get(conn.source)
      const targetEl = nodeRefs.current.get(conn.target)
      
      if (!sourceEl || !targetEl) return null

      const sRect = sourceEl.getBoundingClientRect()
      const tRect = targetEl.getBoundingClientRect()

      // Calculate center points relative to the container
      const startX = sRect.right - containerRect.left
      const startY = sRect.top + sRect.height / 2 - containerRect.top
      
      const endX = tRect.left - containerRect.left
      const endY = tRect.top + tRect.height / 2 - containerRect.top

      // Horizontal distance for control points
      const distance = Math.abs(endX - startX)
      const cpOffset = distance * 0.4

      // Cubic bezier curve path
      const d = `M ${startX} ${startY} C ${startX + cpOffset} ${startY}, ${endX - cpOffset} ${endY}, ${endX} ${endY}`

      return { id: `${conn.source}-${conn.target}`, d, color: conn.color }
    }).filter(Boolean) as { id: string, d: string, color: string }[]

    setPaths(newPaths)
  }, [])

  // Use ResizeObserver for perfect tracking without polling
  useLayoutEffect(() => {
    updatePaths() // Initial calculation

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updatePaths)
    })
    
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    
    // Also observe the window to be safe
    window.addEventListener('resize', updatePaths)
    
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updatePaths)
    }
  }, [updatePaths])

  // Group nodes by layer for layout
  const layers = [0, 1, 2, 3].map(layerIdx => ARCH_NODES.filter(n => n.layer === layerIdx))

  return (
    <section id="architecture" style={{ padding: 'var(--space-section) 0', background: '#09090b', position: 'relative', overflow: 'hidden' }}>
      <div className="swiss-grid">
        <div className="swiss-block-wide" style={{ marginBottom: 'var(--space-element)', textAlign: 'center' }}>
          <motion.p 
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            className="swiss-label"
          >
            03 / SYSTEM ARCHITECTURE
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
            className="swiss-headline" style={{ margin: 0 }}
          >
            The Agentic Topology.
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
             className="swiss-paragraph" style={{ margin: '1rem auto 0', maxWidth: '600px' }}
          >
            Zero hardcoding. This visualization uses a ResizeObserver to mathematically calculate SVG paths between DOM elements in real-time, bridging traditional FANG infrastructure with autonomous AI orchestration.
          </motion.p>
        </div>

        {/* The Interactive Canvas */}
        <div className="swiss-block-wide" style={{ position: 'relative', minHeight: '500px', display: 'flex', alignItems: 'stretch' }} ref={containerRef}>
          
          {/* SVG Overlay for Connections & Live Data Packets */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
            {paths.map((path, i) => (
              <g key={path.id}>
                {/* Background Track */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 + (i * 0.1) }}
                />
                
                {/* Glowing Active Path */}
                <motion.path
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: [0.2, 0.5, 0.2] } : {}}
                  transition={{ 
                    pathLength: { duration: 1.5, ease: "easeInOut", delay: 0.5 + (i * 0.1) },
                    opacity: { repeat: Infinity, duration: 2 + i, ease: "linear" }
                  }}
                />

                {/* Animated Data Packet (Circle traveling along path) */}
                {inView && (
                  <circle r="4" fill={path.color} style={{ filter: `drop-shadow(0 0 6px ${path.color})` }}>
                    <animateMotion 
                      dur={`${2 + Math.random() * 2}s`} 
                      repeatCount="indefinite"
                      path={path.d}
                      keyPoints="0;1"
                      keyTimes="0;1"
                      calcMode="linear"
                    />
                  </circle>
                )}
              </g>
            ))}
          </svg>

          {/* HTML Nodes Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', width: '100%', position: 'relative', zIndex: 10 }}>
            {layers.map((layerNodes, lIdx) => (
              <div key={lIdx} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3rem' }}>
                {layerNodes.map((node, nIdx) => (
                  <motion.div
                    key={node.id}
                    ref={setNodeRef(node.id)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: 'spring', damping: 20, delay: 0.8 + (lIdx * 0.1) + (nIdx * 0.05) }}
                    style={{
                      background: 'rgba(9,9,11,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '1.25rem 1rem',
                      backdropFilter: 'blur(12px)',
                      textAlign: 'center',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                      position: 'relative'
                    }}
                    whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fafafa', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                      {node.label}
                    </div>
                    {node.sub && (
                      <div style={{ fontSize: '10px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {node.sub}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
