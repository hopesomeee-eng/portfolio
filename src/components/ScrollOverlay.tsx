/**
 * ScrollOverlay.tsx — Swiss Minimalist Hero Typography
 *
 * Implements massive, uncluttered, rigid typography driven by HeroConfig.
 * Eliminates the constrained "card" look in favor of a full-bleed text treatment.
 */
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { HeroConfig } from '../config/HeroConfig'

interface ScrollOverlayProps {
  isLoaded: boolean
}

const containerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }
}

const itemVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
    },
  },
}

export function ScrollOverlay({ isLoaded }: Pick<ScrollOverlayProps, 'isLoaded'>) {
  const { typography, layout } = HeroConfig

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: layout.alignment === 'center' ? 'center' : 'flex-start',
            padding: layout.alignment === 'center' ? '0' : '0 10vw',
            zIndex: 20,
            pointerEvents: 'none', // Let mouse pass through to fluid shader
            textAlign: layout.alignment === 'center' ? 'center' : 'left',
          }}
        >
          {/* Eyebrow */}
          <motion.p variants={itemVariant} style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.25em',
            color: '#f59e0b',
            textTransform: 'uppercase',
            marginBottom: '2rem',
          }}>
            {typography.subtitle}
          </motion.p>
          
          {/* Massive Title */}
          <motion.h1 variants={itemVariant} style={{
            fontSize: 'var(--text-hero)',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 0.85,
            color: '#fafafa',
            margin: '0 0 3rem 0',
            whiteSpace: 'pre-line',
            textTransform: 'uppercase',
            mixBlendMode: 'difference' // Interacts beautifully with the fluid
          }}>
            {typography.title}
          </motion.h1>

          {/* Tagline */}
          {(typography as any).tagline && (
            <motion.p variants={itemVariant} style={{
              fontSize: '15px',
              fontWeight: 400,
              color: '#a1a1aa',
              marginBottom: '4rem',
              maxWidth: '550px',
              lineHeight: 1.7,
              letterSpacing: '0.02em',
              fontStyle: 'italic',
              borderLeft: '2px solid var(--accent)',
              paddingLeft: '1.25rem'
            }}>
              "{(typography as any).tagline}"
            </motion.p>
          )}

          {/* Stats Grid */}
          <motion.div variants={itemVariant} style={{
            display: 'flex',
            gap: '3rem',
            marginBottom: '3rem',
          }}>
            {typography.stats.map((stat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: layout.alignment === 'center' ? 'center' : 'flex-start' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#f0f6fc' }}>{stat.value}</span>
                <span style={{ fontSize: '10px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemVariant} style={{ display: 'flex', gap: '1rem', pointerEvents: 'auto' }}>
            {typography.ctas.map((cta, i) => (
              <a
                key={i}
                href={cta.href}
                data-cursor={cta.primary ? "cta" : "link"}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '2px', // Brutal/Swiss square corners
                  background: cta.primary ? '#fafafa' : 'transparent',
                  color: cta.primary ? '#09090b' : '#fafafa',
                  border: cta.primary ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (!cta.primary) {
                    e.currentTarget.style.borderColor = '#fafafa'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  } else {
                    e.currentTarget.style.opacity = '0.9'
                  }
                }}
                onMouseLeave={e => {
                  if (!cta.primary) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.background = 'transparent'
                  } else {
                    e.currentTarget.style.opacity = '1'
                  }
                }}
              >
                {cta.label}
              </a>
            ))}
          </motion.div>

          {/* Scroll Hint */}
          {layout.showScrollHint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              transition={{
                opacity: { delay: 2, duration: 1 },
                y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
              }}
              style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              <span>Scroll</span>
              <span style={{ fontSize: '16px', lineHeight: 1, color: '#f59e0b' }}>↓</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
