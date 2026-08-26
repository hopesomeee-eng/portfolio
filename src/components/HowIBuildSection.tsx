/**
 * HowIBuildSection.tsx — The Sticky Neural Thread Journey
 * 
 * Replaces the grid of static cards with a scrollytelling journey.
 * The left side pins in place. The right side drops in each step 
 * using heavy, tactile spring physics (abstracting the "hanging card" concept).
 */
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { HowIBuildConfig } from '../config/HowIBuildConfig'
import { ProofModal } from './ProofModal'

// The physics that simulate a heavy card dropping onto a nail
const hangingCardPhysics = {
  type: "spring" as const,
  mass: 2,
  damping: 12,
  stiffness: 60,
  restDelta: 0.001
}

function JourneyStep({ step, onClick }: { step: typeof HowIBuildConfig.steps[0], onClick: () => void }) {
  const ref = useRef(null)
  // When the step reaches 40% up from the bottom of the viewport, it "drops" in
  const inView = useInView(ref, { once: true, margin: '-40% 0px -10% 0px' })

  return (
    <div ref={ref} style={{ minHeight: '40vh', display: 'flex', alignItems: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 150, rotateX: -20 }}
        animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
        transition={{ ...hangingCardPhysics }}
        onClick={onClick}
        style={{
          padding: '2rem 0',
          borderTop: '1px solid #27272a',
          width: '100%',
          perspective: '1000px',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: 'var(--text-hero)', fontWeight: 900, color: step.color, lineHeight: 0.8, letterSpacing: '-0.05em' }}>
            {step.num}
          </span>
          <h3 style={{ fontSize: 'var(--text-h2)', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
            {step.title}
          </h3>
        </div>

        <p style={{ fontSize: 'var(--text-body)', color: '#a1a1aa', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '600px' }}>
          {step.desc}
        </p>

        <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          View Real World Execution ↗
        </div>
      </motion.div>
    </div>
  )
}

export function HowIBuildSection() {
  const containerRef = useRef(null)
  const [activeStep, setActiveStep] = useState<typeof HowIBuildConfig.steps[0] | null>(null)
  
  return (
    <section id="how-i-build" style={{ padding: '15vh 0', background: '#09090b', position: 'relative' }}>
      <div className="swiss-grid" ref={containerRef}>
        {/* Left Column (Sticky) */}
        <div className="swiss-split-left" style={{ position: 'sticky', top: '25vh', alignSelf: 'start', paddingBottom: '10vh', willChange: 'transform' }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 20 }}
            className="swiss-label"
          >
            {HowIBuildConfig.label}
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 20, delay: 0.1 }}
            className="swiss-headline"
            style={{ marginBottom: '2rem' }}
          >
            {HowIBuildConfig.headline}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 20, delay: 0.2 }}
            className="swiss-paragraph"
            style={{ maxWidth: '400px', marginBottom: '1.5rem' }}
          >
            {HowIBuildConfig.subheadline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 20, delay: 0.3 }}
            className="swiss-paragraph"
            style={{ maxWidth: '400px', marginBottom: '2rem' }}
          >
            {HowIBuildConfig.paragraph3}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 20, delay: 0.4 }}
            style={{ 
              maxWidth: '400px', 
              paddingLeft: '1.5rem', 
              borderLeft: '2px solid #f59e0b',
              fontSize: '14px',
              color: '#f59e0b',
              fontStyle: 'italic',
              lineHeight: 1.6,
              fontWeight: 500
            }}
          >
            {HowIBuildConfig.paragraph4}
          </motion.div>
        </div>

        {/* Right Column: The Journey Pipeline */}
        <div className="swiss-split-right">
          {/* Subtle vertical thread connecting the journey behind the items */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'rgba(255,255,255,0.03)', zIndex: 0, pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            {HowIBuildConfig.steps.map((step) => (
              <JourneyStep key={step.num} step={step} onClick={() => setActiveStep(step)} />
            ))}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {activeStep && (
          <ProofModal
            title={activeStep.title}
            subtitle={`${activeStep.num} / REAL WORLD OUTPUT`}
            onClose={() => setActiveStep(null)}
            content={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ fontSize: 'var(--text-body)', color: '#a1a1aa', fontStyle: 'italic', borderLeft: `2px solid ${activeStep.color}`, paddingLeft: '1.5rem' }}>
                  "{activeStep.example}"
                </p>
                <div style={{ marginTop: '2rem' }}>
                  <div style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                    Process Objective
                  </div>
                  <p style={{ fontSize: '14px', color: '#fafafa', lineHeight: 1.6 }}>
                    {activeStep.desc}
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
