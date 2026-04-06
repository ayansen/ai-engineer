import type { DocsContentMap } from './types'

export const codeThreeContent: DocsContentMap = {
  'code-three/overview': {
    slug: 'code-three/overview',
    title: 'The Evolution of Code',
    description: 'From writing every line by hand to prompting models and orchestrating agents — the three eras of software development.',
    content: `## Three Eras of Software

Software development has evolved through three distinct paradigms. Each one changed what it means to be a developer.

### Code 1.0 — Developers Write Explicit Logic

The original paradigm. Developers write every line of logic by hand. Every condition, loop, and transformation is explicitly coded.

\`\`\`python
# Code 1.0: Classify email spam manually
def is_spam(email):
    spam_words = ["free", "winner", "click here", "limited time"]
    for word in spam_words:
        if word in email.lower():
            return True
    return False
\`\`\`

**Characteristics:**
- Deterministic — same input always produces same output
- Transparent — you can read the code and understand every decision
- Brittle — adding a new spam pattern means editing code and redeploying
- Limited — cannot handle nuance, context, or language variation

### Code 2.0 — Developers Train Models

The machine learning era. Instead of writing rules, developers curate data and train models that learn patterns.

\`\`\`python
# Code 2.0: Train a model to classify spam
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(training_emails)
model = MultinomialNB().fit(X, labels)

prediction = model.predict(vectorizer.transform([new_email]))
\`\`\`

**Characteristics:**
- Statistical — outputs are probabilities, not certainties
- Data-dependent — model quality depends on training data quality
- Generalized — can handle patterns the developer did not explicitly code
- Opaque — hard to explain why the model made a specific decision
- Expensive to iterate — retraining requires data, compute, and time

### Code 3.0 — Developers Prompt Models and Orchestrate Agents

The current paradigm. Developers use pre-trained foundation models through prompts and orchestrate agents that use tools to complete tasks.

\`\`\`python
# Code 3.0: Prompt a model to classify spam
import openai

response = openai.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "Classify the email as spam or not spam. "
         "Respond with only 'spam' or 'not_spam'."},
        {"role": "user", "content": email_text}
    ]
)

classification = response.choices[0].message.content
\`\`\`

**Characteristics:**
- Prompt-driven — behavior changes by changing the prompt, not the code
- Zero-shot capable — works on new tasks without training data
- Context-aware — can reason about nuance, intent, and language
- Composable — chain multiple calls, add tools, build agents
- Non-deterministic — same prompt can produce different outputs

### The Three Eras Compared

| | Code 1.0 | Code 2.0 | Code 3.0 |
|---|---|---|---|
| **Developer writes** | Logic | Training pipelines | Prompts and orchestration |
| **Intelligence source** | Human rules | Learned patterns | Pre-trained models |
| **Iteration speed** | Deploy new code | Retrain model | Edit a prompt |
| **Handles ambiguity** | No | Somewhat | Yes |
| **Cost per inference** | Negligible | Low | Higher (token-based) |
| **Transparency** | Full | Low | Medium (prompt is readable) |

\`\`\`mermaid
flowchart LR
    subgraph Code1["Code 1.0"]
        A1[Developer] -->|writes| A2[Rules & Logic]
    end
    subgraph Code2["Code 2.0"]
        B1[Developer] -->|curates data| B2[Training Pipeline]
        B2 -->|produces| B3[Model]
    end
    subgraph Code3["Code 3.0"]
        C1[Developer] -->|writes prompts| C2[Foundation Model]
        C1 -->|orchestrates| C3[Agent + Tools]
    end
    Code1 --> Code2 --> Code3
\`\`\`

:::info
Code 3.0 does not replace 1.0 and 2.0. All three coexist. You still write explicit logic for deterministic operations, train models for specialized tasks, and use prompts for language, reasoning, and orchestration. The skill is knowing which paradigm fits each problem.
:::
`,
  },

  'code-three/developer-skills': {
    slug: 'code-three/developer-skills',
    title: 'What Developers Must Master',
    description: 'The critical skills for Code 3.0 — writing agent-friendly code, understanding tokens, and managing context windows.',
    content: `## Skills for the Code 3.0 Era

The skills that made developers effective in Code 1.0 (typing speed, syntax memorization, framework knowledge) are being commoditized. Code 3.0 demands a new set of competencies.

### 1. Writing Clean, Structured Code That Acts as a Template

AI agents read your codebase to understand conventions, patterns, and architecture. Your code is not just instructions for a computer — it is a prompt for AI.

**What agents need from your code:**

- **Consistent patterns** — if every service follows the same structure, the agent replicates it correctly
- **Descriptive names** — \`calculateOrderTotal\` tells the agent what to generate. \`calc\` does not.
- **Type annotations** — types are the single most valuable signal for AI code generation
- **Clear module boundaries** — small, focused files are easier for agents to reason about than 2000-line files
- **Doc comments on non-obvious logic** — explain the why, not the what

\`\`\`typescript
// BAD: Agent will struggle to extend this
function proc(d: any) {
  const r = d.items.reduce((a: number, i: any) => a + i.p * i.q, 0)
  return r > 100 ? r * 0.9 : r
}

// GOOD: Agent can replicate this pattern for new features
interface OrderItem {
  productId: string
  price: number
  quantity: number
}

/**
 * Calculates the total for an order.
 * Applies a 10% bulk discount when the subtotal exceeds $100.
 */
function calculateOrderTotal(items: OrderItem[]): number {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const BULK_DISCOUNT_THRESHOLD = 100
  const BULK_DISCOUNT_RATE = 0.1

  return subtotal > BULK_DISCOUNT_THRESHOLD
    ? subtotal * (1 - BULK_DISCOUNT_RATE)
    : subtotal
}
\`\`\`

### 2. Understanding Tokens

Tokens are the atomic units that LLMs process. Every interaction with an AI model is measured in tokens — and tokens determine both cost and capability.

**Key facts:**

- 1 token ≈ 4 characters in English, or roughly ¾ of a word
- \`calculateOrderTotal\` is 4 tokens. \`calc\` is 1 token. But the longer name saves the AI from guessing.
- A typical TypeScript file is 200-500 tokens
- GPT-4 costs roughly $10-30 per million input tokens

**Why it matters:**

- **Cost** — sending your entire codebase as context for every request gets expensive fast
- **Quality** — more relevant context = better output. But irrelevant context = noise that degrades output.
- **Latency** — more tokens = slower response. Time-to-first-token matters for developer experience.

### 3. Managing Context Windows

The context window is the maximum number of tokens a model can process in a single request. It includes both the input (your prompt + context) and the output (the model's response).

| Model | Context Window |
|---|---|
| GPT-4o | 128K tokens |
| Claude 3.5 Sonnet | 200K tokens |
| Gemini 2.0 | 1M tokens |

**A 128K context window sounds massive, but:**

- A medium codebase (50 files × 300 tokens) = 15K tokens just for code
- System prompt + conversation history = 2-5K tokens
- The model's response uses part of the window
- Quality degrades with very long contexts — models pay more attention to the beginning and end

### Context Management Strategies

\`\`\`mermaid
flowchart TD
    A[User Request] --> B[Retrieve Relevant Files]
    B --> C[Rank by Relevance]
    C --> D[Trim to Token Budget]
    D --> E[Build Prompt]
    E --> F[Send to Model]
\`\`\`

**Effective context management:**

1. **Include only relevant files** — the agent should not see your entire codebase for a CSS change
2. **Summarize large files** — send the function signatures and types, not 500 lines of implementation
3. **Prioritize recent context** — the conversation turns closest to the current request matter most
4. **Use retrieval** — embed your codebase and retrieve only the relevant chunks for each request

### 4. Evaluating AI Output

In Code 3.0, the developer's primary job is evaluation. You need to assess AI-generated code for:

- **Correctness** — does it do what was asked?
- **Security** — does it introduce vulnerabilities?
- **Performance** — is it efficient or is it O(n³) when O(n) exists?
- **Consistency** — does it follow the codebase conventions?
- **Completeness** — does it handle edge cases and errors?

:::tip
Treat every AI-generated change like a PR from a very fast junior developer. They are productive and eager, but they need a thorough code review. Never merge without reading.
:::

### 5. Designing for Agent Iteration

Code 3.0 applications are built iteratively with agents. This means:

- **Write good tests first** — agents use test results as feedback signals
- **Use CI/CD rigorously** — automated checks catch agent mistakes
- **Keep PRs small** — agents work better with focused, well-scoped tasks
- **Log everything** — when an agent makes a mistake, you need to understand why
- **Version your prompts** — prompts are code. Treat them with the same rigor.
`,
  },
}
