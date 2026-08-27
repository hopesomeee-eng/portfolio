import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { usePortfolioStore } from '../store'

export function ResumeViewer() {
  const { isResumeOpen, setResumeOpen } = usePortfolioStore()

  // Lock scrolling on the main page when resume is open
  useEffect(() => {
    if (isResumeOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isResumeOpen])

  return (
    <AnimatePresence>
      {isResumeOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#09090b', // match portfolio background
            zIndex: 999999, // Ensure it's above everything including CursorGlow
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Action Bar */}
          <div style={{
            height: '80px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 2rem',
            background: 'rgba(9,9,11,0.8)',
            backdropFilter: 'blur(10px)',
          }}>
            <button
              onClick={() => setResumeOpen(false)}
              data-cursor="link"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fafafa',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ← BACK TO APP
            </button>

            <a
              href="/resume.pdf"
              download="Sushant_Kumar_Resume.pdf"
              data-cursor="cta"
              style={{
                background: '#f59e0b',
                color: '#09090b',
                textDecoration: 'none',
                padding: '12px 24px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              DOWNLOAD PDF
            </a>
          </div>

          {/* PDF Viewer Area */}
          <div style={{ flex: 1, width: '100%', height: '100%', background: '#18181b', position: 'relative' }}>
            <object 
              data="/resume.pdf" 
              type="application/pdf" 
              width="100%" 
              height="100%"
              style={{ border: 'none' }}
            >
              <div style={{ padding: '2rem', textAlign: 'center', color: '#a1a1aa' }}>
                <p>Your browser doesn't support built-in PDF rendering.</p>
                <a href="/resume.pdf" download style={{ color: '#f59e0b', fontWeight: 600 }}>Download the PDF instead.</a>
              </div>
            </object>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
