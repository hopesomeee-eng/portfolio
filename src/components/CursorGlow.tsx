/**
 * CursorGlow.tsx — V3: Ring cursor, bigger by default
 *
 * Design: A 28px outer ring that expands/contracts by context.
 * Single ring — no double-element noise.
 * Snappy center dot + laggy ring = sense of depth.
 *
 * Default: 28px amber ring (clearly visible)
 * Hover link: 44px ring, fills partially
 * Hover project card: 44px teal ring + "CASE STUDY"
 * Hover CTA: 56px pulsing ring
 */
import { useEffect, useRef, useState, useCallback } from 'react'

type CursorType = 'default' | 'link' | 'project' | 'blog' | 'cta' | '3d' | 'skill'

const CONFIG: Record<CursorType, {
  outerSize:  number
  dotSize:    number
  color:      string
  label:      string
  pulse:      boolean
  fillOuter:  boolean
}> = {
  default: { outerSize: 36, dotSize: 10,  color: '#f59e0b', label: '',             pulse: false, fillOuter: false },
  link:    { outerSize: 52, dotSize: 10,  color: '#fafafa', label: 'OPEN ↗',       pulse: false, fillOuter: false },
  project: { outerSize: 52, dotSize: 10,  color: '#14b8a6', label: 'CASE STUDY →', pulse: false, fillOuter: false },
  blog:    { outerSize: 48, dotSize: 10,  color: '#60a5fa', label: 'READ ↗',       pulse: false, fillOuter: false },
  cta:     { outerSize: 68, dotSize: 12,  color: '#f59e0b', label: "LET'S GO",     pulse: true,  fillOuter: true  },
  '3d':    { outerSize: 24, dotSize: 6,   color: 'rgba(255,255,255,0.3)', label: '', pulse: false, fillOuter: false },
  skill:   { outerSize: 40, dotSize: 8,   color: '#a855f7', label: '',             pulse: false, fillOuter: false },
}

export function CursorGlow() {
  const outerRef = useRef<HTMLDivElement>(null)
  const dotRef   = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  // Two positions: snappy (dot) and lagged (ring)
  const snap    = useRef({ x: -200, y: -200 })
  const lagged  = useRef({ x: -200, y: -200 })
  const rafId   = useRef(0)
  const [type, setType]       = useState<CursorType>('default')
  const [visible, setVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  const cfg = CONFIG[type]

  useEffect(() => {
    // Detect if device uses a coarse pointer (touch screen)
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true)
    }
  }, [])

  const animate = useCallback(() => {
    // Dot: follows exactly
    if (dotRef.current) {
      dotRef.current.style.transform =
        `translate(${snap.current.x}px, ${snap.current.y}px) translate(-50%,-50%)`
    }
    // Ring + label: smooth lag
    lagged.current.x += (snap.current.x - lagged.current.x) * 0.1
    lagged.current.y += (snap.current.y - lagged.current.y) * 0.1
    if (outerRef.current) {
      outerRef.current.style.transform =
        `translate(${lagged.current.x}px, ${lagged.current.y}px) translate(-50%,-50%)`
    }
    if (labelRef.current) {
      const s = CONFIG[type].outerSize
      labelRef.current.style.transform =
        `translate(${lagged.current.x + s / 2 + 8}px, ${lagged.current.y - 12}px)`
    }
    rafId.current = requestAnimationFrame(animate)
  }, [type])

  useEffect(() => {
    document.body.style.cursor = 'none'
    rafId.current = requestAnimationFrame(animate)

    const onMove = (e: MouseEvent) => {
      snap.current = { x: e.clientX, y: e.clientY }
      setVisible(true)
      const el = e.target as HTMLElement
      const ancestor = el.closest('[data-cursor]') as HTMLElement | null
      const t = (ancestor?.dataset.cursor ?? 'default') as CursorType
      setType(t in CONFIG ? t : 'default')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', () => setVisible(false))
    document.addEventListener('mouseenter', () => setVisible(true))

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('mousemove', onMove)
      document.body.style.cursor = ''
    }
  }, [animate])

  const s = cfg.outerSize

  // Completely disable on touch devices
  if (isTouch) return null;

  return (
    <>
      {/* Center dot — precise, snappy */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: `${cfg.dotSize}px`, height: `${cfg.dotSize}px`,
          borderRadius: '50%', pointerEvents: 'none', zIndex: 99999,
          background: cfg.color,
          opacity: visible ? 1 : 0,
          boxShadow: `0 0 8px ${cfg.color}`,
          transition: 'opacity 0.15s, width 0.2s, height 0.2s, background 0.2s',
          willChange: 'transform',
        }}
      />

      {/* Outer ring — lagged for depth */}
      <div
        ref={outerRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: `${s}px`, height: `${s}px`,
          borderRadius: '50%', pointerEvents: 'none', zIndex: 99998,
          border: `1.5px solid ${cfg.color}`,
          background: cfg.fillOuter ? `${cfg.color}18` : 'transparent',
          opacity: visible ? (type === 'default' ? 0.65 : 0.9) : 0,
          boxShadow: `0 0 ${type === 'cta' ? '20px' : '8px'} ${cfg.color}44`,
          transition: [
            'opacity 0.15s',
            'width 0.22s cubic-bezier(.22,.61,.36,1)',
            'height 0.22s cubic-bezier(.22,.61,.36,1)',
            'border-color 0.18s',
            'background 0.18s',
            'box-shadow 0.18s',
          ].join(', '),
          animation: cfg.pulse ? 'cursorPulse 1.4s ease infinite' : 'none',
          willChange: 'transform',
        }}
      />

      {/* Context label */}
      {cfg.label && visible && (
        <div
          ref={labelRef}
          style={{
            position: 'fixed', top: 0, left: 0,
            pointerEvents: 'none', zIndex: 99997,
            fontSize: '8px', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: cfg.color, whiteSpace: 'nowrap',
            willChange: 'transform',
            textShadow: `0 0 10px ${cfg.color}66`,
          }}
        >
          {cfg.label}
        </div>
      )}

      <style>{`
        @keyframes cursorPulse {
          0%, 100% { transform: translate(var(--cx), var(--cy)) translate(-50%,-50%) scale(1); }
          50%       { transform: translate(var(--cx), var(--cy)) translate(-50%,-50%) scale(1.15); }
        }
      `}</style>
    </>
  )
}
