export const ProjectsConfig = {
  label: "03 / SELECTED WORKS",
  projects: [
    {
      id: "01", color: '#f59e0b',
      title: 'MCP SQL Server',
      category: 'MCP Protocol / .NET 10',
      year: '2026',
      link: 'https://github.com/sushantkumar1807/mcp-sqlserver',
      tagline: 'AI tried to DELETE 40,000 rows. I built the gate that stopped it.',
      tags: ['.NET 10', 'MCP Protocol', 'SQL Server', 'AI Safety'],
      metric: '40,000 rows protected',
      story: {
        problem:     'An AI agent was given DELETE permissions on a production SQL Server. 40,000 rows at risk on a single malformed prompt.',
        research:    'Studied the MCP (Model Context Protocol) spec, SQL Server DMVs, .NET Minimal API patterns, and AI agent authorization models.',
        techChoice:  '.NET 10 for performance and type safety. MCP for AI-native tool integration. SQL Server stored procs for the permission boundary.',
        architecture:'MCP Server → Permission Gateway → SQL Server. Mutating queries: human approval required. Non-mutating: zero-latency passthrough.',
        challenge:   'Distinguishing safe SELECTs from destructive mutations at parse time — without an AI model on the critical path.',
        testing:     'xUnit unit tests. Real SQL Server integration tests. 80K query/day load simulation. Tested with multiple AI providers.',
        deploy:      '.NET Worker Service — runs on Windows and Linux. Registers as a local MCP tool. < 12ms p95 latency on safe queries.',
        impact:      '40,000 rows protected. 3 AI teams using it in production. Zero incidents since go-live.',
      }
    },
    {
      id: "02", color: '#3b82f6',
      title: 'browser-context-mcp',
      category: 'Node.js / Chrome DevTools',
      year: '2025',
      link: 'https://github.com/sushantkumar1807/browser-context-mcp',
      tagline: 'Your browser sees everything. Your AI sees nothing. I fixed that.',
      tags: ['Node.js', 'Chrome DevTools', 'MCP', 'Privacy-first'],
      metric: 'Local-first · zero cloud cost',
      story: {
        problem:     'AI coding agents needed browser context (URLs, DOM, console errors) but all existing tools sent data to cloud servers.',
        research:    'Chrome DevTools Protocol (CDP) docs, MCP spec, local IPC patterns, privacy-preserving context extraction approaches.',
        techChoice:  'Node.js for CDP compatibility. MCP for AI tool integration. Everything stays on localhost — no cloud dependency.',
        architecture:'Chrome Extension ↔ CDP ↔ Node.js MCP Server ↔ AI Agent. Context is extracted, filtered, and served locally.',
        challenge:   'Keeping latency under 50ms while extracting meaningful context from complex SPAs without page re-renders.',
        testing:     'Tested with 50+ websites including SPAs, dashboards, and console-heavy apps. Validated context accuracy vs manual extraction.',
        deploy:      'npm install. Chrome extension sideloaded. One config file. Works with any MCP-compatible AI agent.',
        impact:      'Local-first. Zero cloud cost. Context quality improved AI coding accuracy by ~40% in personal testing.',
      }
    },
    {
      id: "03", color: '#14b8a6',
      title: 'Govt. School Platform',
      category: 'Flutter / AWS',
      year: '2024',
      link: '#',
      tagline: '2 lakh teachers. ₹6,000 phones. 3G drops. The form still succeeds.',
      tags: ['Flutter', 'AWS', 'Offline-first', 'SQLite', 'GetX'],
      metric: '2,00,000+ Daily Active Users',
      story: {
        problem:     'Government school platform needed to work for 2 lakh teachers using ₹6,000 phones on dropping 3G networks in rural India.',
        research:    'Flutter offline-first patterns, SQLite WAL mode, exponential backoff strategies, Impeller rendering, background sync architecture.',
        techChoice:  'Flutter for cross-platform. SQLite for local persistence. GetX for state. AWS for sync. No Firebase — latency unpredictable at this scale.',
        architecture:'Local SQLite → Background sync queue → AWS API Gateway → RDS. Conflict resolution: last-write-wins with timestamp.',
        challenge:   '188 skipped frames traced to a nested ListView in the attendance screen. Resolved with sliver-based rendering and const widgets.',
        testing:     'Tested on real Snapdragon 450 devices. Network throttled to 64kbps. Simulated 100+ concurrent sync conflicts.',
        deploy:      'AWS Elastic Beanstalk. Flutter app deployed via state procurement process. OTA updates via flavors.',
        impact:      '2,00,000+ DAU. 188 → 0 skipped frames. 99.2% sync success rate even at 64kbps.',
      }
    },
    {
      id: "04", color: '#a855f7',
      title: 'TrunTapTravel',
      category: 'React 18 / TypeScript',
      year: '2023',
      link: 'https://github.com/sushantkumar1807/truntaptravel',
      tagline: 'Full-stack travel platform. Schema-first. Type-safe. Production-ready.',
      tags: ['React 18', 'TypeScript', 'Zustand', 'React Query', 'Zod', 'Vite'],
      metric: 'Type-safe end-to-end',
      story: {
        problem:     'Needed a scalable travel booking platform that could handle complex state (filters, bookings, multi-step forms) without runtime type errors.',
        research:    'React 18 concurrent features, Zustand vs Redux tradeoffs, Zod schema validation, React Query stale-while-revalidate, Vite optimization.',
        techChoice:  'React 18 for Suspense + concurrent rendering. Zustand for simplicity. Zod for runtime type safety. React Query for server state.',
        architecture:'Zod schemas → TypeScript types → React Query hooks → Zustand local state → React components. Single source of truth.',
        challenge:   'Multi-step booking form with 7 steps needed to survive page refreshes, network errors, and partial submissions.',
        testing:     'Vitest unit tests. React Testing Library for components. E2E with Playwright. Zod schemas tested against real API responses.',
        deploy:      'Vite production build → Vercel. API on separate domain with CORS configured.',
        impact:      'Zero runtime type errors in production. 95% lighthouse score. 7-step booking flow with full state persistence.',
      }
    }
  ]
}
