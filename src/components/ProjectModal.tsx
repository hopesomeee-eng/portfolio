import { motion, AnimatePresence } from 'framer-motion'

const PROJECTS = {
  1: {
    id: 1, node: 'NODE 01', color: '#f59e0b',
    title: 'mcp-sqlserver',
    tags: ['.NET 10', 'MCP', 'AI Safety', 'SQL Server', 'AST Parsing'],
    hook: 'AI tried to DELETE 40,000 rows. I built the gate that stopped it.',
    story: [
      'A language model with raw SQL access will eventually cause a disaster. Not hypothetically — I watched it happen: "clean up old orders" became DELETE FROM Orders WHERE Status = \'cancelled\'. 40,000 rows gone. Valid SQL. Wrong intent.',
      'mcp-sqlserver is the gate between AI intent and SQL Server execution. Every statement is parsed into an AST by Microsoft.SqlServer.TransactSql.ScriptDom — not scanned for keywords, parsed into a proper syntax tree — and checked against an EffectivePolicy before SQL Server sees a single byte.',
      'The design philosophy: don\'t trust the AI more. Validate every statement with a real parser. The policy system supports per-target rules: readOnly, maxRows, ddlApply, and TLS enforcement. Each tool response includes next_suggested_tools — the product guides the AI toward safe next steps.',
    ],
    links: [{ label: 'GitHub ↗', href: '#' }],
  },
  2: {
    id: 2, node: 'NODE 02', color: '#3b82f6',
    title: 'browser-context-mcp',
    tags: ['Node.js', 'Chrome Extension', 'SQLite', 'MCP', 'Local-first'],
    hook: 'Your browser sees everything. Your AI sees nothing. I fixed that.',
    story: [
      'You browse job sites, LinkedIn, research papers, pricing pages. The data lives in the tab. AI assistants cannot see it unless you copy-paste. I built the bridge.',
      'A Chrome extension captures API traffic (method, URL, headers, payload, response) and optional DOM extractions from any tab you enable it on. Data is stored locally in SQLite + CSV with PII redaction on Authorization headers and common patterns.',
      'An MCP server exposes query_logs, search_pages, get_job_openings, and update_prefs tools designed for agent loops — list → filter → act — not one-shot dumps. You tell Claude: "Check my tracked job sites for new openings matching my preferences." It does.',
    ],
    links: [{ label: 'GitHub ↗', href: '#' }],
  },
  3: {
    id: 3, node: 'NODE 03', color: '#14b8a6',
    title: 'Government School App',
    tags: ['Flutter', 'Offline-first', 'SQLite', 'AWS', '2 Lakh+ DAU'],
    hook: '2 lakh teachers. ₹6,000 phones. 3G that drops mid-submit. I made the form succeed anyway.',
    story: [
      'The target device costs ₹6,000, has 3GB RAM, and a Snapdragon 450. My dev phone lied to me for two sprints before I realized the gap. The production problem only shows up when frame budget is 11ms, not 16ms.',
      'A teacher submitted a form. The app said success. The server never got it. The moment it broke taught me more than any tutorial. I built a SQLite sync queue with exponential backoff. Zero data loss on dropping 3G. The form succeeds — eventually, reliably — regardless of what the network does.',
      'From 188 frame drops to 0 on Snapdragon 450, 3GB RAM. Every Flutter storage layer managed in production: SharedPreferences, Secure Storage, Hive, SQLite. CI/CD to AWS. 2,00,000+ daily users.',
    ],
    links: [],
  },
  4: {
    id: 4, node: 'NODE 04', color: '#a855f7',
    title: 'TrunTapTravel',
    tags: ['React 18', 'TypeScript', 'Zustand', 'React Query', 'Zod'],
    hook: 'Modern full-stack travel platform. Built from scratch with the current gold standard stack.',
    story: [
      'TrunTapTravel is a full-stack travel platform frontend built with React 18, TypeScript, Tailwind CSS, and Vite — mobile-first, component-driven, and production-ready.',
      'State management split cleanly: Zustand for client state, React Query for server state. Forms use React Hook Form with Zod validation — schema-first, type-safe from input to API boundary.',
      'The architecture demonstrates the cross-stack thinking from the mobile world applied to web: offline consideration, performance budget, and component reusability all influenced by years of building for constrained environments.',
    ],
    links: [{ label: 'GitHub ↗', href: '#' }],
  },
}

interface ProjectModalProps {
  projectId: number | null
  onClose: () => void
}

export function ProjectModal({ projectId, onClose }: ProjectModalProps) {
  const project = projectId ? PROJECTS[projectId as keyof typeof PROJECTS] : null

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            key="drawer"
            className="modal-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          >
            <div className="modal-inner">
              {/* Header */}
              <div className="modal-header">
                <div className="modal-meta">
                  <span className="modal-node" style={{ color: project.color }}>{project.node}</span>
                  <div className="modal-tags">
                    {project.tags.map(tag => (
                      <span key={tag} className="modal-tag" style={{ borderColor: project.color + '44', color: project.color }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              {/* Hook */}
              <h2 className="modal-hook" style={{ color: project.color }}>
                "{project.hook}"
              </h2>
              <h3 className="modal-title">{project.title}</h3>
              {/* War Story */}
              <div className="modal-story">
                {project.story.map((para, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                  >
                    {para}
                  </motion.p>
                ))}
              </div>
              {/* Links */}
              {project.links.length > 0 && (
                <div className="modal-links">
                  {project.links.map(link => (
                    <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="modal-link" style={{ '--link-color': project.color } as React.CSSProperties}>
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
