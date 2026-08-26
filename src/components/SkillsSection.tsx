/**
 * SkillsSection.tsx — The Technical Matrix
 * 
 * Replaces the infinite marquee with a highly readable, typography-first 
 * CSS grid categorizing the tech stack.
 */
import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { SkillsConfig } from '../config/SkillsConfig'
import { ProjectsConfig } from '../config/ProjectsConfig'
import { ProofModal } from './ProofModal'

export function SkillsSection() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })

  // Find projects that use this skill (case-insensitive check against categories or title/tagline)
  const getProjectsForSkill = (skill: string) => {
    return ProjectsConfig.projects.filter(p => 
      p.category.toLowerCase().includes(skill.toLowerCase()) || 
      p.title.toLowerCase().includes(skill.toLowerCase()) ||
      p.tagline.toLowerCase().includes(skill.toLowerCase())
    )
  }

  return (
    <section id="skills" style={{ padding: '15vh 0', background: '#09090b', position: 'relative', zIndex: 10 }}>
      <div className="swiss-grid" ref={ref}>
        
        {/* Header */}
        <div className="swiss-block-wide" style={{ marginBottom: '4rem' }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            className="swiss-label"
          >
            {SkillsConfig.label}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
            className="swiss-headline"
            style={{ margin: 0 }}
          >
            {SkillsConfig.headline}
          </motion.h2>
        </div>

        {/* The Matrix */}
        <div className="swiss-block-wide mobile-snap-scroll">
          {SkillsConfig.categories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + (i * 0.1), type: 'spring', damping: 20 }}
            >
              <h3 style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#f59e0b',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '0.75rem'
              }}>
                {category.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {category.skills.map(skill => (
                  <li 
                    key={skill} 
                    onClick={() => setActiveSkill(skill)}
                    style={{
                      fontSize: '15px',
                      color: '#fafafa',
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f59e0b'}
                    onMouseLeave={e => e.currentTarget.style.color = '#fafafa'}
                  >
                    {skill} ↗
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
      </div>

      <AnimatePresence>
        {activeSkill && (
          <ProofModal
            title={activeSkill}
            subtitle="PROOF OF WORK"
            onClose={() => setActiveSkill(null)}
            content={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ fontSize: 'var(--text-body)', color: '#a1a1aa' }}>
                  Real-world application and deployment of {activeSkill} across production systems.
                </p>
                {getProjectsForSkill(activeSkill).length > 0 ? (
                  getProjectsForSkill(activeSkill).map(p => (
                    <div key={p.id} style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                      <div style={{ fontSize: '10px', color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{p.id}</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#fafafa', marginBottom: '0.25rem' }}>{p.title}</div>
                      <div style={{ fontSize: '13px', color: '#71717a' }}>{p.tagline}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', fontStyle: 'italic', color: '#71717a' }}>
                    Used extensively in internal tools and proprietary systems.
                  </div>
                )}
              </div>
            }
          />
        )}
      </AnimatePresence>
    </section>
  )
}
