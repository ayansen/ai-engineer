import type { DocsContentMap } from './types'

export const referencesContent: DocsContentMap = {
  'references/reading-list': {
    slug: 'references/reading-list',
    title: 'Reading List',
    description: 'A curated collection of high-quality references on AI engineering, prompt engineering, agent design, evaluations, and AI native product strategy.',
    content: `## AI Engineering Foundations

Essential reading for developers building with AI.

- **[Building LLM Apps](https://www.oreilly.com/library/view/building-llm-apps/9781835462317/)** by Valentina Alto — Practical guide to building production LLM applications, covering RAG, agents, and deployment.

- **[AI Engineering](https://www.oreilly.com/library/view/ai-engineering/9781098166298/)** by Chip Huyen — Comprehensive guide covering the full stack of AI engineering from model selection to production monitoring.

- **[What We Learned from a Year of Building with LLMs](https://www.oreilly.com/radar/what-we-learned-from-a-year-of-building-with-llms-part-i/)** by Eugene Yan et al. — Lessons learned from production LLM systems at scale.

- **[The AI Engineer](https://www.latent.space/p/ai-engineer)** by Swyx — The original essay defining the AI engineer role and why it matters.

## Prompt Engineering

Techniques for getting consistent, high-quality results from LLMs.

- **[Prompt Engineering Guide](https://www.promptingguide.ai/)** by DAIR.AI — The most comprehensive open-source guide to prompt engineering techniques, from basics to advanced.

- **[OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)** — Official best practices from OpenAI, with practical examples.

- **[Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)** — Claude-specific techniques with detailed examples of system prompts, chain-of-thought, and structured output.

- **[Google Prompt Engineering Guide](https://ai.google.dev/gemini-api/docs/prompting-strategies)** — Gemini-specific strategies with practical examples.

## Agent Design Patterns

Architecture and patterns for building reliable AI agents.

- **[Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)** by Anthropic — Practical patterns for agent construction including tool use, error recovery, and multi-step reasoning.

- **[LangGraph Documentation](https://langchain-ai.github.io/langgraph/)** — Framework for building stateful, multi-step agent workflows with cycles and branching.

- **[OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)** — Definitive guide to function calling, the foundation of tool use in agents.

- **[The Agent Loop](https://blog.langchain.dev/what-is-an-agent/)** by LangChain — Explanation of the core agent loop pattern and how it differs from simple chains.

- **[AI Agents That Matter](https://arxiv.org/abs/2407.01502)** by Kapoor et al. — Research paper on evaluating agent performance meaningfully, avoiding common benchmarking pitfalls.

## Evaluations

Testing and measuring AI system quality.

- **[OpenAI Evals Framework](https://github.com/openai/evals)** — Open-source framework for evaluating LLM outputs, including examples and best practices.

- **[Braintrust AI Eval Guide](https://www.braintrust.dev/docs/guides/evals)** — Practical guide to building eval suites with scoring functions and regression tracking.

- **[How to Evaluate LLMs](https://hamel.dev/blog/posts/evals/)** by Hamel Husain — Pragmatic approach to evals, focused on what actually works in production.

- **[LLM-as-Judge](https://arxiv.org/abs/2306.05685)** by Zheng et al. — Research on using LLMs to evaluate other LLMs, including calibration and bias analysis.

## AI Native Product Strategy

Thinking about AI as a product, not just a technology.

- **[Why AI Native Matters](https://a16z.com/ai-native-apps/)** by Andreessen Horowitz — Analysis of what makes AI native products different and why they win.

- **[The AI-First Product Playbook](https://www.lennysnewsletter.com/p/how-to-build-ai-first-products)** by Lenny Rachitsky — Interviews with founders building AI native products, with concrete lessons.

- **[Generative AI Design Patterns](https://pair.withgoogle.com/guidebook/)** by Google PAIR — UX design patterns for AI products, covering uncertainty, trust, and user control.

- **[Building AI Products](https://buildingaiproducts.com/)** by Aman Khan — Framework for product managers and engineers building AI-powered features.

## Tools & Frameworks

Key tools in the AI engineering ecosystem.

| Tool | Category | Description |
|---|---|---|
| **[LangChain](https://langchain.com/)** | Agent framework | Popular framework for chaining LLM calls, tools, and agents |
| **[LangGraph](https://langchain-ai.github.io/langgraph/)** | Agent orchestration | Stateful agent workflows with cycles and persistence |
| **[CopilotKit](https://copilotkit.ai/)** | Agentic UI | React components for building AI-powered interfaces |
| **[Vercel AI SDK](https://sdk.vercel.ai/)** | Streaming | TypeScript SDK for streaming AI responses in web apps |
| **[OpenAI API](https://platform.openai.com/)** | Model API | GPT-4, function calling, embeddings, and fine-tuning |
| **[Anthropic API](https://docs.anthropic.com/)** | Model API | Claude models with extended context and tool use |
| **[Braintrust](https://www.braintrust.dev/)** | Evals | Platform for evaluating and improving AI outputs |
| **[Helicone](https://helicone.ai/)** | Observability | LLM request logging, cost tracking, and analytics |
| **[Pinecone](https://pinecone.io/)** | Vector DB | Managed vector database for RAG and semantic search |
| **[Chroma](https://trychroma.com/)** | Vector DB | Open-source embedding database for local development |

## Key Blogs & Newsletters

Stay current with the field.

- **[Latent Space](https://www.latent.space/)** — The AI engineer podcast and newsletter by Swyx and Alessio.
- **[Simon Willison's Blog](https://simonwillison.net/)** — Prolific coverage of LLM tools, techniques, and experiments.
- **[Hamel's Blog](https://hamel.dev/)** — Practical AI engineering with a focus on evals and production systems.
- **[The Batch by Andrew Ng](https://www.deeplearning.ai/the-batch/)** — Weekly AI news digest with accessible explanations.
- **[Lenny's Newsletter](https://www.lennysnewsletter.com/)** — Product strategy with increasing AI native coverage.

:::tip
Do not try to read everything. Start with "Building Effective Agents" by Anthropic and the "Prompt Engineering Guide" by DAIR.AI. These two resources cover 80% of what you need to build your first production agent.
:::
`,
  },
}
