/**
 * NavBar.tsx
 *
 * Fixed top navigation — dark frosted glass.
 * Highlights active section based on scroll.
 * Smooth-scrolls to section on click.
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const LINKS = [
  { label: 'About',    href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Blog',     href: '#blog' },
  { label: 'Contact',  href: '#contact' },
]

export function NavBar() {
  const [scrolled, setScrolled]     = useState(false)
  const [activeSection, setActive]  = useState('')
  const [menuOpen, setMenuOpen]     = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)

      // Find active section
      const sections = ['about', 'projects', 'skills', 'blog', 'contact']
      let current = ''
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 200) current = id
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 clamp(1.5rem, 5vw, 4rem)',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(9,9,11,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        transition: 'background 0.3s, backdrop-filter 0.3s, border-bottom 0.3s',
      }}
    >
      {/* Logo / name */}
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        data-cursor="link"
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '14px',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#fafafa',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{
          width: '8px', height: '8px',
          borderRadius: '50%',
          background: '#f59e0b',
          boxShadow: '0 0 12px #f59e0b',
          display: 'inline-block',
          flexShrink: 0,
        }} />
        Sushant Kumar
      </a>

      {/* Desktop nav links */}
      <nav
        style={{
          display: 'flex',
          gap: '0.25rem',
          alignItems: 'center',
        }}
        className="nav-desktop"
      >
        {LINKS.map(link => {
          const id = link.href.replace('#', '')
          const isActive = activeSection === id
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              data-cursor="link"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.06em',
                color: isActive ? '#f59e0b' : 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'color 0.2s, background 0.2s',
                background: isActive ? 'rgba(245,158,11,0.08)' : 'transparent',
              }}
              onMouseEnter={e => {
                const t = e.currentTarget
                if (!isActive) t.style.color = 'rgba(255,255,255,0.85)'
              }}
              onMouseLeave={e => {
                const t = e.currentTarget
                if (!isActive) t.style.color = 'rgba(255,255,255,0.55)'
              }}
            >
              {link.label}
            </a>
          )
        })}

        {/* Resume CTA */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="cta"
          style={{
            marginLeft: '0.75rem',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#f59e0b',
            textDecoration: 'none',
            padding: '0.45rem 1.1rem',
            borderRadius: '8px',
            border: '1.5px solid rgba(245,158,11,0.5)',
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(245,158,11,0.12)'
            e.currentTarget.style.borderColor = '#f59e0b'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'
          }}
        >
          Resume
        </a>
      </nav>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="nav-mobile-btn"
        aria-label="Toggle menu"
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'none',
          padding: '8px',
          color: '#fafafa',
        }}
      >
        <div style={{ width: 20, height: 2, background: '#fafafa', margin: '4px 0', transition: '0.2s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
        <div style={{ width: 20, height: 2, background: '#fafafa', margin: '4px 0', opacity: menuOpen ? 0 : 1, transition: '0.2s' }} />
        <div style={{ width: 20, height: 2, background: '#fafafa', margin: '4px 0', transition: '0.2s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            background: 'rgba(9,9,11,0.96)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              style={{ color: '#fafafa', textDecoration: 'none', fontFamily: 'Inter', fontSize: '16px', fontWeight: 600 }}
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
    </motion.header>
  )
}
