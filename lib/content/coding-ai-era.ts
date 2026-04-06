import type { DocsContentMap } from './types'

export const codingAiEraContent: DocsContentMap = {
  'coding-ai-era/overview': {
    slug: 'coding-ai-era/overview',
    title: 'How Development Is Changing',
    description: 'The developer workflow is being restructured. Writing code is becoming a smaller part of the job.',
    content: `## The Shift

For decades, the developer workflow looked like this:

1. Read the requirements
2. Think about the solution
3. Write the code
4. Debug the code
5. Write tests
6. Submit for review

AI is compressing steps 3 through 5 into a single interaction. The developer's role is shifting from **author** to **architect and reviewer**.

### What Is Shrinking

- **Typing code from scratch** — AI generates first drafts faster than any human
- **Boilerplate and glue code** — agents handle repetitive patterns
- **Looking up syntax and APIs** — AI knows them and applies them in context
- **Writing basic tests** — agents generate tests from implementation

### What Is Growing

- **System design and architecture** — deciding what to build and how components interact
- **Code review and validation** — reading AI-generated code critically
- **Prompt crafting** — clearly expressing intent so the AI produces the right output
- **Context management** — curating what information the AI sees
- **Evaluation** — determining whether the output is correct, secure, and performant

\`\`\`mermaid
flowchart LR
    subgraph Before["Before AI"]
        A1[Think] --> A2[Write Code]
        A2 --> A3[Debug]
        A3 --> A4[Test]
        A4 --> A5[Review]
    end
    subgraph After["With AI"]
        B1[Think] --> B2[Prompt AI]
        B2 --> B3[Review Output]
        B3 --> B4[Refine & Ship]
    end
\`\`\`

### The 80/20 Flip

Previously, developers spent roughly 80% of their time writing code and 20% reviewing it. AI is flipping that ratio. In AI-assisted workflows, developers spend 20% guiding the AI and 80% reviewing, refining, and validating the output.

This is not a demotion — it is a promotion. The developer moves from laborer to technical lead, directing AI workers and ensuring quality.

:::info
The developers who thrive in this era are not the fastest typists. They are the clearest thinkers — the ones who can articulate what they want, evaluate what they get, and iterate quickly.
:::
`,
  },

  'coding-ai-era/ai-assisted-coding': {
    slug: 'coding-ai-era/ai-assisted-coding',
    title: 'AI Assisted Coding',
    description: 'Practical patterns for working with AI coding assistants — from inline suggestions to agent-driven development.',
    content: `## Levels of AI Assistance

AI coding assistance exists on a spectrum. Each level requires different skills and trust calibration.

### Level 1: Autocomplete

The AI suggests the next few tokens as you type. You accept or reject with a keystroke.

**Tools:** GitHub Copilot inline suggestions, TabNine

**Developer skill:** Scanning suggestions quickly. Knowing when the suggestion is correct without reading every character.

### Level 2: Chat

You describe what you want in natural language. The AI generates a code block you can insert.

**Tools:** GitHub Copilot Chat, Cursor Chat, ChatGPT

**Developer skill:** Writing clear, specific prompts. Providing enough context for the AI to produce useful output.

### Level 3: Inline Edit

You select code, describe a change, and the AI modifies it in place.

**Tools:** Cursor inline edit, Copilot inline chat

**Developer skill:** Identifying what to change and describing the change precisely. Reviewing diffs critically.

### Level 4: Agent Mode

You describe a task. The AI reads your codebase, plans a multi-step approach, edits multiple files, runs commands, and iterates until the task is done.

**Tools:** GitHub Copilot agent mode, Cursor Composer, Aider

**Developer skill:** Defining tasks clearly. Setting boundaries. Reviewing multi-file changes holistically.

### Level 5: Autonomous Agent

You assign a ticket or issue. The AI works on it independently — creates a branch, writes code, runs tests, and opens a PR.

**Tools:** GitHub Copilot coding agent, Devin

**Developer skill:** Writing clear issue descriptions. Reviewing complete PRs. Setting up CI/CD that catches AI mistakes.

\`\`\`mermaid
flowchart TB
    A["Level 1: Autocomplete"] --> B["Level 2: Chat"]
    B --> C["Level 3: Inline Edit"]
    C --> D["Level 4: Agent Mode"]
    D --> E["Level 5: Autonomous Agent"]
    
    A -.- F["Less autonomy, more control"]
    E -.- G["More autonomy, less control"]
\`\`\`

## Practical Workflow Example

Here is how a developer uses AI assistance to implement a feature:

**Task:** Add pagination to an API endpoint.

1. **Describe the task** to the agent: "Add cursor-based pagination to the GET /users endpoint. Use the existing database cursor pattern from the /orders endpoint."

2. **Agent reads context** — examines the /orders endpoint, understands the cursor pattern, reads the /users controller and repository.

3. **Agent generates changes** — modifies the controller, repository, and adds request/response types.

4. **Developer reviews the diff** — checks that the cursor logic is correct, the types are right, and edge cases are handled.

5. **Agent runs tests** — executes the test suite, identifies a failing test, and fixes it.

6. **Developer approves** — merges the PR.

Total developer time: 15 minutes of review instead of 2 hours of writing.

:::tip
The highest-leverage skill in AI-assisted coding is writing great issue descriptions. The more context and constraints you provide upfront, the better the AI output. Think of it as writing a spec for a junior developer who is extremely fast but needs clear direction.
:::
`,
  },

  'coding-ai-era/prompt-engineering': {
    slug: 'coding-ai-era/prompt-engineering',
    title: 'Prompt Engineering for Devs',
    description: 'How developers write prompts that produce consistent, high-quality results from AI coding assistants.',
    content: `## Why Prompt Engineering Matters for Developers

Prompt engineering is not just a skill for AI researchers. It is the primary interface between a developer and an AI coding assistant. A good prompt produces working code on the first try. A bad prompt produces plausible-looking code that fails in subtle ways.

### The Anatomy of a Good Coding Prompt

A good coding prompt has four parts:

1. **Context** — what the AI needs to know about the codebase, conventions, and constraints
2. **Task** — what you want the AI to do, stated clearly and specifically
3. **Constraints** — what the AI should not do, boundaries, and requirements
4. **Examples** — what the output should look like (when helpful)

### Bad vs Good Prompts

**Bad prompt:**
\`\`\`text
Add error handling to this function
\`\`\`

The AI does not know what errors to handle, how to handle them, or what conventions to follow.

**Good prompt:**
\`\`\`text
Add error handling to the createUser function. Wrap the database call 
in a try/catch. On unique constraint violation, throw a ConflictError 
with the message "User already exists". On any other database error, 
throw an InternalError and log the original error with our logger. 
Follow the error handling pattern used in createOrder.
\`\`\`

### Prompting Patterns That Work

#### Pattern 1: Reference Existing Code

Instead of describing a pattern from scratch, point to an existing implementation.

\`\`\`text
Implement the delete endpoint for /projects following the same pattern 
as the delete endpoint in /users. Use soft delete with the same 
timestamp convention.
\`\`\`

#### Pattern 2: Specify What Not to Do

Negative constraints are often more useful than positive ones.

\`\`\`text
Refactor this function to use async/await. Do NOT change the function 
signature or the return type. Do NOT add new dependencies.
\`\`\`

#### Pattern 3: Step-by-Step Decomposition

For complex tasks, break them into numbered steps.

\`\`\`text
1. Add a new column "archived_at" to the projects table (nullable timestamp)
2. Update the Project model to include the new field
3. Add a PATCH /projects/:id/archive endpoint that sets archived_at to now()
4. Update the GET /projects list endpoint to exclude archived projects by default
5. Add a query parameter "include_archived=true" to override the filter
\`\`\`

#### Pattern 4: Provide the Expected Output Shape

\`\`\`text
Create a TypeScript type for the API response. It should look like:

{
  data: User[]
  pagination: {
    cursor: string | null
    hasMore: boolean
  }
}
\`\`\`

### Writing Code That Helps AI

Your codebase itself is a prompt. Code that is well-structured and clearly named helps AI produce better results:

- **Descriptive function names** — \`calculateMonthlyRevenue\` not \`calc\`
- **Type annotations** — TypeScript types give AI crucial context
- **Consistent patterns** — if every controller follows the same pattern, AI will too
- **Doc comments on complex functions** — explain the "why" for non-obvious logic
- **Well-named files and directories** — \`src/auth/middleware.ts\` not \`src/utils/helpers2.ts\`

:::tip
Think of your codebase as documentation for the AI. Every naming choice, type annotation, and structural decision is a signal that helps or hurts AI output quality.
:::
`,
  },
}
