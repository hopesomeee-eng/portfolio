export const ProjectsConfig = {
  label: "03 / SELECTED WORKS",
  projects: [
    {
      id: "01", color: '#f59e0b',
      title: 'MCP SQL Server',
      category: 'Protocol / Security Boundary',
      year: '2026',
      link: 'https://github.com/sushantkumar1807/mcp-sqlserver',
      tagline: 'Zero-trust architecture enforcing read-only determinism against non-deterministic AI agents.',
      tags: ['.NET 10', 'AST Parsing', 'SQL Server', 'Zero-Trust'],
      metric: '100% Mutation Block Rate',
      story: {
        problem:     'Autonomous AI agents require direct database access to function as analysts. However, LLMs are inherently non-deterministic and hallucinate destructive mutations (e.g., DELETE/DROP) even when instructed otherwise. Standard RBAC is insufficient for dynamic reasoning engines.',
        research:    'Analyzed the Model Context Protocol (MCP) spec, Microsoft ScriptDom for Abstract Syntax Tree (AST) tokenization, and .NET Minimal API pipeline execution speeds.',
        techChoice:  '.NET 10 was selected for its ultra-low latency JIT compilation and native integration with the SQL Server AST parser. The architecture enforces an immutable read-only boundary at the application layer.',
        architecture:'Agent → MCP Protocol Buffer → .NET Middleware (AST Tokenizer) → Read-Only SQL Connection. If a mutation token is detected in the AST, the pipeline short-circuits in <1ms.',
        challenge:   'Parsing arbitrary, AI-generated T-SQL dialects efficiently without blocking the main event loop or relying on fragile Regex heuristics.',
        testing:     'Simulated 10,000+ malicious injection attempts via Claude and GPT-4. Validated AST parsing accuracy and pipeline latency under concurrent load.',
        deploy:      'Deployed as a lightweight Windows/Linux Worker Service, executing completely locally to maintain an air-gapped security posture.',
        impact:      'Successfully sandboxed autonomous agents, allowing 3 distinct AI teams to query production data schemas without a single destructive incident.',
      }
    },
    {
      id: "02", color: '#3b82f6',
      title: 'browser-context-mcp',
      category: 'Local IPC / Edge Computing',
      year: '2025',
      link: 'https://github.com/sushantkumar1807/browser-context-mcp',
      tagline: 'Bridging the Chrome DevTools Protocol to LLMs via a secure Local IPC membrane.',
      tags: ['Node.js', 'CDP', 'WebSockets', 'Local IPC'],
      metric: '0ms Network Overhead',
      story: {
        problem:     'AI coding agents lack real-time visibility into the DOM, network waterfalls, and console outputs of the applications they are building, severely limiting their autonomous debugging capabilities. Existing solutions relied on heavy, latency-inducing cloud proxies.',
        research:    'Evaluated the Chrome DevTools Protocol (CDP), WebSocket serialization formats, and the security implications of exposing a local browser instance to an arbitrary LLM agent.',
        techChoice:  'Node.js was chosen for its native, high-performance bindings to Chrome via Puppeteer/CDP. The entire architecture runs on `localhost` to guarantee absolute data privacy and zero network egress.',
        architecture:'Chrome Extension (MV3) ↔ WebSockets (Local IPC) ↔ Node.js MCP Server ↔ AI Agent. Context streams continuously without DOM polling.',
        challenge:   'Serializing massive DOM trees and Network HAR logs into a token-efficient format that an LLM can parse without exceeding context window limits.',
        testing:     'Stress-tested against highly dynamic SPAs (React/Vue) triggering continuous DOM mutations, validating memory footprint and CPU utilization of the background worker.',
        deploy:      'Distributed via npm with a companion sideloaded Chrome Extension, requiring zero external dependencies or cloud authentication.',
        impact:      'Established a zero-latency, privacy-first context bridge, drastically reducing hallucination rates during autonomous UI debugging.',
      }
    },
    {
      id: "03", color: '#14b8a6',
      title: 'Govt. School Platform',
      category: 'Offline-First Sync / Distributed State',
      year: '2024',
      link: '#',
      tagline: 'Engineered for extreme latency. Utilizing Dart Isolates and SQLite for deterministic offline sync.',
      tags: ['Flutter', 'Isolates', 'CRDTs', 'SQLite', 'AWS'],
      metric: '10,00,000+ DAU',
      story: {
        problem:     'A massive deployment (1,000,000+ users) operating on degrading 2G/3G networks across rural India. A standard network-first REST architecture caused catastrophic UI blocking and massive data loss during sync failures.',
        research:    'Investigated Conflict-Free Replicated Data Types (CRDTs), Last-Write-Wins (LWW) conflict resolution algorithms, and SQLite Write-Ahead Logging (WAL) for high-concurrency local writes.',
        techChoice:  'Flutter for the view layer, backed by a strict offline-first repository pattern. AWS API Gateway and RDS for the distributed cloud store. Avoided Firebase to maintain strict relational data integrity.',
        architecture:'Flutter UI ↔ Local SQLite (Source of Truth) ↔ Background Dart Isolate (Sync Queue) ↔ AWS Gateway. The UI never awaits a network request.',
        challenge:   'Preventing main-thread jank (skipped frames) during massive batch inserts to SQLite while the background sync queue processed hundreds of queued mutations.',
        testing:     'Network conditioning using Charles Proxy to simulate 90% packet loss and 5000ms latency. Profiled the UI thread to guarantee strict 60FPS rendering under load.',
        deploy:      'Deployed via state procurement MDMs (Mobile Device Management) with Over-The-Air (OTA) binary patching.',
        impact:      'Achieved a 99.8% sync success rate across wildly unstable networks, supporting 1,000,000+ Daily Active Users with zero perceived latency.',
      }
    },
    {
      id: "04", color: '#a855f7',
      title: 'TrunTapTravel',
      category: 'State Machines / Concurrency',
      year: '2023',
      link: 'https://github.com/sushantkumar1807/truntaptravel',
      tagline: 'A strictly typed, highly concurrent travel orchestration platform built on React 18.',
      tags: ['React 18', 'TypeScript', 'Zod', 'Stale-While-Revalidate'],
      metric: 'Strict Type Contracts',
      story: {
        problem:     'Complex multi-step booking flows with concurrent filter mutations often lead to race conditions, unhandled runtime exceptions, and desynced UI states in large-scale travel applications.',
        research:    'Analyzed React 18 Concurrent Mode, the Stale-While-Revalidate caching pattern, and finite state machine principles for managing complex client-side workflows.',
        techChoice:  'React Query for deterministic server-state synchronization. Zustand for atomic, un-opinionated local state. Zod for guaranteeing strict runtime type contracts across the network boundary.',
        architecture:'OpenAPI Spec → Zod Validation Layer → React Query Cache → Zustand State Store → React Suspense Boundaries. A unidirectional, type-safe data flow.',
        challenge:   'Orchestrating a 7-step booking state machine that could survive browser refreshes, network drops, and aggressive user navigation without corrupting the transaction payload.',
        testing:     'Comprehensive E2E testing with Playwright to simulate aggressive user interactions during mocked high-latency network responses.',
        deploy:      'Optimized Vite build pipeline deployed to Vercel Edge network for sub-50ms TTFB (Time to First Byte).',
        impact:      'Eliminated 100% of runtime type exceptions in production, achieving a 95+ Lighthouse score and seamless booking UX.',
      }
    }
  ]
}
