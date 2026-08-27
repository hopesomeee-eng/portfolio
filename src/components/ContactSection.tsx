/**
 * ContactSection.tsx — The Brutal Close
 * 
 * Reverses the void palette (white background, black text) to 
 * jolt the user and draw ultimate attention to the email CTA.
 */
import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

export function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('sushantkumar1807@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="contact" style={{ padding: 'calc(var(--space-section) * 1.5) 0', background: '#09090b', position: 'relative' }}>
      <div className="global-spine" style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'rgba(255,255,255,0.03)', zIndex: 0, pointerEvents: 'none' }} />
      <div className="swiss-grid" ref={ref}>
        <div className="swiss-block-wide" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', damping: 20, stiffness: 70 }}
            style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 'var(--space-element)', color: '#f59e0b' }}
          >
            06 / LET'S BUILD SOMETHING
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, type: 'spring', damping: 20, stiffness: 70 }}
            onClick={copyEmail}
            data-cursor="cta"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              fontSize: 'var(--text-mega)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              color: '#fafafa',
              textDecoration: 'none',
              position: 'relative',
              display: 'inline-block',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              cursor: 'none'
            }}
            onMouseEnter={e => {
              const span = e.currentTarget.querySelector('.underline') as HTMLElement
              if (span) span.style.transform = 'scaleX(1)'
            }}
            onMouseLeave={e => {
              const span = e.currentTarget.querySelector('.underline') as HTMLElement
              if (span) span.style.transform = 'scaleX(0)'
            }}
          >
            {copied ? 'COPIED TO CLIPBOARD' : 'SUSHANTKUMAR1807@GMAIL.COM'}
            <span
              className="underline"
              style={{
                position: 'absolute',
                bottom: '-10px',
                left: 0,
                width: '100%',
                height: '8px',
                background: '#f59e0b',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            />
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <div 
              className="contact-socials"
              style={{ marginTop: 'var(--space-section)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b', textDecoration: 'none', minHeight: 'var(--tap-target-min)', display: 'flex', alignItems: 'center' }} data-cursor="link">Resume</a>
              <a href="https://github.com/sushantkumar1807" target="_blank" rel="noopener noreferrer" style={{ color: '#fafafa', textDecoration: 'none', minHeight: 'var(--tap-target-min)', display: 'flex', alignItems: 'center' }} data-cursor="link">GitHub</a>
              <a href="https://www.linkedin.com/in/connect-with-sushant/" target="_blank" rel="noopener noreferrer" style={{ color: '#fafafa', textDecoration: 'none', minHeight: 'var(--tap-target-min)', display: 'flex', alignItems: 'center' }} data-cursor="link">LinkedIn</a>
              <a href="https://medium.com/@sushantkumar1807" target="_blank" rel="noopener noreferrer" style={{ color: '#fafafa', textDecoration: 'none', minHeight: 'var(--tap-target-min)', display: 'flex', alignItems: 'center' }} data-cursor="link">Medium</a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
