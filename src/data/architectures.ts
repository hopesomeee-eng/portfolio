export interface NodeData {
  id: string
  label: string
  sub?: string
  layer: number
}

export interface ConnectionData {
  source: string
  target: string
  color: string
}

export interface ArchitectureCaseStudy {
  id: string
  title: string
  headline: string
  description: string
  nodes: NodeData[]
  connections: ConnectionData[]
  article: string
}

export const ARCHITECTURES: ArchitectureCaseStudy[] = [
  {
    id: "agentic-ai",
    title: "Agentic AI Orchestrator",
    headline: "The Agentic Topology.",
    description: "Zero hardcoding. This visualization uses a ResizeObserver to mathematically calculate SVG paths between DOM elements in real-time, bridging traditional FANG infrastructure with autonomous AI orchestration.",
    nodes: [
      { id: 'mobile', label: 'Mobile App', sub: 'Flutter', layer: 0 },
      { id: 'web',    label: 'Web Client', sub: 'React', layer: 0 },
      { id: 'cli',    label: 'Agent CLI',  sub: 'Python', layer: 0 },
      
      { id: 'gw',     label: 'API Gateway', sub: 'Nginx / LB', layer: 1 },
    
      { id: 'micro',  label: 'Microservices', sub: 'Go / Node', layer: 2 },
      { id: 'ai',     label: 'AI Orchestrator', sub: 'LangChain / MCP', layer: 2 },
    
      { id: 'pg',     label: 'PostgreSQL', sub: 'Relational DB', layer: 3 },
      { id: 'vec',    label: 'Vector DB',  sub: 'Pinecone / Embeddings', layer: 3 },
    ],
    connections: [
      { source: 'mobile', target: 'gw', color: '#3b82f6' },
      { source: 'web',    target: 'gw', color: '#14b8a6' },
      { source: 'cli',    target: 'gw', color: '#f59e0b' },
      
      { source: 'gw',     target: 'micro', color: '#fafafa' },
      { source: 'gw',     target: 'ai',    color: '#a855f7' },
      
      { source: 'micro',  target: 'pg',  color: '#3b82f6' },
      { source: 'ai',     target: 'vec', color: '#f59e0b' },
      { source: 'ai',     target: 'micro', color: '#71717a' },
    ],
    article: `### Why decouple the Orchestrator?
When building autonomous AI systems, treating the LLM as just another API call is a fatal mistake. LLMs are non-deterministic and highly latent.

By isolating the AI Orchestrator behind the API Gateway and establishing internal asynchronous communication with the core Microservices, we ensure that:
1. **The Core stays fast:** Standard CRUD operations bypass the AI layer entirely, completing in <50ms.
2. **Context Isolation:** The vector database (Pinecone) is queried directly by the orchestrator, preventing massive embedding payloads from clogging the relational database network layer.
3. **Tool Use (MCP):** The Orchestrator can autonomously decide to query the Microservices layer using strict OpenAPI contracts, enforcing security via the Model Context Protocol.`
  },
  {
    id: "offline-mobile",
    title: "Offline-First Mobile",
    headline: "The Resilient Sync Architecture.",
    description: "Designed for degrading 3G networks. This architecture guarantees data survival by adopting an aggressive offline-first strategy where the local database acts as the single source of truth.",
    nodes: [
      { id: 'ui',     label: 'Flutter UI', sub: 'BLoC / Provider', layer: 0 },
      
      { id: 'repo',   label: 'Repository Layer', sub: 'Dart', layer: 1 },
      
      { id: 'sqlite', label: 'Local SQLite', sub: 'Source of Truth', layer: 2 },
      { id: 'queue',  label: 'Sync Queue', sub: 'Background Isolate', layer: 2 },
      
      { id: 'cloud',  label: 'Cloud Gateway', sub: 'REST / WebSockets', layer: 3 },
    ],
    connections: [
      { source: 'ui',     target: 'repo', color: '#3b82f6' },
      { source: 'repo',   target: 'sqlite', color: '#14b8a6' },
      { source: 'repo',   target: 'queue', color: '#f59e0b' },
      { source: 'queue',  target: 'cloud', color: '#a855f7' },
      { source: 'cloud',  target: 'sqlite', color: '#71717a' }, // Background sync writes back to local
    ],
    article: `### Trust the Disk, Not the Network
In environments with spotty connectivity, traditional network-first architectures fail catastrophically. The "Loading Spinner of Death" ruins UX.

This architecture enforces a strict rule: **The UI never talks to the network.**
- The Flutter UI writes to a local SQLite database. The write completes in 2ms. The UI updates instantly.
- A background worker (Sync Queue) monitors the local changes and attempts to flush them to the Cloud Gateway.
- If the network drops, the queue pauses. It implements exponential backoff and retries when the OS broadcasts a network-restored event.

This pattern, while complex to implement regarding conflict resolution, is the only way to build a truly resilient mobile application.`
  },
  {
    id: "high-concurrency",
    title: "High-Concurrency Web",
    headline: "The Scalable Read-Heavy Pipeline.",
    description: "Engineered to handle viral traffic spikes. By heavily utilizing caching layers and edge networks, we protect the primary databases from connection exhaustion.",
    nodes: [
      { id: 'client', label: 'Web / Mobile', sub: 'Clients', layer: 0 },
      
      { id: 'cdn',    label: 'CDN Edge', sub: 'Cloudflare', layer: 1 },
      
      { id: 'api',    label: 'Node.js Cluster', sub: 'PM2 / K8s', layer: 2 },
      
      { id: 'redis',  label: 'Redis Cache', sub: 'In-Memory', layer: 3 },
      { id: 'db_w',   label: 'Primary DB', sub: 'Postgres (Write)', layer: 3 },
      { id: 'db_r',   label: 'Replica DB', sub: 'Postgres (Read)', layer: 3 },
    ],
    connections: [
      { source: 'client', target: 'cdn', color: '#3b82f6' },
      
      { source: 'cdn',    target: 'api', color: '#f59e0b' },
      
      { source: 'api',    target: 'redis', color: '#14b8a6' },
      { source: 'api',    target: 'db_w', color: '#ef4444' }, // writes
      { source: 'api',    target: 'db_r', color: '#3b82f6' }, // reads
      
      { source: 'db_w',   target: 'db_r', color: '#71717a' }, // replication
    ],
    article: `### Protecting the Database
When building applications supporting 2M+ Daily Active Users, the relational database is always the bottleneck. Connection pooling can only get you so far.

This read-heavy architecture implements a multi-tier defense:
1. **Edge Caching:** Static assets and public API responses are cached at the Cloudflare edge, completely avoiding our servers.
2. **In-Memory Cache (Redis):** Frequently accessed, user-specific data is pulled from Redis in <1ms.
3. **Read/Write Splitting:** The Node.js application routes all \`SELECT\` queries to a pool of Read Replicas, leaving the Primary Database exclusively dedicated to \`INSERT/UPDATE\` transactions.

This architecture scales horizontally with ease. If traffic spikes, we simply spin up more Node instances and Read Replicas.`
  }
]
