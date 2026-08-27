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
    
    const newPaths = activeArch.connections.map(conn => {
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
        <div className="swiss-block-wide" style={{ position: 'relative', minHeight: '500px', display: 'flex', alignItems: 'stretch', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }} ref={containerRef}>
          
          {/* SVG Overlay for Connections & Live Data Packets */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
            <AnimatePresence>
              {paths.map((path, i) => (
                <g key={`${activeId}-${path.id}`}>
                  {/* Background Track */}
                  <motion.path
                    d={path.d}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut", delay: i * 0.05 }}
                  />
                  
                  {/* Glowing Active Path */}
                  <motion.path
                    d={path.d}
                    fill="none"
                    stroke={path.color}
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0.2, 0.5, 0.2] }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      pathLength: { duration: 1, ease: "easeInOut", delay: i * 0.05 },
                      opacity: { repeat: Infinity, duration: 2 + i, ease: "linear" }
                    }}
                  />

                  {/* Animated Data Packet (Circle traveling along path) */}
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
                </g>
              ))}
            </AnimatePresence>
          </svg>

          {/* HTML Nodes Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${layers.length}, minmax(180px, 1fr))`, gap: '2rem', width: '100%', padding: '2rem', position: 'relative', zIndex: 10 }}>
            {layers.map((layerNodes, lIdx) => (
              <div key={`${activeId}-layer-${lIdx}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3rem' }}>
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
