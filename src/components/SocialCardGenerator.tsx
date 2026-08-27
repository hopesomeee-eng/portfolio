import { useState, useRef, useLayoutEffect } from 'react'
import * as htmlToImage from 'html-to-image'

type Theme = 'vercel' | 'excalidraw' | 'vscode'

export function SocialCardGenerator() {
  const [theme, setTheme] = useState<Theme>('vercel')
  const [title, setTitle] = useState('App-Level Sync vs Database Integrity')
  const [metric, setMetric] = useState('200,000 Concurrent Users')
  
  // Vercel Theme Specific
  const [leftCode, setLeftCode] = useState('latency: 3400ms;\nstatus: "connection_timeout";')
  const [rightCode, setRightCode] = useState('latency: 12ms;\nstatus: "on_conflict_do_update";')

  const cardRef = useRef<HTMLDivElement>(null)

  const downloadImage = async () => {
    if (!cardRef.current) return
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1, pixelRatio: 1 })
      const link = document.createElement('a')
      link.download = `linkedin-card-${theme}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to generate image', err)
    }
  }

  // --- THEMES ---
  
  const renderVercel = () => (
    <div style={{ width: '100%', height: '100%', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', padding: '80px', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Header */}
      <div style={{ marginBottom: '120px' }}>
        <div style={{ fontSize: '32px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '24px' }}>System Architecture</div>
        <div style={{ fontSize: '72px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em' }}>{title}</div>
        <div style={{ fontSize: '40px', color: '#0070F3', fontWeight: 600, marginTop: '32px' }}>{metric}</div>
      </div>

      {/* Split Screen Metrics */}
      <div style={{ display: 'flex', flex: 1, gap: '40px' }}>
        
        {/* Left: The Problem */}
        <div style={{ flex: 1, border: '1px solid #333', borderRadius: '24px', background: '#111', padding: '40px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '24px', color: '#ff4444', fontWeight: 600, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ff4444' }} />
            Application-Level Sync
          </div>
          <pre style={{ margin: 0, fontFamily: 'JetBrains Mono, Fira Code, monospace', fontSize: '28px', color: '#888', lineHeight: 1.6 }}>
            {leftCode.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </pre>
        </div>

        {/* Right: The Fix */}
        <div style={{ flex: 1, border: '1px solid #333', borderRadius: '24px', background: '#111', padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle glow */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,112,243,0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          
          <div style={{ fontSize: '24px', color: '#0070F3', fontWeight: 600, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#0070F3' }} />
            Database-Level Integrity
          </div>
          <pre style={{ margin: 0, fontFamily: 'JetBrains Mono, Fira Code, monospace', fontSize: '28px', color: '#fff', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
            {rightCode.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </pre>
        </div>

      </div>
    </div>
  )

  const renderExcalidraw = () => (
    <div style={{ width: '100%', height: '100%', background: '#F8F9FA', color: '#1A1A1A', display: 'flex', flexDirection: 'column', padding: '80px', boxSizing: 'border-box', fontFamily: 'Comic Sans MS, Caveat, cursive' }}>
      <div style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '80px', textAlign: 'center' }}>{title}</div>
      <div style={{ flex: 1, border: '4px solid #E9ECEF', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '40px' }}>
        
        {/* Hand drawn boxes */}
        <div style={{ width: '300px', height: '200px', border: '4px solid #FF6B6B', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', background: '#fff', transform: 'rotate(-2deg)' }}>
          Broken App
        </div>

        <svg style={{ width: '200px', height: '100px', margin: '0 40px', overflow: 'visible' }}>
          <path d="M 0 50 Q 100 -20 200 50" fill="none" stroke="#ADB5BD" strokeWidth="6" strokeDasharray="12 12" />
          <polygon points="190,40 210,50 190,60" fill="#ADB5BD" />
          <text x="100" y="0" textAnchor="middle" fontSize="24" fill="#495057">Latency: 3.4s</text>
        </svg>

        <div style={{ width: '300px', height: '200px', border: '4px solid #4DABF7', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', background: '#fff', transform: 'rotate(1deg)' }}>
          <div>Postgres DB</div>
          <div style={{ fontSize: '20px', color: '#4DABF7', marginTop: '16px' }}>ON CONFLICT</div>
        </div>

      </div>
      <div style={{ fontSize: '40px', color: '#868E96', marginTop: '40px', textAlign: 'center' }}>{metric}</div>
    </div>
  )

  const renderVSCode = () => (
    <div style={{ width: '100%', height: '100%', background: '#1E1E1E', color: '#D4D4D4', display: 'flex', flexDirection: 'column', padding: '80px', boxSizing: 'border-box', fontFamily: 'Consolas, monospace' }}>
      
      <div style={{ fontSize: '32px', color: '#6A9955', marginBottom: '40px' }}>// {title}</div>
      <div style={{ fontSize: '32px', color: '#6A9955', marginBottom: '80px' }}>// Metric: {metric}</div>

      <div style={{ flex: 1, background: '#2D2D2D', borderRadius: '16px', border: '1px solid #404040', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
        {/* VSCode Header */}
        <div style={{ height: '60px', background: '#252526', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #404040' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FF5F56' }} />
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FFBD2E' }} />
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#27C93F' }} />
          </div>
          <div style={{ marginLeft: '40px', color: '#969696', fontSize: '20px' }}>schema.sql</div>
        </div>

        {/* Code Content */}
        <div style={{ padding: '40px', fontSize: '32px', lineHeight: 1.6 }}>
          <div style={{ color: '#569CD6' }}>ALTER TABLE <span style={{ color: '#4EC9B0' }}>attendance_records</span></div>
          <div style={{ paddingLeft: '40px', color: '#D4D4D4' }}>ADD CONSTRAINT <span style={{ color: '#CE9178' }}>fk_school_id</span></div>
          <div style={{ paddingLeft: '40px', color: '#569CD6' }}>FOREIGN KEY <span style={{ color: '#D4D4D4' }}>(school_id)</span></div>
          <div style={{ paddingLeft: '40px', color: '#569CD6' }}>REFERENCES <span style={{ color: '#4EC9B0' }}>schools</span><span style={{ color: '#D4D4D4' }}>(id);</span></div>
          <br/>
          <div style={{ color: '#569CD6' }}>INSERT INTO <span style={{ color: '#4EC9B0' }}>attendance_records</span></div>
          <div style={{ paddingLeft: '40px', color: '#D4D4D4' }}>...</div>
          <div style={{ color: '#C586C0' }}>ON CONFLICT <span style={{ color: '#D4D4D4' }}>(student_id, date)</span></div>
          <div style={{ color: '#C586C0' }}>DO UPDATE SET</div>
          <div style={{ paddingLeft: '40px', color: '#9CDCFE' }}>status <span style={{ color: '#D4D4D4' }}>=</span> <span style={{ color: '#CE9178' }}>EXCLUDED.status;</span></div>
        </div>
      </div>
    </div>
  )

  const [scale, setScale] = useState(0.5)
  const containerRef = useRef<HTMLDivElement>(null)

  // Perfect responsive scaling for the 1080x1350 canvas
  useLayoutEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect
        // Calculate scale to fit 1080x1350 within the container, with 40px padding
        const scaleX = (width - 80) / 1080
        const scaleY = (height - 80) / 1350
        setScale(Math.min(scaleX, scaleY))
      }
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fafafa', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      
      {/* LEFT PANEL: Controls */}
      <div style={{ width: '360px', background: '#111', borderRight: '1px solid #333', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', height: '100vh', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Social Card Gen</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '12px', color: '#888' }}>Theme</label>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value as Theme)}
            style={{ padding: '0.75rem', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}
          >
            <option value="vercel">Vercel (High Contrast)</option>
            <option value="excalidraw">Excalidraw (Whiteboard)</option>
            <option value="vscode">VS Code (Snippet)</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '12px', color: '#888' }}>Headline</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: '0.75rem', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '12px', color: '#888' }}>Metric Subtitle</label>
          <input 
            value={metric} 
            onChange={(e) => setMetric(e.target.value)}
            style={{ padding: '0.75rem', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}
          />
        </div>

        {theme === 'vercel' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '12px', color: '#888' }}>Left Block Text</label>
              <textarea 
                rows={4}
                value={leftCode} 
                onChange={(e) => setLeftCode(e.target.value)}
                style={{ padding: '0.75rem', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontFamily: 'monospace' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '12px', color: '#888' }}>Right Block Text</label>
              <textarea 
                rows={4}
                value={rightCode} 
                onChange={(e) => setRightCode(e.target.value)}
                style={{ padding: '0.75rem', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontFamily: 'monospace' }}
              />
            </div>
          </>
        )}

        <button 
          onClick={downloadImage}
          style={{ marginTop: 'auto', padding: '1rem', background: '#f59e0b', color: '#000', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          Download PNG (1080x1350)
        </button>
        <button 
          onClick={() => window.location.hash = ''}
          style={{ padding: '1rem', background: '#333', color: '#fff', fontWeight: 'bold', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        >
          Back to Portfolio
        </button>
      </div>

      {/* RIGHT PANEL: The Canvas */}
      <div ref={containerRef} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', overflow: 'hidden', position: 'relative' }}>
        
        {/* The actual 1080x1350 element scaled perfectly to fit */}
        <div style={{ width: '1080px', height: '1350px', transform: `scale(${scale})`, transformOrigin: 'center' }}>
          <div ref={cardRef} style={{ width: '1080px', height: '1350px' }}>
            {theme === 'vercel' && renderVercel()}
            {theme === 'excalidraw' && renderExcalidraw()}
            {theme === 'vscode' && renderVSCode()}
          </div>
        </div>

      </div>

    </div>
  )
}
