/**
 * SettingsToggle.tsx
 *
 * Floating ⚙ button (top-right) that opens a small panel
 * letting users control:
 *   - Show/hide frosted glass overlay cards
 *   - Particle density (full / reduced / off)
 *
 * Defaults are all ON (best experience).
 * Values are stored in localStorage so they persist on reload.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolioStore } from '../store'

interface Settings {
  showCards:     boolean
  particleLevel: 'full' | 'reduced' | 'off'
}

const DEFAULT_SETTINGS: Settings = { showCards: true, particleLevel: 'full' }
const STORAGE_KEY = 'portfolio-settings'

function loadSettings(): Settings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS
}

function saveSettings(s: Settings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch { /* ignore */ }
}

// Expose settings globally so other components can react
export const settingsStore = {
  get: loadSettings,
}

export function SettingsToggle() {
  const [open, setOpen]         = useState(false)
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const { performanceMode, setPerformanceMode } = usePortfolioStore()

  const update = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    saveSettings(next)
    // Dispatch event so other components can react without prop drilling
    window.dispatchEvent(new CustomEvent('portfolio-settings', { detail: next }))
  }

  // Apply settings to DOM as CSS vars / class so pure CSS can react
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--cards-opacity',
      settings.showCards ? '1' : '0'
    )
    document.documentElement.style.setProperty(
      '--cards-pointer',
      settings.showCards ? 'auto' : 'none'
    )
  }, [settings.showCards])

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, sans-serif' }}>{label}</span>
      {children}
    </div>
  )

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      data-cursor="link"
      style={{
        width: '36px', height: '20px', borderRadius: '100px', cursor: 'none', border: 'none',
        background: value ? '#f59e0b' : 'rgba(255,255,255,0.12)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: '2px',
        left: value ? '18px' : '2px',
        width: '16px', height: '16px',
        borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s',
      }} />
    </button>
  )

  return (
    <>
      {/* Gear icon button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        onClick={() => setOpen(!open)}
        data-cursor="link"
        aria-label="Settings"
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          zIndex: 300, width: '40px', height: '40px',
          borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(9,9,11,0.85)', backdropFilter: 'blur(12px)',
          cursor: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'; e.currentTarget.style.color = '#f59e0b' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
      >
        ⚙
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed', bottom: '4.5rem', right: '1.5rem',
              zIndex: 300, width: '220px',
              background: 'rgba(13,13,20,0.95)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px',
              padding: '1rem 1.25rem',
            }}
          >
            <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#f59e0b', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', fontWeight: 700, marginBottom: '0.75rem' }}>
              System
            </p>
            <div style={{ padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, sans-serif', marginBottom: '0.5rem' }}>Performance Mode</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['auto', 'eco', 'cinematic'] as const).map(mode => (
                  <button key={mode} onClick={() => setPerformanceMode(mode)} data-cursor="link"
                    style={{
                      flex: 1, padding: '4px', borderRadius: '6px', cursor: 'none', border: 'none',
                      fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                      fontFamily: 'Inter, sans-serif',
                      background: performanceMode === mode ? '#f59e0b' : 'rgba(255,255,255,0.06)',
                      color: performanceMode === mode ? '#09090b' : 'rgba(255,255,255,0.4)',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >{mode}</button>
                ))}
              </div>
            </div>
            
            <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: '#f59e0b', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', fontWeight: 700, marginTop: '1rem', marginBottom: '0.75rem' }}>
              Display
            </p>
            <Row label="Overlay cards">
              <Toggle value={settings.showCards} onChange={v => update({ showCards: v })} />
            </Row>
            <div style={{ padding: '0.6rem 0' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter, sans-serif', marginBottom: '0.5rem' }}>Particles</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['full', 'reduced', 'off'] as const).map(level => (
                  <button key={level} onClick={() => update({ particleLevel: level })} data-cursor="link"
                    style={{
                      flex: 1, padding: '4px', borderRadius: '6px', cursor: 'none', border: 'none',
                      fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                      fontFamily: 'Inter, sans-serif',
                      background: settings.particleLevel === level ? '#f59e0b' : 'rgba(255,255,255,0.06)',
                      color: settings.particleLevel === level ? '#09090b' : 'rgba(255,255,255,0.4)',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >{level}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
