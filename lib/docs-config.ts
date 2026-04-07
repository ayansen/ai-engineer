export interface NavItem {
  title: string
  href?: string
  items?: NavItem[]
}

export const docsConfig: NavItem[] = [
  {
    title: "Raise the Bar",
    items: [
      { title: "The Art of Possible", href: "/docs/raise-the-bar/overview" },
      { title: "AI Application Categories", href: "/docs/raise-the-bar/categories" },
      { title: "AI Native Products", href: "/docs/raise-the-bar/ai-native-products" },
    ],
  },
  {
    title: "AI Native Applications",
    items: [
      { title: "Designing AI First", href: "/docs/ai-native/overview" },
      { title: "Agents in Workflows", href: "/docs/ai-native/agents-in-workflows" },
      { title: "Agent Orchestration", href: "/docs/ai-native/orchestration" },
    ],
  },
  {
    title: "Coding in the AI Era",
    items: [
      { title: "How Development Is Changing", href: "/docs/coding-ai-era/overview" },
      { title: "AI Assisted Coding", href: "/docs/coding-ai-era/ai-assisted-coding" },
      { title: "Prompt Engineering for Devs", href: "/docs/coding-ai-era/prompt-engineering" },
    ],
  },
  {
    title: "Code 3.0",
    items: [
      { title: "The Evolution of Code", href: "/docs/code-three/overview" },
      { title: "What Developers Must Master", href: "/docs/code-three/developer-skills" },
    ],
  },
  {
    title: "Building Agents",
    items: [
      { title: "Agents, Tools & Functions", href: "/docs/building-agents/overview" },
      { title: "Agentic vs Deterministic", href: "/docs/building-agents/agentic-vs-deterministic" },
      { title: "Testing with Evals", href: "/docs/building-agents/evals" },
      { title: "Agentic UI with CopilotKit", href: "/docs/building-agents/agentic-ui" },
    ],
  },
  {
    title: "References",
    items: [
      { title: "Reading List", href: "/docs/references/reading-list" },
    ],
  },
  {
    title: "Conclusion",
    items: [
      { title: "The Human Engineer", href: "/docs/conclusion/the-human-engineer" },
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
