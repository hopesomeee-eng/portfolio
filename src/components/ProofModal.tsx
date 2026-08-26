import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface ProofModalProps {
  title: string
  subtitle: string
  content: React.ReactNode
  onClose: () => void
}

export function ProofModal({ title, subtitle, content, onClose }: ProofModalProps) {
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
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <div className="swiss-label" style={{ marginBottom: '1rem' }}>
              {subtitle}
            </div>
            <h2 className="swiss-headline" style={{ margin: 0, fontSize: 'var(--text-h2)' }}>{title}</h2>
          </div>
          <button onClick={onClose} data-cursor="link" style={{ background: 'transparent', border: 'none', color: '#fafafa', fontSize: '24px', cursor: 'none', padding: '1rem' }}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div>
          {content}
        </div>
      </motion.div>
    </motion.div>
  )
}
