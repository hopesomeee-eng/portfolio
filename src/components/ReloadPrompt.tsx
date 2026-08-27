import { useRegisterSW } from 'virtual:pwa-register/react'

export function ReloadPrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  if (!needRefresh) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        background: '#18181b',
        border: '1px solid rgba(250, 250, 250, 0.1)',
        padding: '16px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        color: '#fafafa',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}
    >
      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
        New version available
      </div>
      <button
        onClick={() => updateServiceWorker(true)}
        style={{
          background: '#f59e0b',
          color: '#09090b',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.8rem'
        }}
      >
        Click to refresh
      </button>
    </div>
  )
}
