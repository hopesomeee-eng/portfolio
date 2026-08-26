/**
 * AboutSection.tsx — Swiss Minimalist Philosophy & Experience
 *
 * Implements the Asymmetric Layout. Left side anchors the massive typography.
 * Right side implements the "Hanging Card Stack" timeline, simulating
 * tactile physics to fill the spatial void.
 */
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { AboutConfig } from '../config/AboutConfig'
import { ProofModal } from './ProofModal'

// The heavy physics for the tactile timeline cards
const hangingCardPhysics = {
  type: "spring" as const,
  mass: 2,
  damping: 12,
  stiffness: 60,
  restDelta: 0.001
}

function TimelineCard({ role, index, onClick }: { role: typeof AboutConfig.timeline[0]; index: number; onClick: () => void }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })

  // Static expanded layout
  const yOffset = index * 120
  const zIndex = 10 - index

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ ...hangingCardPhysics, delay: 0.3 + (index * 0.1) }}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: yOffset,
        left: '20px', // Space for the wire and dot
        right: 0,
        zIndex,
        background: '#09090b',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '1.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
      onMouseLeave={e => e.currentTarget.style.background = '#09090b'}
    >
      {/* Connected Dot Node */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '-26px', // Align with the wire
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#f59e0b',
        border: '2px solid #09090b',
        boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
      }} />

      <div style={{ fontSize: '10px', color: '#f59e0b', letterSpacing: '0.15em', marginBottom: '4px' }}>{role.year}</div>
      <div style={{ fontSize: '16px', fontWeight: 700, color: '#fafafa', marginBottom: '4px' }}>{role.title}</div>
      <div style={{ fontSize: '13px', color: '#a1a1aa' }}>{role.desc}</div>
    </motion.div>
  )
}

export function AboutSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const [activeEra, setActiveEra] = useState<typeof AboutConfig.timeline[0] | null>(null)

  return (
    <section id="about" style={{ padding: '20vh 0 10vh 0', background: '#09090b', position: 'relative', zIndex: 10 }}>
      <div className="swiss-grid" ref={ref}>
        
        {/* Left Column: Massive Philosophy Statement (Cols 1-7 on desktop) */}
        <div className="swiss-phil-left">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ ...hangingCardPhysics, delay: 0.1 }}
          >
            <h2 className="swiss-label" style={{ marginBottom: '2rem' }}>{AboutConfig.label}</h2>
            <h3 className="swiss-headline" style={{ fontSize: 'var(--text-h1)', lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '3rem' }}>
              {AboutConfig.heading}
            </h3>
          </motion.div>
          
          <div style={{ maxWidth: '600px' }}>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...hangingCardPhysics, delay: 0.2 }}
              className="swiss-paragraph"
            >
              {AboutConfig.paragraph1}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...hangingCardPhysics, delay: 0.3 }}
              className="swiss-paragraph"
            >
              {AboutConfig.paragraph2}
            </motion.p>
          </div>
        </div>

        {/* Right Column: The Tactile Timeline Stack (Cols 8-13 on desktop) */}
        <div 
          className="swiss-phil-right"
          style={{ marginTop: '4rem', position: 'relative' }}
        >
          <motion.h4
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="swiss-label"
            style={{ marginBottom: '1.5rem', color: '#71717a' }}
          >
            TIMELINE
          </motion.h4>
          
          <div style={{ position: 'relative', height: '400px' }}>
            {/* The Neural Wire */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            
            {AboutConfig.timeline.map((role, i) => (
              <TimelineCard key={i} role={role} index={i} onClick={() => setActiveEra(role)} />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeEra && (
          <ProofModal
            title={activeEra.title}
            subtitle={activeEra.year}
            onClose={() => setActiveEra(null)}
            content={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ fontSize: '18px', color: '#fafafa', fontWeight: 600, letterSpacing: '-0.02em' }}>
                  {activeEra.desc}
                </p>
                <div style={{ marginTop: '2rem' }}>
                  <div style={{ fontSize: '10px', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                    Historical Context
                  </div>
                  <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.6 }}>
                    During this era, the focus was entirely on mastering the core principles of software architecture, pushing performance boundaries, and establishing the engineering baseline that powers current FANG-level projects.
                  </p>
                </div>
              </div>
            }
          />
        )}
      </AnimatePresence>
    </section>
  )
}
