export const WAR_STORIES: Record<number, { title: string, content: string, tags: string[] }> = {
  1: {
    title: "The SQL Gatekeeper",
    tags: ["#AST", "#Security", "#ModelContextProtocol"],
    content: `## The 3-Layer Defense
    
You cannot trust an AI agent with a direct SQL connection. In \`mcp-sqlserver\`, I built a three-layer defense stack:

1. **AST Validator (ScriptDom):** Blocks \`DELETE\` statements in 1ms before they hit the DB.
2. **Auto-Injected ReadOnly:** Connection factories automatically append \`ApplicationIntent=ReadOnly\`.
3. **Engine-Level DENY:** A SELECT-only SQL login acts as the final backstop.

**The Result:** Safely deploying autonomous agents against production databases without fear of destructive mutations.`
  },
  2: {
    title: "The Neural Browser Bridge",
    tags: ["#ChromeMV3", "#WebSockets", "#AI"],
    content: `## Bridging Context to Claude
    
The data you need lives in your browser tab (LinkedIn, Jobs, Research). AI assistants can't see it unless you copy-paste.

I built \`browser-context-mcp\`:
- A Chrome MV3 extension captures API traffic and DOM elements.
- Data streams to a local Node.js + SQLite MCP server.
- Claude queries this live context autonomously via MCP tools.

**The Result:** A personal web intelligence layer that keeps data local while supercharging agent capabilities.`
  },
  3: {
    title: "The Dead Socket",
    tags: ["#OfflineFirst", "#ProductionBugs", "#SQLite"],
    content: `## The TCP Socket That Deleted a Teacher's Data

A teacher on a degrading 3G network hit submit. The app said "Success." The server never got it. The TCP socket hung without throwing an exception.

**The Fix:**
- Write to SQLite first. Always. Before any network call.
- The UI reads from SQLite. It never waits for the server.
- A background sync queue retries with exponential backoff.

I stopped trusting the network. We shipped an architecture that guarantees data survival.`
  },
  4: {
    title: "Why FastAPI Won",
    tags: ["#FastAPI", "#Python", "#AgentBackend"],
    content: `## Django vs FastAPI for Agents

I needed a backend for an AI agent. The agent calls tools via HTTP. Every tool endpoint needs a strict JSON schema.

Django requires serializers, views, and routing. 
FastAPI gave me the exact endpoint in one function with Pydantic models. The OpenAPI spec generates automatically, and the agent reads the exact input/output contract.

**The Lesson:** A human needs a UI. An AI agent needs a strict schema. FastAPI is the ultimate agent backend.`
  },
  5: {
    title: "The Voice Controller",
    tags: ["#NLP", "#SystemDesign", "#MobileDev"],
    content: `## Understanding 9 Languages

"Dashboard kholo" and "Dashboard dikhao" mean the same thing.

I had to build a voice controller that understood both — and 7 other Indian languages. Not voice search, but voice *navigation*.

**The Architecture:**
- \`Voice Input -> STT -> Language Detection -> NLP Intent Engine -> UI\`
- **The Confidence Gate:** If confidence is < 0.8, clarify. Never guess.
- Fully decoupled: The NLP layer emits structured intent events, completely agnostic of the UI.`
  },
  6: {
    title: "The Architect",
    tags: ["#SeniorDeveloper", "#FullStack", "#AgenticAI"],
    content: `## Sushant Kumar

**Full Stack, Mobile & Agentic AI Engineer**
*4 Years Experience | 8+ Apps | 10,00,000+ Users*

Specializing in scalable full-stack architectures, offline-first mobile clients, and enterprise-grade security implementations. 
Bridging the gap between high-concurrency cloud systems and autonomous agent infrastructure (MCP).`
  }
}
