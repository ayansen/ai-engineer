import type { DocsContentMap } from './types'

export const agentsContent: DocsContentMap = {
  'agents/overview': {
    slug: 'agents/overview',
    title: 'AI Agents Overview',
    description: 'Learn what AI agents are, how the agent loop works, and the different types of agents used in modern AI systems.',
    content: `## What Are AI Agents?

An **AI agent** is a system that perceives its environment, makes decisions, and takes actions to achieve a goal — autonomously, across multiple steps. Unlike a simple chatbot that responds to a single prompt, an agent can plan, use tools, reflect on results, and iterate until it accomplishes a complex objective.

> "An agent is anything that can be viewed as perceiving its environment through sensors and acting upon that environment through actuators." — Russell & Norvig, *Artificial Intelligence: A Modern Approach*

---

## The Agent Loop: Perceive → Think → Act

Every agent, regardless of complexity, operates on a fundamental loop:

1. **Perceive** — Receive input from the environment (user message, tool output, observation)
2. **Think** — Reason about the input using an LLM or planning algorithm
3. **Act** — Execute an action (call a tool, write output, ask a clarifying question)
4. **Observe** — Receive the result of the action
5. **Repeat** — Feed the observation back into step 1 until the goal is met

\`\`\`
┌─────────────┐
│  Environment │
└──────┬───────┘
       │ Perception
       ▼
┌─────────────┐     ┌─────────────┐
│    Think     │────▶│     Act     │
│  (LLM/Plan) │     │  (Tool/API) │
└─────────────┘     └──────┬──────┘
       ▲                    │ Observation
       └────────────────────┘
\`\`\`

---

## Types of Agents

### Reactive Agents
Reactive agents map perceptions directly to actions with no internal state or planning. They are fast and predictable but limited to simple, well-defined tasks.

- **Example:** A rule-based customer support bot that matches keywords to canned responses.
- **Pros:** Fast, deterministic, low cost
- **Cons:** No memory, cannot handle novel situations

### Planning Agents
Planning agents decompose goals into sub-tasks, reason about dependencies, and sequence actions accordingly. Modern LLM-powered agents typically fall into this category.

- **Example:** An agent that, given "book me a flight to Paris", searches flights, checks availability, compares prices, and fills a booking form.
- **Pros:** Handles complex, multi-step tasks; adaptable
- **Cons:** Slower, more expensive, can fail with ambiguous goals

### Learning Agents
Learning agents improve over time using feedback (e.g., reinforcement learning, fine-tuning on past trajectories). They adapt to new patterns without explicit reprogramming.

- **Example:** AlphaCode, which learns to write better code by self-play and human feedback.
- **Pros:** Continuously improves; handles distribution shifts
- **Cons:** Requires significant training data and compute

---

## Agent vs. Chatbot

| Feature | Chatbot | AI Agent |
|---|---|---|
| Memory | Single-turn or short context | Persistent, multi-session |
| Tool use | Rarely | Core capability |
| Goal orientation | Respond to prompt | Accomplish multi-step task |
| Autonomy | Low (one-shot) | High (self-directed loop) |
| Error recovery | None | Can retry and reflect |

A **chatbot** answers questions. An **agent** gets things done.

---

## Real-World Agent Applications

- **Software engineering:** GitHub Copilot Workspace, Devin — agents that read issues, write code, run tests, and open PRs
- **Research:** Agents that search the web, read papers, synthesize findings, and produce reports
- **Data analysis:** Agents that query databases, generate visualizations, and explain insights
- **Customer operations:** Agents that look up orders, process refunds, and escalate issues
- **DevOps:** Agents that monitor alerts, diagnose root causes, and apply remediations

---

## Key Concepts to Know

- **Grounding:** Connecting the LLM to real-world data via tools (search, databases)
- **Tool calling:** The mechanism by which agents invoke external capabilities
- **Orchestration:** Managing multiple agents or steps in a workflow
- **Memory:** How agents retain context across turns or sessions
- **Human-in-the-loop:** Inserting human review or approval at critical decision points

As you progress through this section, you'll explore frameworks, tool use, multi-agent systems, and workflow patterns that bring these concepts to life.
`,
  },

  'agents/frameworks': {
    slug: 'agents/frameworks',
    title: 'Agent Frameworks',
    description: 'Compare LangChain, LlamaIndex, AutoGen, CrewAI, LangGraph, and Semantic Kernel — when to use each framework and how they differ.',
    content: `## Agent Frameworks Landscape

Building an AI agent from scratch is possible, but frameworks dramatically reduce boilerplate, provide battle-tested abstractions, and offer integrations with hundreds of tools and LLM providers. This page compares the leading frameworks as of 2024–2025.

---

## LangChain Agents

**LangChain** is the most widely adopted framework. Its agent abstraction wraps an LLM with a tool-use loop and supports dozens of built-in tools (web search, Python REPL, SQL, vector stores).

\`\`\`python
from langchain import hub
from langchain.agents import AgentExecutor, create_react_agent
from langchain_openai import ChatOpenAI
from langchain_community.tools import DuckDuckGoSearchRun

llm = ChatOpenAI(model="gpt-4o", temperature=0)
tools = [DuckDuckGoSearchRun()]
prompt = hub.pull("hwchase17/react")

agent = create_react_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

result = executor.invoke({"input": "What is the latest version of Python?"})
print(result["output"])
\`\`\`

**When to use LangChain:**
- You need broad ecosystem support and many pre-built integrations
- Your team is already familiar with LangChain's abstractions
- You want quick prototyping with LCEL (LangChain Expression Language)

---

## LlamaIndex Agents

**LlamaIndex** excels at **data-centric agents** — systems that reason over large document corpora, structured data, or heterogeneous knowledge sources.

\`\`\`python
from llama_index.core.agent import ReActAgent
from llama_index.core.tools import FunctionTool
from llama_index.llms.openai import OpenAI

def multiply(a: float, b: float) -> float:
    """Multiplies two numbers and returns the result."""
    return a * b

multiply_tool = FunctionTool.from_defaults(fn=multiply)
llm = OpenAI(model="gpt-4o")
agent = ReActAgent.from_tools([multiply_tool], llm=llm, verbose=True)

response = agent.chat("What is 7 times 49?")
\`\`\`

**When to use LlamaIndex:**
- RAG-heavy applications with rich document retrieval
- You need fine-grained control over indexing and querying strategies
- Building query engines over structured/unstructured data

---

## AutoGen

**AutoGen** (by Microsoft) is built for **multi-agent conversations**. Agents talk to each other via a message-passing protocol, with support for human-in-the-loop participation.

\`\`\`python
import autogen

config_list = [{"model": "gpt-4o", "api_key": "..."}]

assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config={"config_list": config_list},
)
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    code_execution_config={"work_dir": "coding"},
)

user_proxy.initiate_chat(
    assistant,
    message="Write a Python script to fetch and plot BTC price data.",
)
\`\`\`

**When to use AutoGen:**
- Multi-agent collaboration (coder + reviewer + tester)
- Automated code generation and execution pipelines
- Research workflows requiring agent debate or critique

---

## CrewAI

**CrewAI** provides a high-level abstraction around **agent roles and tasks**, making it natural to define a "crew" of specialized agents working toward a shared goal.

\`\`\`python
from crewai import Agent, Task, Crew

researcher = Agent(
    role="Senior Research Analyst",
    goal="Uncover cutting-edge developments in AI",
    backstory="You are an expert at finding and synthesizing AI research.",
    verbose=True,
)
writer = Agent(
    role="Tech Content Strategist",
    goal="Craft compelling content on tech advancements",
    backstory="You transform complex AI concepts into engaging narratives.",
    verbose=True,
)

research_task = Task(
    description="Research the latest AI agent frameworks released in 2024",
    agent=researcher,
    expected_output="A bullet-point summary of new frameworks and key features",
)
write_task = Task(
    description="Write a blog post based on the research findings",
    agent=writer,
    expected_output="A 500-word blog post ready for publication",
)

crew = Crew(agents=[researcher, writer], tasks=[research_task, write_task])
result = crew.kickoff()
\`\`\`

**When to use CrewAI:**
- Role-playing multi-agent pipelines
- Content generation, research, or analysis with distinct agent personas
- You want a simple, declarative API for multi-agent coordination

---

## LangGraph

**LangGraph** (part of the LangChain ecosystem) models agent workflows as **directed graphs** (nodes = logic steps, edges = transitions). It excels at complex, stateful workflows with branching, loops, and human checkpoints.

\`\`\`python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    messages: list
    next_step: str

def call_llm(state: AgentState) -> AgentState:
    # Call LLM and append response
    ...

def call_tool(state: AgentState) -> AgentState:
    # Execute tool
    ...

def should_continue(state: AgentState) -> str:
    return "tool" if state["next_step"] == "tool" else END

workflow = StateGraph(AgentState)
workflow.add_node("llm", call_llm)
workflow.add_node("tool", call_tool)
workflow.add_edge("tool", "llm")
workflow.add_conditional_edges("llm", should_continue)
workflow.set_entry_point("llm")

app = workflow.compile()
\`\`\`

**When to use LangGraph:**
- Complex workflows requiring stateful, cyclic graphs
- Human-in-the-loop checkpoints
- Debugging and tracing execution at every node

---

## Semantic Kernel

**Semantic Kernel** (Microsoft) is designed for **enterprise .NET and Python** applications, integrating natively with Azure OpenAI, Microsoft 365, and enterprise plugin ecosystems.

**When to use Semantic Kernel:**
- Enterprise environments with Microsoft/Azure stack
- You need native C# / .NET support
- Integrating with Office 365, Teams, or Azure services

---

## Framework Comparison

| Framework | Best For | Multi-Agent | Stateful Graphs | Enterprise |
|---|---|---|---|---|
| LangChain | General-purpose agents | ✓ | Via LangGraph | ✓ |
| LlamaIndex | Data/RAG-centric agents | ✓ | Limited | ✓ |
| AutoGen | Agent conversation loops | ✓✓ | Limited | ✓ |
| CrewAI | Role-based crews | ✓✓ | Limited | — |
| LangGraph | Complex stateful workflows | ✓ | ✓✓ | ✓ |
| Semantic Kernel | Enterprise / Azure | ✓ | ✓ | ✓✓ |

Choose based on your data access patterns, workflow complexity, and team expertise.
`,
  },

  'agents/tool-use': {
    slug: 'agents/tool-use',
    title: 'Tool Use & Function Calling',
    description: 'Learn how agents use tools via OpenAI function calling, how to define tool schemas, and how to implement custom tools for web search, code execution, file systems, and APIs.',
    content: `## Why Tools Matter

A large language model on its own cannot browse the web, run code, query a database, or call an API. **Tools** bridge this gap — they are functions the model can invoke to interact with the real world. Tool use transforms an LLM from a text predictor into an action-taking agent.

---

## OpenAI Function Calling

OpenAI's function calling API lets you describe functions in a structured JSON schema. The model decides when to call a function and returns a structured JSON payload — your application executes the function and feeds the result back.

### Defining a Tool Schema

\`\`\`python
import openai, json

client = openai.OpenAI()

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "City name, e.g. 'London'"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "Temperature unit"
                    }
                },
                "required": ["city"]
            }
        }
    }
]

messages = [{"role": "user", "content": "What's the weather in Tokyo?"}]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
    tool_choice="auto",
)

tool_call = response.choices[0].message.tool_calls[0]
print(tool_call.function.name)       # get_weather
print(tool_call.function.arguments)  # {"city": "Tokyo"}
\`\`\`

### Completing the Tool Call Loop

\`\`\`python
def get_weather(city: str, unit: str = "celsius") -> dict:
    # In production, call a real weather API
    return {"city": city, "temperature": 18, "unit": unit, "condition": "Cloudy"}

args = json.loads(tool_call.function.arguments)
result = get_weather(**args)

# Append assistant message and tool result, then get final response
messages.append(response.choices[0].message)
messages.append({
    "role": "tool",
    "tool_call_id": tool_call.id,
    "content": json.dumps(result),
})

final = client.chat.completions.create(model="gpt-4o", messages=messages)
print(final.choices[0].message.content)
# "The current weather in Tokyo is 18°C and cloudy."
\`\`\`

---

## Implementing Custom Tools

### Web Search Tool

\`\`\`python
import requests

def web_search(query: str, num_results: int = 5) -> list[dict]:
    """Search the web and return a list of results with title and snippet."""
    url = "https://api.search.example.com/search"
    response = requests.get(url, params={"q": query, "n": num_results})
    data = response.json()
    return [{"title": r["title"], "url": r["url"], "snippet": r["snippet"]}
            for r in data["results"]]
\`\`\`

### Code Execution Tool

\`\`\`python
import subprocess, textwrap

def execute_python(code: str, timeout: int = 10) -> dict:
    """Execute Python code in a sandboxed subprocess and return stdout/stderr."""
    result = subprocess.run(
        ["python3", "-c", textwrap.dedent(code)],
        capture_output=True,
        text=True,
        timeout=timeout,
    )
    return {
        "stdout": result.stdout,
        "stderr": result.stderr,
        "returncode": result.returncode,
    }
\`\`\`

> ⚠️ Always sandbox code execution. Use Docker, Firecracker, or E2B for production safety.

### File System Tool

\`\`\`python
from pathlib import Path

def read_file(path: str) -> str:
    """Read a text file and return its contents."""
    p = Path(path)
    if not p.exists():
        return f"Error: {path} does not exist"
    return p.read_text(encoding="utf-8")

def write_file(path: str, content: str) -> str:
    """Write content to a file, creating directories as needed."""
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    return f"Successfully wrote {len(content)} characters to {path}"
\`\`\`

### REST API Tool

\`\`\`python
import requests

def call_api(method: str, url: str, headers: dict = None, body: dict = None) -> dict:
    """Make an HTTP request to any REST API."""
    resp = requests.request(method.upper(), url, headers=headers, json=body, timeout=15)
    return {
        "status_code": resp.status_code,
        "body": resp.json() if resp.headers.get("content-type", "").startswith("application/json") else resp.text,
    }
\`\`\`

---

## Tool Schema Best Practices

A well-designed schema dramatically improves tool selection accuracy:

| Practice | Bad | Good |
|---|---|---|
| Description | "Search" | "Search the web for up-to-date information on a topic" |
| Parameter names | \`q\` | \`search_query\` |
| Enums for fixed options | \`unit: string\` | \`unit: enum ["celsius","fahrenheit"]\` |
| Required vs optional | All required | Only truly required fields marked |
| Description on each param | Missing | Always present |

---

## Tool Selection Strategies

Agents choose tools via several mechanisms:

- **Auto (default):** The LLM reads all tool descriptions and picks the most relevant one
- **Forced tool:** Set \`tool_choice: {"type": "function", "function": {"name": "..."}}\` to require a specific tool
- **Parallel tool calls:** GPT-4o can invoke multiple tools simultaneously in one turn
- **Tool routing:** A lightweight classifier LLM routes to the correct tool before the main agent call

\`\`\`python
# Parallel tool calls — both tools invoked in one model call
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "What's the weather in Paris and Berlin?"}],
    tools=tools,
    tool_choice="auto",
)
# response.choices[0].message.tool_calls will have TWO entries
for tc in response.choices[0].message.tool_calls:
    print(tc.function.name, tc.function.arguments)
\`\`\`

---

## Tool Use Checklist

- [ ] Every tool has a clear, specific description
- [ ] Parameter names and descriptions are unambiguous
- [ ] Tool outputs are serializable to JSON strings
- [ ] Error cases return structured error messages (not raw exceptions)
- [ ] Code execution is sandboxed
- [ ] Tools have sensible timeouts and retries
- [ ] Sensitive tools (write_file, call_api) require confirmation or scope limits
`,
  },

  'agents/multi-agent': {
    slug: 'agents/multi-agent',
    title: 'Multi-Agent Systems',
    description: 'Understand why multi-agent architectures are powerful, explore agent roles, communication patterns, and see real examples with CrewAI and AutoGen.',
    content: `## Why Multi-Agent?

A single LLM agent calling tools can accomplish a lot, but it struggles with:

- **Long-horizon tasks** that exceed context window limits
- **Parallelism** — a single agent works sequentially
- **Specialization** — one generalist agent is worse than several domain experts
- **Error checking** — a single agent cannot meaningfully review its own output

Multi-agent systems solve these problems by distributing work across coordinated agents, each with a focused role.

---

## Agent Roles

### Orchestrator (Planner)
The orchestrator receives the top-level goal, decomposes it into sub-tasks, delegates to worker agents, and synthesizes the final result. It typically does **not** do the work itself.

### Worker (Executor)
Workers receive atomic sub-tasks and execute them — writing code, performing searches, generating content. A worker is optimized for one type of task (e.g., "code writer", "data analyst").

### Critic (Reviewer)
A critic agent reviews the output of workers, identifies errors, and requests corrections. Critic loops significantly improve output quality, especially for code and factual content.

### Tool Agent
Specialized agents that wrap one or more tools (e.g., a "Browser Agent" that only does web navigation). Other agents call them via a shared message bus.

---

## Communication Patterns

### Sequential (Pipeline)
Each agent's output becomes the next agent's input. Simple and predictable.

\`\`\`
Researcher → Writer → Editor → Publisher
\`\`\`

### Parallel (Fan-Out / Fan-In)
The orchestrator fans out sub-tasks to multiple workers simultaneously, then aggregates results.

\`\`\`
                ┌── Worker A (section 1) ──┐
Orchestrator ───┼── Worker B (section 2) ──┼── Aggregator
                └── Worker C (section 3) ──┘
\`\`\`

### Hierarchical
Orchestrators can themselves be managed by higher-level orchestrators, enabling deep task decomposition.

### Debate / Critique Loop
Multiple agents produce independent answers; a judge agent selects or synthesizes the best response.

---

## CrewAI Example: Research & Writing Crew

\`\`\`python
from crewai import Agent, Task, Crew, Process

researcher = Agent(
    role="AI Research Specialist",
    goal="Find accurate, up-to-date information on assigned topics",
    backstory="Expert at finding primary sources, filtering noise, and summarizing research.",
    allow_delegation=False,
    verbose=True,
)

writer = Agent(
    role="Technical Writer",
    goal="Transform research into clear, accurate technical documentation",
    backstory="Skilled at writing developer-facing documentation with code examples.",
    allow_delegation=False,
    verbose=True,
)

critic = Agent(
    role="Quality Reviewer",
    goal="Identify factual errors, unclear explanations, and missing information",
    backstory="Detail-oriented editor with deep technical knowledge.",
    allow_delegation=True,
    verbose=True,
)

research_task = Task(
    description="Research LangGraph: key features, use cases, and example code patterns",
    expected_output="A structured brief: overview, 5 key features, 2 code snippets, 3 use cases",
    agent=researcher,
)

write_task = Task(
    description="Write a 600-word technical article based on the research brief",
    expected_output="Polished markdown article with intro, sections, and conclusion",
    agent=writer,
    context=[research_task],
)

review_task = Task(
    description="Review the article for accuracy, completeness, and code correctness",
    expected_output="List of corrections or 'APPROVED' if no changes needed",
    agent=critic,
    context=[write_task],
)

crew = Crew(
    agents=[researcher, writer, critic],
    tasks=[research_task, write_task, review_task],
    process=Process.sequential,
    verbose=2,
)

result = crew.kickoff()
print(result)
\`\`\`

---

## AutoGen Example: Code Generation with Review

\`\`\`python
import autogen

config_list = [{"model": "gpt-4o", "api_key": "YOUR_KEY"}]
llm_config = {"config_list": config_list, "cache_seed": 42}

engineer = autogen.AssistantAgent(
    name="Engineer",
    system_message="You are a senior Python engineer. Write clean, tested code.",
    llm_config=llm_config,
)

reviewer = autogen.AssistantAgent(
    name="Reviewer",
    system_message="""You are a code reviewer. Review for:
    - Correctness and edge cases
    - Security vulnerabilities
    - PEP 8 compliance
    Reply APPROVED if the code is ready, otherwise list issues.""",
    llm_config=llm_config,
)

user_proxy = autogen.UserProxyAgent(
    name="UserProxy",
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    code_execution_config={"work_dir": "agent_workspace", "use_docker": False},
)

# Start a group chat between engineer and reviewer
groupchat = autogen.GroupChat(
    agents=[user_proxy, engineer, reviewer],
    messages=[],
    max_round=8,
)
manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=llm_config)

user_proxy.initiate_chat(
    manager,
    message="Write a Python function to parse and validate JSON Web Tokens (JWT) without external libraries.",
)
\`\`\`

---

## Challenges in Multi-Agent Systems

| Challenge | Description | Mitigation |
|---|---|---|
| Coordination overhead | Agents spend tokens managing handoffs | Keep agent count small; use hierarchical orchestration |
| Infinite loops | Agents ping-pong without resolution | Set max_rounds; use termination conditions |
| Context fragmentation | Each agent has partial knowledge | Share structured state; use a shared memory store |
| Cost accumulation | Many LLM calls multiply quickly | Use cheaper models for critic/routing; cache results |
| Debugging complexity | Hard to trace failures across agents | Log all messages; use LangSmith or Phoenix tracing |

---

## When to Use Multi-Agent

✅ Use multi-agent when:
- The task naturally decomposes into parallel sub-tasks
- Output quality requires independent review
- Different task phases require different expertise (research vs. writing vs. coding)
- The task exceeds a single agent's context window

❌ Avoid multi-agent when:
- A single agent with good tools can complete the task
- Latency is critical (multi-agent adds round trips)
- Budget is tight (each agent call costs tokens)
`,
  },

  'agents/workflows': {
    slug: 'agents/workflows',
    title: 'Agentic Workflows & Patterns',
    description: 'Explore agentic workflow patterns including ReAct, Plan-and-Execute, Reflection, and Self-Ask, plus LangGraph for stateful graphs, human-in-the-loop, and memory systems.',
    content: `## Agentic Workflow Patterns

An **agentic workflow** is a structured approach to how an agent reasons and acts. The right pattern depends on task complexity, the need for verification, and available compute budget.

---

## ReAct (Reason + Act)

**ReAct** interleaves reasoning traces with tool calls. The agent alternates between thinking out loud ("Thought") and acting ("Action"), making its reasoning transparent and debuggable.

\`\`\`
Thought: I need to find the population of Tokyo.
Action: web_search("Tokyo population 2024")
Observation: Tokyo's population is approximately 13.96 million (city proper).
Thought: I have the answer.
Final Answer: Tokyo's population is approximately 13.96 million.
\`\`\`

\`\`\`python
from langchain import hub
from langchain.agents import create_react_agent, AgentExecutor
from langchain_openai import ChatOpenAI
from langchain_community.tools import DuckDuckGoSearchRun

llm = ChatOpenAI(model="gpt-4o")
tools = [DuckDuckGoSearchRun()]
prompt = hub.pull("hwchase17/react")

agent = create_react_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True, max_iterations=6)

result = executor.invoke({"input": "What is the GDP of Singapore in 2023?"})
\`\`\`

**Best for:** Open-ended research, Q&A with tool use, tasks where intermediate steps are unknown upfront.

---

## Plan-and-Execute

The agent first creates a **full plan** (list of steps), then executes each step sequentially. Planning and execution are decoupled, enabling better long-horizon reasoning.

\`\`\`python
from langchain_experimental.plan_and_execute import (
    PlanAndExecute, load_agent_executor, load_chat_planner
)
from langchain_openai import ChatOpenAI
from langchain_community.tools import DuckDuckGoSearchRun

llm = ChatOpenAI(model="gpt-4o")
tools = [DuckDuckGoSearchRun()]

planner = load_chat_planner(llm)
executor = load_agent_executor(llm, tools, verbose=True)
agent = PlanAndExecute(planner=planner, executor=executor, verbose=True)

agent.run("Write a comparison of React and Vue.js for a senior developer audience.")
\`\`\`

**Best for:** Multi-step tasks with known structure, report generation, research pipelines.

---

## Reflection & Self-Critique

The agent generates an initial response, then **reflects** on it — identifying errors, gaps, or improvements — and revises. This loop can repeat until a quality threshold is met.

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOpenAI(model="gpt-4o")

generate_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("human", "{task}"),
])

reflect_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a critical reviewer. Identify all errors and improvements."),
    ("human", "Original task: {task}\\n\\nDraft output:\\n{draft}\\n\\nList improvements:"),
])

revise_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Incorporate the feedback."),
    ("human", "Task: {task}\\n\\nDraft: {draft}\\n\\nFeedback: {feedback}\\n\\nRevised output:"),
])

task = "Write a Python function to find all prime numbers up to N using the Sieve of Eratosthenes."

draft = (generate_prompt | llm).invoke({"task": task}).content
feedback = (reflect_prompt | llm).invoke({"task": task, "draft": draft}).content
final = (revise_prompt | llm).invoke({"task": task, "draft": draft, "feedback": feedback}).content

print(final)
\`\`\`

**Best for:** Code generation, writing, any task where output quality is critical.

---

## Self-Ask with Search

The agent breaks a complex question into simpler follow-up questions, answering each with a search tool before synthesizing the final answer.

\`\`\`
Q: Who was older, Einstein or Niels Bohr?
Are follow up questions needed here: Yes.
Follow up: When was Albert Einstein born?
Intermediate answer: 1879.
Follow up: When was Niels Bohr born?
Intermediate answer: 1885.
So the final answer is: Albert Einstein was older (born 1879 vs 1885).
\`\`\`

---

## LangGraph for Stateful Workflows

**LangGraph** models workflows as directed graphs with persistent state — essential for complex agents that need to branch, loop, and checkpoint.

\`\`\`python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import ChatOpenAI
from typing import TypedDict, Annotated
import operator

class State(TypedDict):
    messages: Annotated[list, operator.add]
    iteration: int

llm = ChatOpenAI(model="gpt-4o")

def generate(state: State) -> State:
    response = llm.invoke(state["messages"])
    return {"messages": [response], "iteration": state["iteration"] + 1}

def reflect(state: State) -> State:
    system = "Review the last response. Reply 'DONE' if satisfactory, else provide feedback."
    feedback = llm.invoke([{"role": "system", "content": system}] + state["messages"])
    return {"messages": [feedback], "iteration": state["iteration"]}

def should_continue(state: State) -> str:
    last = state["messages"][-1].content
    if "DONE" in last or state["iteration"] >= 3:
        return END
    return "generate"

workflow = StateGraph(State)
workflow.add_node("generate", generate)
workflow.add_node("reflect", reflect)
workflow.add_edge("generate", "reflect")
workflow.add_conditional_edges("reflect", should_continue, {"generate": "generate", END: END})
workflow.set_entry_point("generate")

checkpointer = MemorySaver()
app = workflow.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "session-1"}}
result = app.invoke(
    {"messages": [{"role": "user", "content": "Explain gradient descent in simple terms."}], "iteration": 0},
    config=config,
)
\`\`\`

---

## Human-in-the-Loop

For high-stakes decisions, agents should pause and request human approval before proceeding.

\`\`\`python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

# interrupt_before tells LangGraph to pause before executing "risky_action"
workflow = StateGraph(State)
workflow.add_node("plan", plan_node)
workflow.add_node("risky_action", execute_node)
workflow.add_edge("plan", "risky_action")
workflow.set_entry_point("plan")

app = workflow.compile(
    checkpointer=MemorySaver(),
    interrupt_before=["risky_action"],  # Pause here for human review
)

thread = {"configurable": {"thread_id": "review-1"}}
app.invoke(initial_state, config=thread)

# Human reviews the plan, then resumes:
# app.invoke(None, config=thread)
\`\`\`

---

## Memory Systems

| Type | Description | Example Use Case | Implementation |
|---|---|---|---|
| **Short-term** | Within a single conversation turn | Maintaining chat history | In-context messages list |
| **Long-term** | Persisted across sessions | User preferences, past interactions | Vector DB (Pinecone, Chroma) |
| **Episodic** | Specific past events the agent can recall | "Last time you ran this query..." | Summarized session logs in vector store |
| **Semantic** | General world knowledge | Facts about the domain | RAG over knowledge base |
| **Procedural** | How to do things | Agent's tool usage patterns | Fine-tuning or few-shot examples |

\`\`\`python
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.memory import VectorStoreRetrieverMemory

embeddings = OpenAIEmbeddings()
vectorstore = Chroma(embedding_function=embeddings, persist_directory="./agent_memory")
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
memory = VectorStoreRetrieverMemory(retriever=retriever)

# Save an interaction
memory.save_context(
    {"input": "What database does our app use?"},
    {"output": "The app uses PostgreSQL 15 with pgvector for embeddings."},
)

# Retrieve relevant memories
relevant = memory.load_memory_variables({"prompt": "Tell me about our database setup"})
print(relevant["history"])
\`\`\`

---

## Choosing a Workflow Pattern

| Pattern | Complexity | Verification | Parallelism | Use When |
|---|---|---|---|---|
| ReAct | Low | None | No | Simple tool-use Q&A |
| Plan-and-Execute | Medium | None | Possible | Multi-step known tasks |
| Reflection | Medium | Self | No | Quality-critical output |
| Self-Ask | Medium | Via search | No | Complex factual Q&A |
| LangGraph | High | Any | Yes | Production, stateful agents |
`,
  },
}
