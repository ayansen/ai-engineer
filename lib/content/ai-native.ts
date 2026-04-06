import type { DocsContentMap } from './types'

export const aiNativeContent: DocsContentMap = {
  'ai-native/overview': {
    slug: 'ai-native/overview',
    title: 'Designing AI First',
    description: 'Rethinking product design from AI first principles — where agents add leverage and how to architect around them.',
    content: `## What AI First Means

AI first does not mean "add AI to everything." It means starting every design decision with this question: **What would this look like if an AI could handle the tedious, repetitive, or synthesis-heavy parts?**

Traditional product design starts with screens, forms, and workflows. AI first design starts with intents, contexts, and capabilities.

### Traditional vs AI First Design

| Traditional Design | AI First Design |
|---|---|
| User fills out a form with 12 fields | User describes what they need in natural language |
| User navigates a dashboard to find a metric | User asks "How did we do last quarter?" and gets a synthesized answer |
| User manually assigns tickets to team members | Agent reads the ticket, understands the domain, and routes it automatically |
| User writes documentation from scratch | Agent generates a draft from code changes, user reviews and publishes |

### The AI First Design Process

\`\`\`mermaid
flowchart TD
    A[Identify User Intent] --> B[What context does the AI need?]
    B --> C[What tools/APIs does the AI call?]
    C --> D[What does the output look like?]
    D --> E[How does the user review/approve?]
    E --> F[How does the system learn from corrections?]
\`\`\`

The key insight: you are designing a **collaboration** between human and AI, not a feature that an AI powers behind the scenes.

## Where AI First Thinking Wins

AI first design is not universally better. It wins in specific scenarios:

- **High volume, low variance tasks** — ticket triage, code review comments, status report generation
- **Synthesis across sources** — combining data from Jira, GitHub, Slack, and docs into a single update
- **Natural language interfaces** — replacing complex UIs with conversational interactions
- **Personalization at scale** — adapting content, recommendations, or workflows to individual users
- **Exploration and discovery** — helping users find things they did not know to search for

:::warning
AI first design fails when applied to tasks that require guaranteed correctness (financial calculations, legal compliance) or when the cost of AI errors exceeds the cost of manual work.
:::
`,
  },

  'ai-native/agents-in-workflows': {
    slug: 'ai-native/agents-in-workflows',
    title: 'Agents in Workflows',
    description: 'How AI agents transform documentation, reporting, coding, testing, research, and support workflows.',
    content: `## Agents in Everyday Workflows

An AI agent is not a chatbot. It is a system that takes a goal, breaks it into steps, uses tools, and delivers a result. Here is how agents fit into real development workflows.

### Documentation

**Before agents:** A developer finishes a feature, opens the wiki, stares at a blank page, and writes documentation two weeks later (if ever).

**With agents:** The agent monitors merged PRs, reads the code changes, generates documentation drafts, and opens a PR for review.

\`\`\`mermaid
flowchart LR
    A[PR Merged] --> B[Agent reads diff]
    B --> C[Agent generates docs]
    C --> D[Opens docs PR]
    D --> E[Human reviews]
\`\`\`

### Reporting

**Before agents:** A manager spends Friday afternoon pulling data from Jira, GitHub, and Slack to write a status update.

**With agents:** The agent pulls data from all three sources, identifies key themes, and drafts a status report. The manager reviews it in five minutes.

### Coding

**Before agents:** A developer reads a Jira ticket, opens the codebase, finds the relevant files, writes code, writes tests, and opens a PR.

**With agents:** The agent reads the Jira ticket, finds the relevant code, proposes a change, generates tests, and opens a draft PR. The developer reviews and refines.

### Testing

**Before agents:** A QA engineer manually writes test cases based on requirements documents.

**With agents:** The agent reads the requirements and existing tests, identifies coverage gaps, generates new test cases, and flags edge cases the team missed.

### Research

**Before agents:** A developer spends hours reading documentation, Stack Overflow, and GitHub issues to understand a new library.

**With agents:** The agent ingests the library documentation, finds relevant examples, answers specific questions, and generates starter code.

### Support

**Before agents:** A support engineer reads a ticket, searches the knowledge base, finds a relevant article, copies the solution, and personalizes the response.

**With agents:** The agent reads the ticket, searches the knowledge base, drafts a personalized response with the right solution, and escalates only when confidence is low.

## The Pattern

Every workflow above follows the same structure:

1. **Trigger** — something happens (PR merged, ticket created, question asked)
2. **Context gathering** — the agent reads relevant data from multiple sources
3. **Reasoning** — the agent plans and executes steps
4. **Output** — the agent produces a draft, suggestion, or action
5. **Human review** — the human approves, edits, or rejects

\`\`\`mermaid
flowchart TD
    A[Trigger Event] --> B[Gather Context]
    B --> C[Agent Reasons & Plans]
    C --> D[Execute Actions]
    D --> E[Produce Output]
    E --> F{Human Review}
    F -->|Approve| G[Done]
    F -->|Edit| E
    F -->|Reject| H[Log & Learn]
\`\`\`

:::tip
Start with workflows where the cost of error is low and the volume is high. Documentation drafts, test case generation, and status reports are ideal first candidates because a wrong output is easily caught and fixed.
:::
`,
  },

  'ai-native/orchestration': {
    slug: 'ai-native/orchestration',
    title: 'Agent Orchestration',
    description: 'Where agent orchestration adds leverage in day-to-day development workflows and how to design it.',
    content: `## Why Orchestration Matters

A single agent calling a single tool is useful. Multiple agents coordinated across a workflow is transformative. Orchestration is the layer that decides **which agent does what, when, and with what context**.

### Single Agent vs Orchestrated Agents

| Single Agent | Orchestrated Agents |
|---|---|
| Answers a question | Reads a ticket, writes code, runs tests, opens a PR |
| Generates one document | Monitors a repo, generates docs for every change, keeps them in sync |
| Writes a test | Identifies coverage gaps across the entire codebase, generates tests, verifies they pass |

### Orchestration Patterns

#### Sequential Pipeline

Agents execute in order. Output of one feeds into the next.

\`\`\`mermaid
flowchart LR
    A[Agent 1: Read Ticket] --> B[Agent 2: Write Code]
    B --> C[Agent 3: Write Tests]
    C --> D[Agent 4: Open PR]
\`\`\`

**Use when:** Tasks have clear dependencies and each step requires different capabilities.

#### Parallel Fan-Out

Multiple agents work on different parts of a problem simultaneously.

\`\`\`mermaid
flowchart TD
    A[Coordinator] --> B[Agent: Frontend]
    A --> C[Agent: Backend]
    A --> D[Agent: Tests]
    B --> E[Merge Results]
    C --> E
    D --> E
\`\`\`

**Use when:** Subtasks are independent and speed matters.

#### Router

A coordinator agent reads the input and routes it to the right specialist agent.

\`\`\`mermaid
flowchart TD
    A[Input] --> B[Router Agent]
    B -->|Bug report| C[Bug Fix Agent]
    B -->|Feature request| D[Feature Agent]
    B -->|Question| E[Knowledge Agent]
    B -->|Refactor| F[Refactor Agent]
\`\`\`

**Use when:** Inputs vary in type and require different expertise.

#### Evaluator-Optimizer Loop

One agent generates, another evaluates. The loop continues until quality meets a threshold.

\`\`\`mermaid
flowchart TD
    A[Generator Agent] --> B[Output]
    B --> C[Evaluator Agent]
    C --> D{Quality OK?}
    D -->|No| E[Feedback]
    E --> A
    D -->|Yes| F[Final Output]
\`\`\`

**Use when:** Output quality varies and you have clear evaluation criteria.

## Orchestration in Practice

Here is a concrete example — an orchestrated workflow for handling a Jira ticket end-to-end:

\`\`\`mermaid
flowchart TD
    A[Jira Ticket Created] --> B[Triage Agent]
    B --> C{Type?}
    C -->|Bug| D[Bug Analysis Agent]
    C -->|Feature| E[Feature Planning Agent]
    D --> F[Code Agent: Fix Bug]
    E --> F2[Code Agent: Implement Feature]
    F --> G[Test Agent: Generate & Run Tests]
    F2 --> G
    G --> H{Tests Pass?}
    H -->|No| F
    H -->|No| F2
    H -->|Yes| I[PR Agent: Open Pull Request]
    I --> J[Human Review]
\`\`\`

### Key Decisions in Orchestration Design

1. **What triggers the workflow?** (Webhook, schedule, manual)
2. **What context does each agent need?** (Minimize — pass only what is relevant)
3. **What happens when an agent fails?** (Retry, escalate, skip)
4. **Where are the human checkpoints?** (Before destructive actions, after critical decisions)
5. **How do you observe the system?** (Logging, tracing, cost tracking)

:::info
Orchestration is where most of the engineering complexity lives. The individual agents are often straightforward — it is the coordination, error handling, and context management between them that requires careful design.
:::
`,
  },
}
