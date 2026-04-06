import type { DocsContentMap } from './types'

export const raiseTheBarContent: DocsContentMap = {
  'raise-the-bar/overview': {
    slug: 'raise-the-bar/overview',
    title: 'Raise the Bar',
    description: 'The art of possible — understanding where AI creates real value and learning to reframe problems at AI scale.',
    content: `## The Right Tool for the Right Problem

Imagine you need to travel from your house to the coffee shop two blocks away. You could walk — it takes five minutes, costs nothing, and gets you there just fine.

Now imagine someone hands you a Boeing 787 for that same trip. You would need a runway, a flight crew, fuel, and thirty minutes of taxiing — all to cover two blocks. The airplane is objectively more powerful than walking, but it is absurdly wrong for this problem.

### Change the Destination

Now change the destination. You need to get from New York to Tokyo. Suddenly that airplane is not just useful — it is the only reasonable option. Walking is no longer a serious answer. The tool did not change. The problem did.

\`\`\`mermaid
flowchart LR
    subgraph Scene1["🚶 Scene 1 — Walk to coffee shop"]
        A1[House] -->|"5 min walk ✅"| B1[Coffee Shop]
    end
    subgraph Scene2["✈️ Scene 2 — Fly to coffee shop"]
        A2[House] -->|"Runway + crew + fuel ❌"| B2[Coffee Shop]
    end
    subgraph Scene3["✈️ Scene 3 — Fly to Tokyo"]
        A3[New York] -->|"Flight — only option ✅"| B3[Tokyo]
    end

    Scene1 ~~~ Scene2 ~~~ Scene3
\`\`\`

### The AI Parallel

**AI is the airplane.**

When developers bolt AI onto a problem that was already solved — adding a chatbot to a settings page, using GPT to validate an email format — the result is the same kind of mismatch. Expensive, slow, and worse than the simple solution.

The value appears when you **reframe the problem at AI scale**:

| Walking (Traditional Code) | Flying (AI) |
|---|---|
| Regex validates an email | AI reads a 50-page contract and extracts every obligation |
| A script renames files in a folder | An agent triages 200 support tickets, routes them, and drafts responses |
| A cron job generates a weekly report | An AI synthesizes data from six sources into an executive brief with recommendations |
| A form collects user preferences | A conversational interface understands intent and adapts in real time |

The shift is not about replacing what works. It is about reaching destinations that were previously unreachable.

:::tip
Ask yourself: "Is this a two-block problem or a transatlantic problem?" If traditional code solves it cleanly, use traditional code. If the problem involves language, ambiguity, synthesis, or scale — that is where AI earns its runway.
:::

## What Changed

Three things converged to make this moment different from every previous AI hype cycle:

1. **Models got good enough.** GPT-4, Claude, Gemini, and open-source models like Llama can reason, follow instructions, and produce useful output across thousands of domains.
2. **APIs made it accessible.** You do not need a PhD or a GPU cluster. A single API call gives you access to frontier intelligence.
3. **Context windows expanded.** Models can now ingest entire codebases, documents, and conversation histories — making them useful for real workflows, not just party tricks.

The result: software engineers — not just ML researchers — can now build intelligent systems. That is AI engineering.
`,
  },

  'raise-the-bar/categories': {
    slug: 'raise-the-bar/categories',
    title: 'AI Application Categories',
    description: 'A practical map of where AI creates value today — from content generation to autonomous agents.',
    content: `## Five Categories of AI Applications

Every production AI application falls into one of these categories. Understanding them helps you pick the right architecture before writing a single line of code.

### 1. Content Generation

AI produces text, images, code, audio, or video from a prompt or structured input.

**Examples:**
- Marketing copy generation (Jasper, Copy.ai)
- Image creation (Midjourney, DALL-E)
- Code generation (GitHub Copilot, Cursor)
- Video summarization and creation

**Architecture pattern:** User prompt → LLM → structured output → review/publish pipeline.

### 2. Code Assistants

AI augments developer workflows — writing code, reviewing PRs, generating tests, explaining legacy systems.

**Examples:**
- **GitHub Copilot** — inline code suggestions, chat, and agent mode
- **Cursor** — AI-first IDE with codebase awareness
- **Amazon Q** — AWS-integrated coding assistant

**Architecture pattern:** IDE integration → context gathering (open files, repo structure) → LLM → diff/suggestion.

### 3. Intelligent Search

AI understands intent, not just keywords. It retrieves, ranks, and synthesizes information from large corpora.

**Examples:**
- Perplexity — conversational search with citations
- Glean — enterprise knowledge search
- Retrieval-augmented generation (RAG) in any domain

**Architecture pattern:** Query → embedding → vector search → reranking → LLM synthesis → answer with sources.

### 4. Autonomous Agents

AI systems that take actions, use tools, and complete multi-step tasks with minimal human supervision.

**Examples:**
- Devin — autonomous software engineering agent
- GitHub Copilot coding agent — works on issues autonomously
- Customer support agents that resolve tickets end-to-end

**Architecture pattern:** Goal → plan → tool calls → observe results → iterate → deliver.

\`\`\`mermaid
flowchart LR
    A[Goal] --> B[Plan]
    B --> C[Execute Tool]
    C --> D[Observe Result]
    D --> E{Done?}
    E -->|No| B
    E -->|Yes| F[Deliver]
\`\`\`

### 5. AI Native Products

Products designed from the ground up with AI as the core experience — not a bolt-on feature.

**Examples:**
- **Linear** — AI-powered project management with auto-triage, smart labeling, and generated summaries
- **Notion** — AI writing, search, and knowledge synthesis built into the workspace
- **v0 by Vercel** — generates UI from natural language descriptions
- **Granola** — AI meeting notes that blend your notes with transcript understanding

**Key difference:** In AI native products, removing the AI would fundamentally break the product. The AI is not a feature — it is the product.

:::info
The most valuable applications combine multiple categories. A product like Notion uses content generation, intelligent search, and autonomous agents all in one experience.
:::
`,
  },

  'raise-the-bar/ai-native-products': {
    slug: 'raise-the-bar/ai-native-products',
    title: 'AI Native Products',
    description: 'What makes a product AI native and why it matters for engineers building the next generation of software.',
    content: `## AI Native vs AI Enabled

There is a critical distinction between products that use AI and products that are AI.

### AI Enabled (Bolt-on)

An existing product adds an AI feature. The product works fine without it.

- A CRM adds "AI-generated email suggestions"
- A spreadsheet app adds "ask AI about your data"
- A calendar app adds "AI scheduling assistant"

These are useful features but the core product does not depend on AI.

### AI Native (Built-in)

The product is designed around AI capabilities from the start. Without AI, the product does not exist in a meaningful form.

| Product | Why It Is AI Native |
|---|---|
| **Linear** | Auto-triages issues, generates project updates, predicts sprint capacity |
| **Notion AI** | AI is woven into every page — writing, search, Q&A over your workspace |
| **v0** | The entire product is "describe a UI, get a UI" — no AI, no product |
| **Perplexity** | Search that synthesizes answers — it is not a search engine with AI, it is an AI that searches |
| **Granola** | Meeting notes that understand context — raw transcription is useless without the AI layer |
| **Cursor** | IDE where AI understands your entire codebase — code completion is the core, not a plugin |

### Design Principles for AI Native Products

1. **Start with the AI interaction model.** Do not design a traditional UI and then add AI. Design the AI experience first.

2. **Embrace uncertainty.** AI outputs are probabilistic. Good AI native products build confidence indicators, easy correction flows, and graceful fallbacks.

3. **Make the human the editor, not the author.** The AI generates, the human reviews, refines, and approves. This is faster and produces better results than either working alone.

4. **Build feedback loops.** Every user interaction is a signal. AI native products use corrections, preferences, and usage patterns to improve continuously.

5. **Design for context.** The more context the AI has, the better it performs. AI native products are designed to surface and maintain rich context.

\`\`\`mermaid
flowchart TD
    A[User Intent] --> B[AI Generates Draft]
    B --> C[User Reviews & Edits]
    C --> D{Approved?}
    D -->|Yes| E[Publish / Execute]
    D -->|No| F[Feedback to AI]
    F --> B
    E --> G[Learn from Outcome]
    G --> B
\`\`\`

### The Implication for Engineers

If you are building an AI native product, your engineering skills shift:

- **Prompt design** becomes as important as API design
- **Evaluation** replaces unit tests for AI behavior
- **Context management** (what to include, what to trim) is a core engineering concern
- **Latency budgets** now include LLM inference time
- **Cost modeling** includes token usage, not just compute

:::tip
When evaluating whether to build AI native: if removing the AI would make your product indistinguishable from ten existing competitors, then the AI is your differentiator. Build around it.
:::
`,
  },
}
