import { useRef, useState, useLayoutEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ARCHITECTURES } from '../data/architectures'

// Simple Markdown Parser for the articles
const parseMarkdownToHTML = (text: string) => {
  let html = text
    .replace(/### (.*?)\n/g, '<h3 style="color: #fafafa; margin-top: 2rem; margin-bottom: 0.75rem; font-size: 18px; letter-spacing: -0.02em;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fafafa;">$1</strong>')
    .replace(/\`(.*?)\`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 5px; border-radius: 4px; color: #f59e0b; font-size: 13px;">$1</code>')
    .replace(/\n- (.*?)(?=\n|$)/g, '<li style="color: #a1a1aa; margin-left: 1.5rem; margin-bottom: 0.5rem; line-height: 1.6;">$1</li>')
    .replace(/\n\n/g, '<div style="height: 1rem;"></div>')
  
  return html
}

export function ArchitectureSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '-10%' })
  
  const [activeId, setActiveId] = useState(ARCHITECTURES[0].id)
  const activeArch = ARCHITECTURES.find(a => a.id === activeId) || ARCHITECTURES[0]
  
  // Store DOM nodes for coordinate math
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map())

  const setNodeRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) {
      nodeRefs.current.set(id, el)
    } else {
      nodeRefs.current.delete(id)
    }
  }, [])

  const setPathRef = useCallback((id: string) => (el: SVGPathElement | null) => {
    if (el) {
      pathRefs.current.set(id, el)
    } else {
      pathRefs.current.delete(id)
    }
  }, [])

  // The engine that calculates bezier curves between DOM nodes
  const updatePaths = useCallback(() => {
    if (!containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    
    const newPaths = activeArch.connections.map(conn => {
      const sourceEl = nodeRefs.current.get(conn.source)
      const targetEl = nodeRefs.current.get(conn.target)
      
      if (!sourceEl || !targetEl) return null

      const sRect = sourceEl.getBoundingClientRect()
      const tRect = targetEl.getBoundingClientRect()

      // Determine structural relationship
      const isBackwards = sRect.left > tRect.right
      const isSameColumn = Math.abs(sRect.left - tRect.left) < 50

      let startX, startY, endX, endY, d;

      if (isSameColumn) {
        // Vertical connection (e.g., node to node in same column)
        const isBelow = tRect.top > sRect.bottom
        startX = sRect.left + sRect.width / 2 - containerRect.left
        startY = (isBelow ? sRect.bottom : sRect.top) - containerRect.top
        
        endX = tRect.left + tRect.width / 2 - containerRect.left
        endY = (isBelow ? tRect.top : tRect.bottom) - containerRect.top

        const distanceY = Math.abs(endY - startY)
        const cpOffset = distanceY * 0.4
        const dir = isBelow ? 1 : -1

        d = `M ${startX} ${startY} C ${startX} ${startY + cpOffset * dir}, ${endX} ${endY - cpOffset * dir}, ${endX} ${endY}`
      } else if (isBackwards) {
        // Feedback loop (goes out bottom, loops under, comes in bottom)
        startX = sRect.left + sRect.width / 2 - containerRect.left
        startY = sRect.bottom - containerRect.top
        
        endX = tRect.left + tRect.width / 2 - containerRect.left
        endY = tRect.bottom - containerRect.top

        const distanceX = Math.abs(startX - endX)
        const cpOffsetY = Math.max(80, distanceX * 0.25) // Drop down significantly
        
        d = `M ${startX} ${startY} C ${startX} ${startY + cpOffsetY}, ${endX} ${endY + cpOffsetY}, ${endX} ${endY}`
      } else {
        // Normal left-to-right connection
        startX = sRect.right - containerRect.left
        startY = sRect.top + sRect.height / 2 - containerRect.top
        
        endX = tRect.left - containerRect.left
        endY = tRect.top + tRect.height / 2 - containerRect.top

        const distanceX = Math.abs(endX - startX)
        const cpOffset = distanceX * 0.4

        d = `M ${startX} ${startY} C ${startX + cpOffset} ${startY}, ${endX - cpOffset} ${endY}, ${endX} ${endY}`
      }

      // 60FPS Direct DOM Mutation (Zero-cost, bypasses React)
      const connId = `${conn.source}-${conn.target}`
      const bgPath = pathRefs.current.get(`bg-${connId}`)
      const fgPath = pathRefs.current.get(`fg-${connId}`)
      
      if (bgPath) bgPath.setAttribute('d', d)
      if (fgPath) fgPath.setAttribute('d', d)
    })
  }, [activeArch])

  // Use ResizeObserver and a high-frequency tracking loop for perfect SVG syncing
  useLayoutEffect(() => {
    let animationFrameId: number
    const startTime = performance.now()

    // High-frequency loop to perfectly track framer-motion CSS transform animations
    const trackAnimation = (time: number) => {
      updatePaths()
      
      // Run at 60FPS for 1.5s (duration of the spring entry/exit animation)
      if (time - startTime < 1500) {
        animationFrameId = requestAnimationFrame(trackAnimation)
      }
    }

    animationFrameId = requestAnimationFrame(trackAnimation)

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updatePaths)
    })
    
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    
    window.addEventListener('resize', updatePaths)
    
    return () => {
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
      window.removeEventListener('resize', updatePaths)
    }
  }, [updatePaths, activeId])

  // Group nodes by layer for layout
  const maxLayer = Math.max(...activeArch.nodes.map(n => n.layer))
  const layers = Array.from({ length: maxLayer + 1 }).map((_, layerIdx) => 
    activeArch.nodes.filter(n => n.layer === layerIdx)
  )

  return (
    <section id="architecture" style={{ padding: 'var(--space-section) 0', background: '#09090b', position: 'relative', overflow: 'hidden' }}>
      <div className="swiss-grid">
        
        {/* Section Header */}
        <div className="swiss-block-wide" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <motion.p 
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            className="swiss-label"
          >
            03 / SYSTEM ARCHITECTURE
          </motion.p>
        </div>

        {/* The Tabs / Selector */}
        <div className="swiss-block-wide" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 'var(--space-element)' }}>
          {ARCHITECTURES.map(arch => {
            const isActive = arch.id === activeId
            return (
              <button
                key={arch.id}
                onClick={() => setActiveId(arch.id)}
                data-cursor="link"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '100px',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                  background: isActive ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.02)',
                  color: isActive ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {arch.title}
              </button>
            )
          })}
        </div>

        {/* Dynamic Title */}
        <div className="swiss-block-wide" style={{ textAlign: 'center', marginBottom: '3rem', minHeight: '120px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="swiss-headline" style={{ margin: 0 }}>
                {activeArch.headline}
              </h2>
              <p className="swiss-paragraph" style={{ margin: '1rem auto 0', maxWidth: '600px' }}>
                {activeArch.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* The Interactive Canvas */}
        <div className="swiss-block-wide" style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          
          {/* Scrollable Viewport for Mobile */}
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
             
             {/* The Actual Canvas Grid (Expands to fit content) */}
             <div ref={containerRef} style={{ position: 'relative', minHeight: '500px', minWidth: `${Math.max(100, layers.length * 280)}px`, display: 'flex', alignItems: 'stretch', margin: 0, padding: 0 }}>
               
               {/* SVG Overlay for Connections & Live Data Packets */}
               <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'visible' }}>
            <AnimatePresence>
              {activeArch.connections.map((conn, i) => {
                const connId = `${conn.source}-${conn.target}`
                return (
                  <motion.g 
                    key={`${activeId}-${connId}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Background Track */}
                    <motion.path
                      id={`path-${activeId}-${connId}`}
                      ref={setPathRef(`bg-${connId}`)}
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, ease: "easeInOut", delay: i * 0.05 }}
                    />
                    
                    {/* Glowing Active Path */}
                    <motion.path
                      ref={setPathRef(`fg-${connId}`)}
                      fill="none"
                      stroke={conn.color}
                      strokeWidth="2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: [0.2, 0.5, 0.2] }}
                      transition={{ 
                        pathLength: { duration: 1, ease: "easeInOut", delay: i * 0.05 },
                        opacity: { repeat: Infinity, duration: 2 + i, ease: "linear" }
                      }}
                    />

                    {/* Animated Data Packet (Circle traveling along path) */}
                    <circle r="4" fill={conn.color} style={{ filter: `drop-shadow(0 0 6px ${conn.color})` }}>
                      <animateMotion 
                        dur={`${2 + Math.random() * 2}s`} 
                        repeatCount="indefinite"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                      >
                        <mpath href={`#path-${activeId}-${connId}`} />
                      </animateMotion>
                    </circle>
                  </motion.g>
                )
              })}
            </AnimatePresence>
          </svg>

          {/* HTML Nodes Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${layers.length}, minmax(240px, 1fr))`, gap: '3rem', width: '100%', padding: '3rem 2rem', position: 'relative', zIndex: 10 }}>
            {layers.map((layerNodes, lIdx) => (
              <div key={`layer-${lIdx}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3rem' }}>
                <AnimatePresence mode="popLayout">
                  {layerNodes.map((node, nIdx) => (
                    <motion.div
                      key={`${activeId}-node-${node.id}`}
                      layout
                      ref={setNodeRef(node.id)}
                      initial={{ opacity: 0, scale: 0.8, x: -20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 20 }}
                      transition={{ type: 'spring', damping: 20, delay: (lIdx * 0.1) + (nIdx * 0.05) }}
                      style={{
                        background: 'rgba(9,9,11,0.95)',
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
                </AnimatePresence>
              </div>
            ))}
          </div>
          
        </div>
      </div>
      </div>

        {/* The In-Depth Planning Article */}
        <div className="swiss-block-wide" style={{ marginTop: '4rem', padding: '0 1rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{
                color: '#a1a1aa',
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.7,
                fontSize: '15px'
              }}
              dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(activeArch.article) }}
            />
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
