/**
 * ProjectsSection.tsx — Swiss Minimalist Project List
 * 
 * Replaces the grid of cards with a brutal, full-width list.
 * Features an Awwwards-style hover interaction where rows expand or
 * highlight subtly without boxes.
 */
import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ProjectsConfig } from '../config/ProjectsConfig'

// Keep the existing CaseStudy modal but remove the boxy borders
function CaseStudy({ project, onClose }: { project: typeof ProjectsConfig.projects[0]; onClose: () => void }) {
  const sections = [
    { label: 'The Problem',    content: project.story.problem },
    { label: 'Research',       content: project.story.research },
    { label: 'Tech Choice',    content: project.story.techChoice },
    { label: 'Architecture',   content: project.story.architecture },
    { label: 'Key Challenge',  content: project.story.challenge },
    { label: 'Testing',        content: project.story.testing },
    { label: 'Deployment',     content: project.story.deploy },
    { label: 'Impact',         content: project.story.impact },
  ]

  useEffect(() => {
    // Lock background scrolling natively as a fallback
    document.body.style.overflow = 'hidden'
    // Also explicitly stop Lenis from updating if it exists
    if ((window as any).lenis) {
      (window as any).lenis.stop()
    }
    
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    
    return () => { 
      document.body.style.overflow = ''
      if ((window as any).lenis) {
        (window as any).lenis.start()
      }
      window.removeEventListener('keydown', onKey) 
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: '#09090b', // Pure solid void background for modal, no glass
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
      }}
      onClick={onClose}
    >
      <motion.div
        className="mobile-bottom-sheet"
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        data-lenis-prevent="true"
        style={{
          background: '#09090b',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <div className="swiss-label" style={{ marginBottom: '1rem', color: project.color }}>
              {project.id} — CASE STUDY
            </div>
            <h2 className="swiss-headline" style={{ margin: 0, fontSize: 'var(--text-h1)' }}>{project.title}</h2>
          </div>
          <button onClick={onClose} data-cursor="link" style={{ background: 'transparent', border: 'none', color: '#fafafa', fontSize: '24px', cursor: 'none', padding: '1rem' }}>
            ✕
          </button>
        </div>

        {/* Hook */}
        <div style={{ fontSize: '18px', color: '#f59e0b', fontStyle: 'italic', marginBottom: '3rem', borderLeft: `2px solid ${project.color}`, paddingLeft: '1.5rem' }}>
          "{project.tagline}"
        </div>

        {/* Story sections */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          {sections.map(({ label, content }) => (
            <div key={label}>
              <div style={{ fontSize: '10px', color: project.color, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>{label}</div>
              <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.8, margin: 0 }}>{content}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ProjectsSection() {
  const [open, setOpen] = useState<typeof ProjectsConfig.projects[0] | null>(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })

  return (
    <>
      <section id="projects" style={{ padding: '15vh 0', background: '#09090b', position: 'relative', zIndex: 10 }}>
        <div className="swiss-grid" ref={ref}>
          
          <div className="swiss-block-wide">
            <motion.h2
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', damping: 20, stiffness: 70 }}
              className="swiss-label"
            >
              {ProjectsConfig.label}
            </motion.h2>
          </div>

          <div className="swiss-block-wide" style={{ display: 'flex', flexDirection: 'column' }}>
            {ProjectsConfig.projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, type: 'spring', damping: 20, stiffness: 70 }}
                onClick={() => setOpen(project)}
                data-cursor="project"
                className="projects-row"
                style={{
                  padding: '3rem 0',
                  borderTop: '1px solid #27272a',
                  borderBottom: i === ProjectsConfig.projects.length - 1 ? '1px solid #27272a' : 'none',
                  cursor: 'none',
                  transition: 'background 0.3s, padding 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                  e.currentTarget.style.paddingLeft = '2rem'
                  e.currentTarget.style.paddingRight = '2rem'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.paddingLeft = '0'
                  e.currentTarget.style.paddingRight = '0'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#71717a' }}>{project.id}</div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: 'var(--text-h2)', fontWeight: 800, color: '#fafafa', textTransform: 'uppercase', margin: 0, letterSpacing: '-0.03em' }}>
                    {project.title}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {project.category}
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <div style={{ fontSize: '12px', color: project.color }}>{project.metric}</div>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: project.color }} />
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      <AnimatePresence>
        {open && <CaseStudy project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </>
  )
}
