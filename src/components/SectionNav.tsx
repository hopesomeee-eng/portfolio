/**
 * SectionNav.tsx
 *
 * Fixed right-side navigation dots showing which of the 5 acts is active.
 * - Active dot: filled amber, expands, shows label
 * - Inactive: small white circle
 * - Click: smooth-scrolls to that section
 *
 * Also renders the top scroll progress bar (amber → teal gradient).
 */
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SECTIONS = [
  { id: 'act-1', label: 'Hero',       color: '#f59e0b' },
  { id: 'act-2', label: 'Constraint', color: '#3b82f6' },
  { id: 'act-3', label: 'Stack',      color: '#14b8a6' },
  { id: 'act-4', label: 'Work',       color: '#a855f7' },
  { id: 'act-5', label: 'Drive',      color: '#f97316' },
]

export function SectionNav() {
  const [active, setActive]     = useState(0)
  const [progress, setProgress] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const scrollY  = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const p = maxScroll > 0 ? scrollY / maxScroll : 0
      setProgress(p)

      // Which act are we in?  (600vh / 5 = 120vh per act)
      const actHeight = document.documentElement.scrollHeight / 5
      const idx = Math.min(4, Math.floor(scrollY / actHeight))
      setActive(idx)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (idx: number) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    const target = (totalHeight / 5) * idx
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <>
      {/* ── Top progress bar ── */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #f59e0b, #14b8a6)',
          zIndex: 100,
          transformOrigin: 'left',
          scaleX: progress,
          width: '100%',
        }}
        initial={{ scaleX: 0 }}
      />

      {/* ── Section dots (right sidebar) ── */}
      <nav
        className="section-nav"
        aria-label="Section navigation"
        style={{
          position: 'fixed',
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'flex-end',
        }}
      >
        {SECTIONS.map((section, idx) => {
          const isActive  = active === idx
          const isHovered = hoveredIdx === idx

          return (
            <button
              key={section.id}
              onClick={() => scrollTo(idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              aria-label={`Go to ${section.label}`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {/* Label — shows on hover or active */}
              <AnimatePresence>
                {(isActive || isHovered) && (
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      color: section.color,
                      textTransform: 'uppercase',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {section.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Dot */}
              <motion.div
                animate={{
                  width:  isActive ? 10 : 6,
                  height: isActive ? 10 : 6,
                  background: isActive ? section.color : 'rgba(255,255,255,0.25)',
                  boxShadow: isActive ? `0 0 12px ${section.color}` : 'none',
                }}
                transition={{ duration: 0.25 }}
                style={{
                  borderRadius: '50%',
                  flexShrink: 0,
                  border: isActive ? `1.5px solid ${section.color}` : '1.5px solid rgba(255,255,255,0.2)',
                }}
              />
            </button>
          )
        })}
      </nav>
    </>
  )
}
