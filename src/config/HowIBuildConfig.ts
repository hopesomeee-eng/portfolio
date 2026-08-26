export const HowIBuildConfig = {
  label: "02 / PROCESS",
  headline: "How I build.",
  subheadline: "Not a framework. A discipline. Every project follows the same 7-step process — from R&D to production monitoring.",
  paragraph3: "I believe that architecture should be as minimal as possible, but no simpler. A well-designed system scales seamlessly because it removes unnecessary friction at the foundation.",
  paragraph4: "\"True engineering excellence is invisible. It simply works, instantly and beautifully, leaving the user completely unaware of the orchestration beneath.\"",
  steps: [
    {
      num: '01', 
      title: 'R&D',
      color: '#f59e0b',
      desc: 'Every project starts with reading specs, not writing code. MCP Protocol RFC, Chrome DevTools Protocol docs, Flutter Impeller internals — I read the source before I write a line.',
      example: 'mcp-sqlserver: Spent 3 days reading MCP spec + SQL Server DMV documentation before any code.',
    },
    {
      num: '02', 
      title: 'Architecture',
      color: '#3b82f6',
      desc: 'Draw the data flow first. Define the boundaries. Decide what changes often (APIs) vs what stays fixed (schemas). Write it down before opening an IDE.',
      example: 'Govt. School App: Designed the offline-sync conflict resolution strategy on paper before writing a single widget.',
    },
    {
      num: '03', 
      title: 'Database Design',
      color: '#14b8a6',
      desc: 'Schema is the contract. Get it wrong and you refactor forever. I model entities, define indexes, plan migration paths, and design the sync strategy for offline-first apps.',
      example: 'SQLite WAL mode + version-tagged rows for 2 lakh teacher devices syncing concurrently.',
    },
    {
      num: '04', 
      title: 'Development',
      color: '#a855f7',
      desc: 'Fast iterations. Small, reviewable commits. Feature flags for risky changes. Linting enforced. No "I\'ll clean it up later" — clean code is written in the first pass.',
      example: 'browser-context-mcp: 47 commits over 2 weeks. Each commit = a single testable behaviour.',
    },
    {
      num: '05', 
      title: 'Testing',
      color: '#f97316',
      desc: 'Unit tests for business logic. Integration tests against real databases. Load tests before release. I don\'t ship without a green suite.',
      example: 'xUnit tests on mcp-sqlserver ran 80K simulated queries. Zero race conditions found in production.',
    },
    {
      num: '06', 
      title: 'Deployment',
      color: '#ec4899',
      desc: 'Automated CI/CD. Rollback plan written before deploy. Feature flags for gradual rollout. Production deployments shouldn\'t be exciting — boring means it worked.',
      example: 'Flutter OTA updates via build flavors. .NET Worker Service on both Windows + Linux with zero config changes.',
    },
    {
      num: '07', 
      title: 'Monitor',
      color: '#22c55e',
      desc: 'Logs, metrics, alerts — set up before you need them. Frame rate monitoring. Sync success rate dashboards. If a tree falls in production and nobody\'s watching, did it fall?',
      example: '188 → 0 skipped frames. Tracked via DevTools profiler + custom widget-build timers per screen.',
    },
  ]
}
