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
    title: "Agent Swarm (Real-Time)",
    headline: "The Autonomous Agent Swarm.",
    description: "An event-driven topology for orchestrating multi-agent LLM systems, leveraging Redis Pub/Sub to prevent HTTP blocking during heavy inference tasks.",
    nodes: [
      { id: 'client', label: 'Client App', sub: 'WebSocket', layer: 0 },
      
      { id: 'gw',     label: 'WAF Gateway', sub: 'Kong / Envoy', layer: 1 },
    
      { id: 'pubsub', label: 'Event Broker', sub: 'Redis Pub/Sub', layer: 2 },
      { id: 'master', label: 'Orchestrator', sub: 'Agent Protocol', layer: 2 },
      
      { id: 'rag',    label: 'RAG Worker', sub: 'Context Fetcher', layer: 3 },
      { id: 'coder',  label: 'Code Worker', sub: 'Execution Sandbox', layer: 3 },
    
      { id: 'vec',    label: 'Vector Memory', sub: 'Pinecone / Milvus', layer: 4 },
      { id: 'db',     label: 'State DB',  sub: 'PostgreSQL', layer: 4 },
    ],
    connections: [
      { source: 'client', target: 'gw', color: '#3b82f6' },
      { source: 'gw',     target: 'master', color: '#f59e0b' },
      { source: 'master', target: 'pubsub', color: '#a855f7' },
      
      { source: 'pubsub', target: 'rag', color: '#14b8a6' },
      { source: 'pubsub', target: 'coder', color: '#14b8a6' },
      
      { source: 'rag',    target: 'vec', color: '#f59e0b' },
      { source: 'coder',  target: 'db', color: '#3b82f6' },
      { source: 'master', target: 'db', color: '#71717a' },
    ],
    article: `### WebSockets & Event-Driven AI
LLM inference is non-deterministic. A complex reasoning task might take 500ms or 30 seconds. In standard REST architectures, this leads to HTTP timeouts and connection exhaustion at the Load Balancer level.

By upgrading the client connection to **WebSockets** and placing the Orchestrator behind an **Event Broker (Redis Pub/Sub)**, the system becomes entirely asynchronous:
1. **The Fire-and-Forget Pattern:** The Orchestrator emits an \`AgentTask\` event and instantly frees its thread.
2. **Specialized Workers:** The \`RAG Worker\` and \`Code Worker\` listen to the event bus, execute their tasks, and publish the results back.
3. **Real-Time Streaming:** The Orchestrator streams the final Markdown response token-by-token back to the client via WebSockets.

This architecture scales horizontally infinitely. If coding tasks queue up, we simply spin up more Code Worker pods.`
  },
  {
    id: "high-concurrency",
    title: "Global Edge Pipeline",
    headline: "The 100k/sec Edge Analytics Pipeline.",
    description: "Engineered to survive viral traffic spikes. Separating transactional data (OLTP) from analytics streams (OLAP) while leveraging Anycast networking for global cache routing.",
    nodes: [
      { id: 'users',  label: 'Global Traffic', sub: '100k Req/Sec', layer: 0 },
      
      { id: 'edge',   label: 'Edge Nodes', sub: 'Cloudflare Workers', layer: 1 },
      
      { id: 'api',    label: 'Node.js Cluster', sub: 'K8s Auto-Scale', layer: 2 },
      { id: 'kafka',  label: 'Data Pipeline', sub: 'Apache Kafka', layer: 2 },
      
      { id: 'redis',  label: 'In-Memory Cache', sub: 'Redis Cluster', layer: 3 },
      { id: 'postgres',label: 'Transactional DB', sub: 'PostgreSQL (OLTP)', layer: 3 },
      { id: 'click',  label: 'Analytics DB', sub: 'ClickHouse (OLAP)', layer: 3 },
    ],
    connections: [
      { source: 'users',  target: 'edge', color: '#3b82f6' },
      
      { source: 'edge',   target: 'api', color: '#f59e0b' },
      { source: 'edge',   target: 'kafka', color: '#a855f7' }, // Direct edge analytics tracking
      
      { source: 'api',    target: 'redis', color: '#14b8a6' },
      { source: 'api',    target: 'postgres', color: '#ef4444' }, // writes
      { source: 'api',    target: 'kafka', color: '#a855f7' }, // Event emission
      
      { source: 'kafka',  target: 'click', color: '#3b82f6' }, // Data sink
    ],
    article: `### Protecting the Database at Global Scale
When an application goes viral, the relational database is the first system to collapse. This pipeline implements a multi-tier defense designed for massive scale.

1. **Edge Authentication:** JWT verification happens at the Cloudflare Edge. Unauthenticated requests never even reach the Kubernetes cluster, saving massive compute.
2. **The OLTP vs OLAP Split:** Standard CRUD operations (user profiles, payments) go to **PostgreSQL**. However, high-volume event data (clicks, views, logs) are fired directly into **Apache Kafka**.
3. **ClickHouse Analytics:** Kafka streams the event data into **ClickHouse**, an ultra-fast columnar database designed for aggregations over billions of rows. 

This guarantees that a marketing dashboard querying 10 million rows will never lock a Postgres table being used for user checkouts.`
  },
  {
    id: "offline-mobile",
    title: "CRDT Offline Sync",
    headline: "The Resilient Offline-First Matrix.",
    description: "Designed for degrading mobile networks. Guarantees data survival by adopting an aggressive offline-first strategy with Background Isolates and Conflict-Free Replicated Data Types.",
    nodes: [
      { id: 'ui',     label: 'Mobile UI', sub: 'Flutter (BLoC)', layer: 0 },
      
      { id: 'sqlite', label: 'Local SQLite', sub: 'Source of Truth', layer: 1 },
      
      { id: 'queue',  label: 'Sync Engine', sub: 'Background Isolate', layer: 2 },
      { id: 'crdt',   label: 'Conflict Resolver', sub: 'Vector Clocks', layer: 2 },
      
      { id: 'cloud',  label: 'Cloud DB', sub: 'Distributed Store', layer: 3 },
    ],
    connections: [
      { source: 'ui',     target: 'sqlite', color: '#14b8a6' },
      { source: 'sqlite', target: 'queue', color: '#3b82f6' },
      { source: 'queue',  target: 'crdt', color: '#f59e0b' },
      { source: 'crdt',   target: 'cloud', color: '#a855f7' },
      { source: 'cloud',  target: 'sqlite', color: '#71717a' }, // Background sync writes back to local
    ],
    article: `### Trust the Disk, Not the Network
In environments with spotty connectivity (like subways or rural areas), traditional network-first mobile architectures fail catastrophically. The "Loading Spinner of Death" ruins UX.

This architecture enforces a strict rule: **The UI never talks to the network.**
- The Flutter UI writes exclusively to a local SQLite database. The write completes in 2ms. The UI updates instantly.
- A **Dart Background Isolate** (running on a separate CPU thread to prevent UI stutter) monitors the local changes and attempts to flush them to the Cloud.
- If the network drops, the queue pauses with exponential backoff.
- **Conflict Resolution:** We utilize CRDTs (Conflict-Free Replicated Data Types) and Vector Clocks. If the user edits a document offline, and a collaborator edits the same document online, the Sync Engine mathematically merges the states without data loss when connectivity is restored.`
  }
]
