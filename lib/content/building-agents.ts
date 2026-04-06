import type { DocsContentMap } from './types'

export const buildingAgentsContent: DocsContentMap = {
  'building-agents/overview': {
    slug: 'building-agents/overview',
    title: 'Agents, Tools & Functions',
    description: 'Understanding the building blocks — what agents, tools, and function calls are, and how they fit together.',
    content: `## Defining the Terms

These terms get used interchangeably, but they mean different things. Getting the definitions right matters for architecture.

### Tool

A tool is a **function that an AI model can invoke** to interact with the outside world. Tools have a name, a description, and a schema for their parameters.

\`\`\`typescript
// A tool definition
const searchTool = {
  name: "search_codebase",
  description: "Search for files or code patterns in the repository",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string", description: "The search query" },
      file_type: { type: "string", description: "Filter by file extension" }
    },
    required: ["query"]
  }
}
\`\`\`

A tool on its own does nothing. It is a capability that the model can choose to use.

### Function Call

A function call is the **model's decision to use a tool**. The model generates a structured JSON object that matches the tool's schema. Your code then executes the actual function and returns the result.

\`\`\`typescript
// Model generates this (function call)
{
  "name": "search_codebase",
  "arguments": {
    "query": "authentication middleware",
    "file_type": "ts"
  }
}

// Your code executes it and returns the result
// → ["src/auth/middleware.ts", "src/auth/jwt.ts"]
\`\`\`

### Agent

An agent is a **system that uses an LLM in a loop** — reasoning about what to do, calling tools, observing results, and deciding the next step. The loop continues until the task is complete.

\`\`\`mermaid
flowchart TD
    A[Receive Task] --> B[Think: What should I do next?]
    B --> C[Call a Tool]
    C --> D[Observe Result]
    D --> E{Task Complete?}
    E -->|No| B
    E -->|Yes| F[Return Final Answer]
\`\`\`

### How They Relate

\`\`\`mermaid
flowchart LR
    A[Agent] -->|uses| B[LLM]
    B -->|generates| C[Function Calls]
    C -->|invoke| D[Tools]
    D -->|return results to| A
\`\`\`

- A **tool** is a capability
- A **function call** is the model choosing to use a capability
- An **agent** is the loop that orchestrates multiple function calls to complete a task

### Concrete Example

**Task:** "Find the bug in the login flow and fix it."

**Agent loop:**

1. **Think:** I need to find the login-related code.
2. **Tool call:** \`search_codebase("login")\` → finds \`src/auth/login.ts\`
3. **Tool call:** \`read_file("src/auth/login.ts")\` → reads the code
4. **Think:** The password comparison is using \`==\` instead of a constant-time comparison. This is a timing attack vulnerability.
5. **Tool call:** \`edit_file("src/auth/login.ts", ...)\` → fixes the comparison
6. **Tool call:** \`run_tests("src/auth/")\` → all tests pass
7. **Done:** Returns the fix with explanation

The agent made four tool calls, but it also **reasoned between each call** — that reasoning is what makes it an agent and not just a script.

:::tip
If your "agent" always calls the same tools in the same order, it is not an agent — it is a pipeline with extra latency. Real agents make dynamic decisions based on what they observe.
:::
`,
  },

  'building-agents/agentic-vs-deterministic': {
    slug: 'building-agents/agentic-vs-deterministic',
    title: 'Agentic vs Deterministic Workflows',
    description: 'Understanding when to use agentic workflows versus deterministic pipelines — and the tradeoffs of each.',
    content: `## Two Approaches to Automation

Every automation decision comes down to a choice: should this be deterministic (predictable, scripted) or agentic (adaptive, AI-driven)?

### Deterministic Workflows

A deterministic workflow follows a fixed sequence of steps. The same input always produces the same output. There is no reasoning — just execution.

\`\`\`mermaid
flowchart LR
    A[Input] --> B[Step 1]
    B --> C[Step 2]
    C --> D[Step 3]
    D --> E[Output]
\`\`\`

\`\`\`typescript
// Deterministic: Deploy pipeline
async function deploy(branch: string) {
  await runTests(branch)        // Always step 1
  await buildArtifact(branch)   // Always step 2
  await pushToRegistry()        // Always step 3
  await updateDeployment()      // Always step 4
}
\`\`\`

**Strengths:**
- Predictable — you know exactly what will happen
- Debuggable — when something fails, the error is in a specific step
- Fast — no LLM calls, no reasoning overhead
- Cheap — no token costs

**Weaknesses:**
- Brittle — cannot handle unexpected inputs or edge cases
- Rigid — adding new behavior requires code changes
- Limited — cannot reason about novel situations

### Agentic Workflows

An agentic workflow uses an LLM to decide what to do at each step. The path from input to output is dynamic and depends on what the agent observes along the way.

\`\`\`mermaid
flowchart TD
    A[Input] --> B{Agent: What should I do?}
    B -->|Need more info| C[Search / Read]
    C --> B
    B -->|Ready to act| D[Execute Action]
    D --> E{Agent: Did it work?}
    E -->|No| F[Diagnose & Retry]
    F --> B
    E -->|Yes| G{Agent: Anything else?}
    G -->|Yes| B
    G -->|No| H[Output]
\`\`\`

\`\`\`typescript
// Agentic: Handle a support ticket
async function handleTicket(ticket: string) {
  const agent = new Agent({
    tools: [searchKB, readTicketHistory, sendReply, escalate],
    systemPrompt: "Resolve support tickets. Escalate if uncertain."
  })
  return agent.run(ticket)
  // Agent decides: search KB? reply? escalate? ask for more info?
}
\`\`\`

**Strengths:**
- Adaptive — handles novel inputs and edge cases
- Flexible — behavior changes with the prompt, not the code
- Capable — can reason about ambiguous or complex situations
- Self-correcting — can observe failures and try alternative approaches

**Weaknesses:**
- Unpredictable — different runs may take different paths
- Slower — LLM calls add latency at every decision point
- Expensive — each reasoning step costs tokens
- Harder to debug — "why did the agent do that?" requires trace analysis

### When to Use Which

| Scenario | Use Deterministic | Use Agentic |
|---|---|---|
| CI/CD pipeline | ✅ | ❌ |
| Data validation | ✅ | ❌ |
| Code review comments | ❌ | ✅ |
| Support ticket triage | ❌ | ✅ |
| Database migration | ✅ | ❌ |
| Bug investigation | ❌ | ✅ |
| Report generation from structured data | ✅ | ❌ |
| Report generation from unstructured data | ❌ | ✅ |
| File format conversion | ✅ | ❌ |
| Natural language request handling | ❌ | ✅ |

### The Hybrid Pattern

In practice, the best systems combine both. Deterministic scaffolding provides structure and safety. Agentic steps handle the parts that require reasoning.

\`\`\`mermaid
flowchart TD
    A[Trigger: New PR] --> B[Deterministic: Run Linters]
    B --> C[Deterministic: Run Tests]
    C --> D{Tests Pass?}
    D -->|No| E[Deterministic: Block PR]
    D -->|Yes| F[Agentic: AI Code Review]
    F --> G[Agentic: AI Security Scan]
    G --> H[Deterministic: Post Comments]
    H --> I[Human: Final Approval]
\`\`\`

:::info
Use deterministic workflows as guardrails around agentic steps. The deterministic parts ensure safety and predictability. The agentic parts handle the nuanced decisions that would be impossible to script.
:::
`,
  },

  'building-agents/evals': {
    slug: 'building-agents/evals',
    title: 'Testing with Evals',
    description: 'How to test AI agents — evaluations (evals) replace unit tests as the primary quality mechanism.',
    content: `## Why Traditional Tests Are Not Enough

Unit tests assert exact outputs: \`expect(add(2, 3)).toBe(5)\`. This works for deterministic code. But AI agents are non-deterministic — the same input can produce different (valid) outputs.

You cannot unit test "did the agent write a good code review comment." You need **evaluations**.

### What Are Evals?

An eval is a test that scores an AI output on a scale rather than checking for an exact match. Evals answer: "Is this output good enough?" rather than "Is this output exactly X?"

### Types of Evals

#### Exact Match

The simplest eval. Does the output contain or match a specific value?

\`\`\`typescript
// Does the agent correctly classify the ticket?
const result = await agent.classify(ticket)
assert(result.category === "bug") // Exact match
\`\`\`

**Use for:** Classification, extraction, structured output.

#### LLM-as-Judge

Use another LLM to evaluate the output. Give it criteria and ask it to score.

\`\`\`typescript
// Use GPT-4 to judge the quality of a code review comment
const judgment = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: \`Score this code review comment 1-5:
      - 1: Wrong or unhelpful
      - 3: Correct but vague
      - 5: Specific, actionable, and correct
    \` },
    { role: "user", content: agentOutput }
  ]
})
\`\`\`

**Use for:** Open-ended outputs, writing quality, explanation quality.

#### Human Evaluation

The gold standard. A human reviews the output and scores it.

**Use for:** High-stakes outputs, establishing baselines, calibrating automated evals.

#### Functional Evals

The output should produce a specific side effect. Run it and check.

\`\`\`typescript
// Does the agent-generated code actually compile and pass tests?
const code = await agent.generateCode(task)
writeFile("solution.ts", code)
const result = await exec("npx tsc && npm test")
assert(result.exitCode === 0)
\`\`\`

**Use for:** Code generation, configuration changes, any output that can be executed.

### The Eval Loop

Evals are not one-time tests. They are a continuous improvement loop:

\`\`\`mermaid
flowchart TD
    A[Define Eval Criteria] --> B[Run Agent on Test Cases]
    B --> C[Score Outputs]
    C --> D[Analyze Failures]
    D --> E[Improve Agent]
    E --> B
    C --> F[Track Metrics Over Time]
\`\`\`

### Building an Eval Suite

1. **Start with 20-50 representative test cases** — real inputs from production, covering common and edge cases
2. **Define scoring criteria** — what makes an output good, acceptable, or bad?
3. **Automate where possible** — use exact match and LLM-as-judge for fast iteration
4. **Track metrics over time** — are you improving? Plot pass rates per prompt version.
5. **Add failure cases** — every production failure becomes a new eval case

### Example Eval Suite Structure

\`\`\`text
evals/
├── test_cases/
│   ├── code_review/
│   │   ├── case_001.json    # Input: PR diff, Expected: catches the bug
│   │   ├── case_002.json    # Input: clean code, Expected: approves
│   │   └── case_003.json    # Input: security issue, Expected: flags it
│   └── ticket_triage/
│       ├── case_001.json    # Input: bug report, Expected: category=bug, priority=high
│       └── case_002.json    # Input: feature request, Expected: category=feature
├── judges/
│   ├── code_review_judge.ts  # LLM-as-judge prompt for code reviews
│   └── triage_judge.ts       # Exact match + LLM judge for triage
└── run_evals.ts              # Runs all evals, produces report
\`\`\`

:::tip
The most common mistake is not having evals at all. The second most common mistake is having evals but not running them on every prompt change. Treat evals like CI — they run automatically and block bad changes.
:::
`,
  },

  'building-agents/agentic-ui': {
    slug: 'building-agents/agentic-ui',
    title: 'Agentic UI with CopilotKit',
    description: 'Building user interfaces for AI agents — letting users interact with, guide, and observe agent behavior.',
    content: `## The Agentic UI Problem

Traditional UIs are designed for human input → deterministic output. Agentic UIs need to handle a new set of interactions:

- The AI is doing something — show progress
- The AI wants to take an action — ask for permission
- The AI made a mistake — allow easy correction
- The AI needs more information — ask naturally
- The AI produced a result — show it in context

### What Is CopilotKit?

[CopilotKit](https://copilotkit.ai) is an open-source framework for building agentic UIs in React. It provides components and hooks that connect your frontend to AI agents.

**Core capabilities:**

- **In-app AI chat** — a chat panel that understands your app's context
- **AI-aware components** — UI elements that agents can read and modify
- **Human-in-the-loop** — approval flows for agent actions
- **Shared state** — agents and UI share the same state, staying in sync

### Architecture

\`\`\`mermaid
flowchart TD
    A[React App] --> B[CopilotKit Provider]
    B --> C[Chat Component]
    B --> D[Readable State]
    B --> E[Agent Actions]
    C --> F[LLM Backend]
    D --> F
    E --> F
    F --> G[Agent Decides]
    G -->|Read state| D
    G -->|Take action| E
    G -->|Reply| C
\`\`\`

### Key Concepts

#### 1. Making App State Readable

Tell the agent what it can see. Use \`useCopilotReadable\` to expose app state to the AI.

\`\`\`typescript
import { useCopilotReadable } from "@copilotkit/react-core"

function ProjectDashboard({ project }) {
  // The agent can now see the current project details
  useCopilotReadable({
    description: "The current project being viewed",
    value: project
  })

  return <div>...</div>
}
\`\`\`

#### 2. Defining Agent Actions

Tell the agent what it can do. Use \`useCopilotAction\` to define actions the AI can take.

\`\`\`typescript
import { useCopilotAction } from "@copilotkit/react-core"

function TaskList() {
  useCopilotAction({
    name: "createTask",
    description: "Create a new task in the current project",
    parameters: [
      { name: "title", type: "string", description: "Task title", required: true },
      { name: "priority", type: "string", enum: ["low", "medium", "high"] }
    ],
    handler: async ({ title, priority }) => {
      await api.createTask({ title, priority })
    }
  })

  return <div>...</div>
}
\`\`\`

#### 3. Chat Interface

Add a chat panel that has full awareness of your app state and available actions.

\`\`\`typescript
import { CopilotSidebar } from "@copilotkit/react-ui"

function App() {
  return (
    <CopilotKit runtimeUrl="/api/copilot">
      <CopilotSidebar
        defaultOpen={true}
        instructions="You are a project management assistant."
      >
        <ProjectDashboard />
      </CopilotSidebar>
    </CopilotKit>
  )
}
\`\`\`

#### 4. Human-in-the-Loop

For sensitive actions, require user approval before the agent executes.

\`\`\`typescript
useCopilotAction({
  name: "deleteProject",
  description: "Delete a project permanently",
  // This will show a confirmation dialog before executing
  renderAndWaitForResponse: ({ args, respond }) => (
    <div>
      <p>Delete project "{args.name}"? This cannot be undone.</p>
      <button onClick={() => respond("approved")}>Confirm</button>
      <button onClick={() => respond("denied")}>Cancel</button>
    </div>
  ),
  handler: async ({ name }) => {
    await api.deleteProject(name)
  }
})
\`\`\`

### Why Agentic UI Matters

Without a proper agentic UI:
- Users cannot see what the agent is doing → they lose trust
- Users cannot correct the agent → errors compound
- Users cannot guide the agent → results are generic
- Users cannot approve actions → the agent either does too much or too little

With a proper agentic UI:
- Users see agent reasoning in real-time
- Users can intervene, correct, and guide
- Users approve consequential actions
- The experience feels collaborative, not autonomous

\`\`\`mermaid
flowchart LR
    subgraph Without["Without Agentic UI"]
        A1[User] -->|"sends request"| A2[Black Box Agent]
        A2 -->|"returns result"| A1
    end
    subgraph With["With Agentic UI"]
        B1[User] <-->|"observes & guides"| B2[Transparent Agent]
        B2 <-->|"asks & reports"| B1
    end
\`\`\`

:::info
Agentic UI is not optional — it is the difference between a demo and a product. Users need to trust, understand, and control the AI. CopilotKit provides the building blocks to make that possible in React applications.
:::
`,
  },
}
