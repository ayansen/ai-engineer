export interface NavItem {
  title: string
  href?: string
  items?: NavItem[]
}

export const docsConfig: NavItem[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Overview", href: "/docs/getting-started/overview" },
      { title: "What is AI Engineering?", href: "/docs/getting-started/what-is-ai-engineering" },
      { title: "Roadmap", href: "/docs/getting-started/roadmap" },
      { title: "Prerequisites", href: "/docs/getting-started/prerequisites" },
      { title: "Setup Your Environment", href: "/docs/getting-started/setup" },
    ],
  },
  {
    title: "Foundations",
    items: [
      { title: "Overview", href: "/docs/foundations/overview" },
      { title: "Python for AI", href: "/docs/foundations/python" },
      { title: "Mathematics for ML", href: "/docs/foundations/mathematics" },
      { title: "Machine Learning Basics", href: "/docs/foundations/ml-basics" },
      { title: "Deep Learning", href: "/docs/foundations/deep-learning" },
      { title: "Data Engineering", href: "/docs/foundations/data-engineering" },
    ],
  },
  {
    title: "LLMs & Generative AI",
    items: [
      { title: "Overview", href: "/docs/llms/overview" },
      { title: "How LLMs Work", href: "/docs/llms/how-llms-work" },
      { title: "Prompt Engineering", href: "/docs/llms/prompt-engineering" },
      { title: "Working with APIs", href: "/docs/llms/working-with-apis" },
      { title: "Fine-tuning Models", href: "/docs/llms/fine-tuning" },
      { title: "Evaluation", href: "/docs/llms/evaluation" },
    ],
  },
  {
    title: "RAG & Vector Databases",
    items: [
      { title: "Overview", href: "/docs/rag/overview" },
      { title: "Embeddings", href: "/docs/rag/embeddings" },
      { title: "Vector Databases", href: "/docs/rag/vector-databases" },
      { title: "Building a RAG System", href: "/docs/rag/building-rag" },
      { title: "Advanced RAG Techniques", href: "/docs/rag/advanced-rag" },
    ],
  },
  {
    title: "AI Agents",
    items: [
      { title: "Overview", href: "/docs/agents/overview" },
      { title: "Agent Frameworks", href: "/docs/agents/frameworks" },
      { title: "Tool Use & Function Calling", href: "/docs/agents/tool-use" },
      { title: "Multi-Agent Systems", href: "/docs/agents/multi-agent" },
      { title: "Agentic Workflows", href: "/docs/agents/workflows" },
    ],
  },
  {
    title: "MLOps & Deployment",
    items: [
      { title: "Overview", href: "/docs/mlops/overview" },
      { title: "Model Serving", href: "/docs/mlops/model-serving" },
      { title: "Monitoring & Observability", href: "/docs/mlops/monitoring" },
      { title: "CI/CD for AI", href: "/docs/mlops/cicd" },
      { title: "Cost Optimization", href: "/docs/mlops/cost-optimization" },
    ],
  },
  {
    title: "Projects",
    items: [
      { title: "Overview", href: "/docs/projects/overview" },
      { title: "Chatbot with Memory", href: "/docs/projects/chatbot" },
      { title: "Document QA System", href: "/docs/projects/document-qa" },
      { title: "AI Code Reviewer", href: "/docs/projects/code-reviewer" },
      { title: "Autonomous Research Agent", href: "/docs/projects/research-agent" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Books & Courses", href: "/docs/resources/books-and-courses" },
      { title: "Communities", href: "/docs/resources/communities" },
      { title: "Tools & Libraries", href: "/docs/resources/tools" },
      { title: "Newsletters & Blogs", href: "/docs/resources/newsletters" },
    ],
  },
]

export function flattenNavItems(items: NavItem[], parentHref = ""): { title: string; href: string }[] {
  const flat: { title: string; href: string }[] = []
  for (const item of items) {
    if (item.href) flat.push({ title: item.title, href: item.href })
    if (item.items) flat.push(...flattenNavItems(item.items))
  }
  return flat
}
