import type { DocsContentMap } from './types'

export const projectsContent: DocsContentMap = {
  'projects/overview': {
    slug: 'projects/overview',
    title: 'Projects Overview',
    description: 'Why build projects, how they map to skills, suggested order, portfolio tips, and what employers look for in AI engineers.',
    content: `# Projects Overview

Building hands-on projects is the fastest way to transition from understanding AI concepts to being employable as an AI engineer. Theory alone won't get you hired — employers want to see that you can ship working systems.

## Why Projects Matter

Reading about RAG pipelines and building one are completely different experiences. Projects force you to:

- **Debug real failures** — embeddings that don't cluster, retrievers that return irrelevant chunks, LLMs that hallucinate despite good context
- **Make architectural decisions** — which vector store, which chunking strategy, which model
- **Integrate systems** — APIs, databases, queues, frontends, and monitoring all have to work together
- **Iterate** — the first version never works well; projects teach you how to evaluate and improve

Employers specifically look for candidates who can articulate *why* they made a design choice, not just that they followed a tutorial.

## How Projects Map to Core Skills

| Project | Primary Skills | Secondary Skills |
|---|---|---|
| Chatbot with Memory | Conversation management, prompt engineering | State machines, session handling |
| Document Q&A | RAG, embeddings, vector stores | PDF parsing, chunking strategy |
| Code Reviewer | Structured output, tool integration | GitHub APIs, webhooks |
| Research Agent | Multi-agent systems, tool use | Web scraping, synthesis |

## Suggested Order

1. **Chatbot with Persistent Memory** — Start here. You'll build intuition for how LLMs manage state and why memory is hard. The feedback loop is tight: you can test in minutes.
2. **Document Q&A** — Extends the chatbot with retrieval. Introduces the most important architecture in production AI: RAG.
3. **Code Reviewer** — Introduces structured outputs and real-world API integration. A portfolio piece that demonstrates practical value.
4. **Research Agent** — The capstone. Combines everything: tools, memory, multi-step reasoning, and output synthesis.

## Portfolio Tips

### Show Your Thinking

The README matters as much as the code. Include:
- **Problem statement** — what are you solving and why is it hard?
- **Architecture diagram** — even a simple ASCII diagram shows systems thinking
- **Evaluation results** — did your RAG system improve over a naive baseline? By how much?
- **Failure modes** — what doesn't work well and why?

### Make It Interactive

Deploy a demo. Options:
- **Streamlit** for Python-native demos (fastest)
- **Hugging Face Spaces** for free hosting
- **Vercel** if you have a Next.js frontend
- **Modal** or **Railway** for backend APIs

Recruiters rarely clone and run code locally. A live URL gets 10× more engagement.

### Add Evaluation

Projects with evals stand out dramatically. Even a simple test set:

\`\`\`python
# Example eval harness
test_cases = [
    {"question": "What is the refund policy?", "expected_contains": "30 days"},
    {"question": "How do I cancel?", "expected_contains": "account settings"},
]

scores = []
for case in test_cases:
    answer = chain.invoke(case["question"])
    scores.append(case["expected_contains"].lower() in answer.lower())

print(f"Accuracy: {sum(scores)/len(scores):.0%}")
\`\`\`

## What Employers Look For

Based on common AI engineering job descriptions:

- **Production awareness** — logging, error handling, latency measurement
- **Cost consciousness** — not just "it works" but "it works within budget"
- **Iteration mindset** — evidence you improved something based on evaluation
- **Clear communication** — can you explain a complex system simply?

The projects in this curriculum are designed to check all four boxes. Build them in order, and by the end you'll have a portfolio that demonstrates real engineering judgment.
`,
  },

  'projects/chatbot': {
    slug: 'projects/chatbot',
    title: 'Chatbot with Persistent Memory',
    description: 'Build a chatbot with persistent memory using LangChain — covering conversation history, memory types, and personality via system prompts.',
    content: `# Chatbot with Persistent Memory

A chatbot that forgets everything after each message is barely useful. This project teaches you to build one that remembers — across turns, across sessions, and at scale.

## Architecture

\`\`\`
User Input
    │
    ▼
┌─────────────┐     ┌──────────────────┐
│  Chat UI    │────▶│  Memory Manager  │
└─────────────┘     └──────────────────┘
                            │
                    ┌───────┴───────┐
                    │               │
              ┌─────▼─────┐  ┌──────▼──────┐
              │  Short     │  │  Long Term  │
              │  Memory    │  │  Memory     │
              │ (Buffer)   │  │  (Vector)   │
              └─────┬─────┘  └──────┬──────┘
                    └───────┬───────┘
                            ▼
                    ┌───────────────┐
                    │   LLM Call    │
                    └───────┬───────┘
                            ▼
                       Response
\`\`\`

## Memory Types Explained

### Buffer Memory
Stores the raw conversation history as a list of messages. Simple, but hits token limits quickly.

\`\`\`python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    return_messages=True,
    memory_key="chat_history"
)
\`\`\`

**Use when:** Conversations are short (< 20 turns) and you need exact recall.

### Summary Memory
Summarizes older parts of the conversation to compress tokens while retaining gist.

\`\`\`python
from langchain.memory import ConversationSummaryBufferMemory
from langchain_openai import ChatOpenAI

memory = ConversationSummaryBufferMemory(
    llm=ChatOpenAI(model="gpt-4o-mini"),
    max_token_limit=500,
    return_messages=True
)
\`\`\`

**Use when:** Conversations can be long and perfect recall isn't required.

### Vector Memory
Embeds each turn and retrieves only the most relevant previous messages based on semantic similarity.

\`\`\`python
from langchain.memory import VectorStoreRetrieverMemory
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_texts(["init"], embedding=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

memory = VectorStoreRetrieverMemory(retriever=retriever)
\`\`\`

**Use when:** Users reference things said much earlier ("like I mentioned about my budget...").

## Full Implementation

### 1. Setup

\`\`\`bash
pip install langchain langchain-openai faiss-cpu python-dotenv streamlit
\`\`\`

\`\`\`bash
# .env
OPENAI_API_KEY=sk-...
\`\`\`

### 2. Core Chatbot Class

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationSummaryBufferMemory
from langchain.chains import ConversationChain
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """You are Aria, a knowledgeable and friendly AI assistant 
specializing in technology topics. You have a curious, enthusiastic personality 
and enjoy going deep on technical subjects. You remember previous parts of our 
conversation and reference them naturally when relevant.

Current conversation:
{history}
"""

class PersistentChatbot:
    def __init__(self, session_id: str, model: str = "gpt-4o-mini"):
        self.session_id = session_id
        self.llm = ChatOpenAI(model=model, temperature=0.7)
        self.memory = ConversationSummaryBufferMemory(
            llm=self.llm,
            max_token_limit=1000,
            return_messages=True,
            memory_key="history"
        )
        self.chain = ConversationChain(
            llm=self.llm,
            memory=self.memory,
            prompt=ChatPromptTemplate.from_messages([
                ("system", SYSTEM_PROMPT),
                MessagesPlaceholder(variable_name="history"),
                ("human", "{input}"),
            ]),
            verbose=False
        )

    def chat(self, user_message: str) -> str:
        return self.chain.predict(input=user_message)

    def get_history(self) -> list:
        return self.memory.chat_memory.messages

    def save_to_disk(self, path: str):
        import json
        messages = [
            {"type": m.type, "content": m.content}
            for m in self.get_history()
        ]
        with open(path, "w") as f:
            json.dump({"session_id": self.session_id, "messages": messages}, f)
\`\`\`

### 3. Session Persistence with Redis

For production, persist sessions across server restarts:

\`\`\`python
from langchain_community.chat_message_histories import RedisChatMessageHistory
from langchain.memory import ConversationBufferWindowMemory

def get_memory(session_id: str) -> ConversationBufferWindowMemory:
    history = RedisChatMessageHistory(
        session_id=session_id,
        url="redis://localhost:6379",
        ttl=86400  # 24 hours
    )
    return ConversationBufferWindowMemory(
        chat_memory=history,
        k=10,  # Keep last 10 turns in context
        return_messages=True
    )
\`\`\`

### 4. Streamlit UI

\`\`\`python
# app.py
import streamlit as st
from chatbot import PersistentChatbot
import uuid

st.title("Aria — AI Assistant")

if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())
if "chatbot" not in st.session_state:
    st.session_state.chatbot = PersistentChatbot(st.session_state.session_id)
if "messages" not in st.session_state:
    st.session_state.messages = []

for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.write(msg["content"])

if prompt := st.chat_input("Message Aria..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            response = st.session_state.chatbot.chat(prompt)
        st.write(response)

    st.session_state.messages.append({"role": "assistant", "content": response})
\`\`\`

\`\`\`bash
streamlit run app.py
\`\`\`

## Key Design Decisions

- **Summary over buffer for long sessions** — buffer memory will exceed context limits on GPT-4 after ~30 turns
- **Session IDs** — always identify sessions explicitly; never rely on in-process state for multi-user apps
- **Personality via system prompt** — well-crafted system prompts are the highest-leverage prompt engineering technique

## Extensions to Try

1. Add streaming responses with \`stream=True\` and \`st.write_stream()\`
2. Display the current memory summary in a sidebar
3. Add a "forget this conversation" button that clears Redis history
4. Implement user authentication and per-user memory isolation
`,
  },

  'projects/document-qa': {
    slug: 'projects/document-qa',
    title: 'Document Q&A System',
    description: 'Build a full RAG pipeline — PDF ingestion, chunking, embeddings, vector store retrieval, citation tracking, and a Streamlit UI.',
    content: `# Document Q&A System

Retrieval-Augmented Generation (RAG) is the most widely deployed AI architecture in production today. This project walks you through building a complete, production-quality Document Q&A system from scratch.

## System Architecture

\`\`\`
PDFs / Docs
    │
    ▼
┌───────────┐    ┌──────────┐    ┌─────────────┐
│  Loader   │───▶│  Chunker │───▶│  Embedder   │
└───────────┘    └──────────┘    └──────┬──────┘
                                        │
                                        ▼
                                 ┌─────────────┐
                                 │ Vector Store │
                                 │  (Chroma/   │
                                 │   Pinecone) │
                                 └──────┬──────┘
                                        │
User Query ─────────────────────────────┤
    │                                   │
    ▼                                   ▼
Embed Query              ┌──────────────────────────┐
    │                    │  Semantic Search (top-k) │
    └───────────────────▶└──────────────┬───────────┘
                                        │
                                        ▼
                              ┌──────────────────┐
                              │   LLM + Context  │
                              │  (with citations)│
                              └──────────────────┘
\`\`\`

## Step 1: PDF Ingestion

\`\`\`bash
pip install langchain langchain-openai langchain-community chromadb pypdf streamlit
\`\`\`

\`\`\`python
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from pathlib import Path

def load_documents(source_dir: str) -> list:
    """Load PDFs and markdown from a directory."""
    loaders = [
        DirectoryLoader(source_dir, glob="**/*.pdf", loader_cls=PyPDFLoader),
        DirectoryLoader(source_dir, glob="**/*.md", loader_cls=UnstructuredMarkdownLoader),
    ]
    documents = []
    for loader in loaders:
        documents.extend(loader.load())
    print(f"Loaded {len(documents)} document pages")
    return documents
\`\`\`

## Step 2: Chunking Strategy

Chunking is where most RAG systems fail. Chunks too large → noisy context. Chunks too small → missing context.

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

def chunk_documents(documents: list) -> list:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=512,
        chunk_overlap=64,
        separators=["\n\n", "\n", ". ", " ", ""],
        # Preserve metadata so we can cite sources
        add_start_index=True,
    )
    chunks = splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks from {len(documents)} pages")
    return chunks
\`\`\`

### Chunking Strategies Compared

| Strategy | Chunk Size | Overlap | Best For |
|---|---|---|---|
| Fixed size | 256–512 tokens | 10–15% | General purpose |
| Sentence-based | 1–5 sentences | 1 sentence | Factual Q&A |
| Paragraph-based | Variable | None | Narrative documents |
| Semantic | Variable | Varies | Complex reasoning |

## Step 3: Embedding and Vector Store

\`\`\`python
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

def build_vector_store(chunks: list, persist_dir: str = "./chroma_db") -> Chroma:
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_dir,
        collection_metadata={"hnsw:space": "cosine"},
    )
    print(f"Indexed {vectorstore._collection.count()} chunks")
    return vectorstore

def load_vector_store(persist_dir: str = "./chroma_db") -> Chroma:
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    return Chroma(persist_directory=persist_dir, embedding_function=embeddings)
\`\`\`

## Step 4: Retrieval Chain with Citations

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

QA_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a precise document analyst. Answer the user's question 
using ONLY the provided context. If the answer isn't in the context, say so clearly.

After your answer, list the sources you used in this format:
**Sources:**
- [filename, page X]: brief quote

Context:
{context}"""),
    ("human", "{question}"),
])

def format_docs_with_citations(docs: list) -> str:
    formatted = []
    for doc in docs:
        source = doc.metadata.get("source", "unknown")
        page = doc.metadata.get("page", "?")
        formatted.append(f"[{source}, page {page}]\n{doc.page_content}")
    return "\n\n---\n\n".join(formatted)

def build_qa_chain(vectorstore: Chroma):
    retriever = vectorstore.as_retriever(
        search_type="mmr",  # Max Marginal Relevance for diversity
        search_kwargs={"k": 5, "fetch_k": 20},
    )
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    
    chain = (
        {"context": retriever | format_docs_with_citations, "question": RunnablePassthrough()}
        | QA_PROMPT
        | llm
        | StrOutputParser()
    )
    return chain, retriever
\`\`\`

## Step 5: Streamlit UI with Source Display

\`\`\`python
# app.py
import streamlit as st
from pathlib import Path
from ingest import load_documents, chunk_documents, build_vector_store, load_vector_store
from qa import build_qa_chain

st.set_page_config(page_title="Document Q&A", layout="wide")
st.title("📄 Document Q&A")

with st.sidebar:
    st.header("Upload Documents")
    uploaded_files = st.file_uploader("Upload PDFs", type="pdf", accept_multiple_files=True)
    if uploaded_files and st.button("Process Documents"):
        Path("docs").mkdir(exist_ok=True)
        for f in uploaded_files:
            Path(f"docs/{f.name}").write_bytes(f.read())
        with st.spinner("Ingesting and indexing..."):
            docs = load_documents("docs")
            chunks = chunk_documents(docs)
            build_vector_store(chunks)
        st.success(f"Indexed {len(chunks)} chunks!")

if "qa_chain" not in st.session_state:
    try:
        vs = load_vector_store()
        st.session_state.qa_chain, st.session_state.retriever = build_qa_chain(vs)
    except Exception:
        st.info("Upload and process documents to get started.")
        st.stop()

query = st.chat_input("Ask a question about your documents...")
if query:
    with st.spinner("Searching and generating answer..."):
        col1, col2 = st.columns([2, 1])
        with col1:
            answer = st.session_state.qa_chain.invoke(query)
            st.markdown(answer)
        with col2:
            st.subheader("Retrieved Chunks")
            docs = st.session_state.retriever.invoke(query)
            for doc in docs:
                with st.expander(f"{doc.metadata.get('source', 'doc')} p.{doc.metadata.get('page', '?')}"):
                    st.write(doc.page_content)
\`\`\`

## Evaluation

Always measure retrieval quality separately from generation quality:

\`\`\`python
# Simple retrieval eval
def retrieval_precision(queries_with_expected_sources: list, retriever) -> float:
    hits = 0
    for item in queries_with_expected_sources:
        docs = retriever.invoke(item["query"])
        retrieved_sources = {d.metadata["source"] for d in docs}
        if item["expected_source"] in retrieved_sources:
            hits += 1
    return hits / len(queries_with_expected_sources)
\`\`\`

## Common Failure Modes

- **Wrong chunk size** — try 256, 512, and 1024 and measure which gives better retrieval precision
- **Missing metadata** — always preserve \`source\` and \`page\` in chunk metadata
- **No re-ranking** — add a cross-encoder re-ranker before passing to the LLM for better precision
`,
  },

  'projects/code-reviewer': {
    slug: 'projects/code-reviewer',
    title: 'AI Code Reviewer',
    description: 'Build an AI-powered code reviewer with GitHub webhook integration, structured output, severity scoring, and automated PR comments.',
    content: `# AI Code Reviewer

An AI code reviewer that posts actionable, structured feedback directly to GitHub pull requests. This project teaches structured LLM output, webhook integration, and building systems that interact with existing developer workflows.

## Architecture

\`\`\`
GitHub PR Created/Updated
         │
         ▼ (webhook)
┌─────────────────────┐
│   FastAPI Server    │
│  (webhook receiver) │
└────────┬────────────┘
         │  fetch diff via GitHub API
         ▼
┌─────────────────────┐
│  Diff Preprocessor  │
│  (parse, filter,    │
│   language detect)  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   LLM Analyzer      │
│  (per-file review + │
│   structured output)│
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  GitHub Comment     │
│  Poster (REST API)  │
└─────────────────────┘
\`\`\`

## Setup

\`\`\`bash
pip install fastapi uvicorn PyGithub langchain-openai pydantic python-dotenv
\`\`\`

\`\`\`bash
# .env
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=ghp_...
GITHUB_WEBHOOK_SECRET=your-webhook-secret
\`\`\`

## Step 1: Structured Review Output

Using Pydantic with LangChain ensures the LLM returns parseable, consistent output.

\`\`\`python
from pydantic import BaseModel, Field
from typing import Literal
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import PydanticOutputParser

class CodeIssue(BaseModel):
    line_number: int | None = Field(description="Line number of the issue, if applicable")
    severity: Literal["critical", "major", "minor", "suggestion"] = Field(
        description="Severity of the issue"
    )
    category: Literal["bug", "security", "performance", "style", "maintainability"] = Field(
        description="Category of the issue"
    )
    title: str = Field(description="Short title for the issue")
    explanation: str = Field(description="Clear explanation of why this is an issue")
    suggestion: str = Field(description="Specific, actionable suggestion to fix it")

class FileReview(BaseModel):
    filename: str
    language: str
    summary: str = Field(description="2-3 sentence summary of the changes")
    issues: list[CodeIssue] = Field(default_factory=list)
    positive_notes: list[str] = Field(
        default_factory=list,
        description="Things done well in this file"
    )
    overall_score: int = Field(ge=1, le=10, description="Overall quality score 1-10")
\`\`\`

## Step 2: Review Prompts by Language

\`\`\`python
LANGUAGE_HINTS = {
    "python": "Focus on: type hints, exception handling, PEP 8, mutable defaults, resource management.",
    "typescript": "Focus on: null safety, type assertions, async/await, error boundaries, any usage.",
    "go": "Focus on: error handling, goroutine leaks, context propagation, interface compliance.",
    "sql": "Focus on: injection risks, missing indexes, N+1 patterns, transaction boundaries.",
}

REVIEW_SYSTEM_PROMPT = """You are a senior software engineer performing a thorough code review.
Analyze the provided diff and return a structured review.

Language-specific guidance: {language_hints}

Be constructive, specific, and actionable. Reference exact line numbers when possible.
Acknowledge good patterns, not just problems.

{format_instructions}
"""

def build_reviewer(language: str) -> tuple:
    parser = PydanticOutputParser(pydantic_object=FileReview)
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    llm_structured = llm.with_structured_output(FileReview)
    return llm_structured, parser
\`\`\`

## Step 3: GitHub Webhook Server

\`\`\`python
# main.py
import hashlib, hmac, json
from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from github import Github
from reviewer import review_pull_request
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI()
gh = Github(os.environ["GITHUB_TOKEN"])

def verify_signature(payload: bytes, signature: str) -> bool:
    secret = os.environ["GITHUB_WEBHOOK_SECRET"].encode()
    expected = "sha256=" + hmac.new(secret, payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)

@app.post("/webhook")
async def github_webhook(request: Request, background_tasks: BackgroundTasks):
    payload = await request.body()
    sig = request.headers.get("X-Hub-Signature-256", "")
    
    if not verify_signature(payload, sig):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    event = request.headers.get("X-GitHub-Event")
    data = json.loads(payload)
    
    if event == "pull_request" and data["action"] in ("opened", "synchronize"):
        pr_number = data["pull_request"]["number"]
        repo_name = data["repository"]["full_name"]
        background_tasks.add_task(review_pull_request, repo_name, pr_number)
    
    return {"status": "accepted"}
\`\`\`

## Step 4: Review and Comment Logic

\`\`\`python
# reviewer.py
from github import Github
from langchain_openai import ChatOpenAI
from models import FileReview
import os

gh = Github(os.environ["GITHUB_TOKEN"])
llm = ChatOpenAI(model="gpt-4o", temperature=0).with_structured_output(FileReview)

SEVERITY_EMOJI = {
    "critical": "🚨",
    "major": "⚠️",
    "minor": "💡",
    "suggestion": "✨",
}

def format_review_comment(review: FileReview) -> str:
    lines = [
        f"## AI Review: \`{review.filename}\`",
        f"**Language:** {review.language} | **Score:** {review.overall_score}/10",
        f"\n{review.summary}\n",
    ]
    if review.positive_notes:
        lines.append("### ✅ What's Good")
        lines.extend(f"- {note}" for note in review.positive_notes)
    if review.issues:
        lines.append("\n### Issues Found")
        for issue in sorted(review.issues, key=lambda i: ["critical","major","minor","suggestion"].index(i.severity)):
            emoji = SEVERITY_EMOJI[issue.severity]
            loc = f" (line {issue.line_number})" if issue.line_number else ""
            lines.append(f"\n**{emoji} {issue.severity.upper()} — {issue.title}**{loc}")
            lines.append(f"{issue.explanation}")
            lines.append(f"> 💬 **Fix:** {issue.suggestion}")
    return "\n".join(lines)

def review_pull_request(repo_name: str, pr_number: int):
    repo = gh.get_repo(repo_name)
    pr = repo.get_pull(pr_number)
    files = pr.get_files()
    
    comments = []
    for file in files:
        if not file.patch:  # Binary or too-large files
            continue
        ext = file.filename.split(".")[-1]
        language = {"py": "python", "ts": "typescript", "go": "go"}.get(ext, ext)
        
        prompt = f"""Review this {language} diff for file {file.filename}:

\`\`\`diff
{file.patch[:3000]}  # Limit to avoid token overflow
\`\`\`
"""
        review: FileReview = llm.invoke(prompt)
        review.filename = file.filename
        review.language = language
        comments.append(format_review_comment(review))
    
    if comments:
        body = "\n\n---\n\n".join(comments)
        body += "\n\n---\n*Review generated by AI Code Reviewer*"
        pr.create_issue_comment(body)
\`\`\`

## Running Locally with ngrok

\`\`\`bash
# Terminal 1: start the server
uvicorn main:app --reload --port 8000

# Terminal 2: expose via ngrok
ngrok http 8000
# Copy the https URL → use as webhook URL in GitHub repo settings
\`\`\`

In GitHub: **Repo Settings → Webhooks → Add webhook**
- Payload URL: \`https://your-ngrok-url/webhook\`
- Content type: \`application/json\`
- Secret: matches \`GITHUB_WEBHOOK_SECRET\`
- Events: Pull requests

## Extensions

1. **Inline PR comments** — use \`pr.create_review()\` to post comments on specific lines
2. **Approval/request changes** — auto-approve if score > 8, request changes if critical issues found
3. **Per-language configuration** — YAML config file to enable/disable rule categories per repo
`,
  },

  'projects/research-agent': {
    slug: 'projects/research-agent',
    title: 'Autonomous Research Agent',
    description: 'Build a multi-agent research system using LangGraph — web search, arXiv paper reading, note-taking, synthesis, and report generation.',
    content: `# Autonomous Research Agent

An autonomous agent that can search the web, read academic papers, take notes, and synthesize findings into a structured research report. This project covers multi-agent orchestration, tool use, and the hardest problem in AI engineering: reliable long-horizon task completion.

## Why Multi-Agent?

A single LLM call can't do deep research — context limits, tool chaining complexity, and the need for reflection all push toward a multi-agent approach:

| Concern | Single Agent | Multi-Agent |
|---|---|---|
| Context length | Limited | Each agent has fresh context |
| Task complexity | Degrades on long chains | Roles keep tasks bounded |
| Error recovery | Hard to isolate | Agents can retry independently |
| Parallelism | Sequential only | Agents can run in parallel |

## Architecture with LangGraph

\`\`\`
User Query
    │
    ▼
┌─────────────────┐
│  Planner Agent  │  Creates research plan, assigns subtasks
└────────┬────────┘
         │
    ┌────┴────────────────────────┐
    │                             │
    ▼                             ▼
┌──────────┐              ┌──────────────┐
│  Web     │              │  ArXiv       │
│  Search  │              │  Reader      │
│  Agent   │              │  Agent       │
└────┬─────┘              └──────┬───────┘
     │                           │
     └──────────┬────────────────┘
                ▼
        ┌───────────────┐
        │  Note Taker   │  Deduplicates, structures findings
        └───────┬───────┘
                ▼
        ┌───────────────┐
        │  Synthesizer  │  Writes the final report
        └───────────────┘
\`\`\`

## Setup

\`\`\`bash
pip install langgraph langchain langchain-openai tavily-python arxiv python-dotenv
\`\`\`

\`\`\`bash
# .env
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...  # Free tier: tavily.com
\`\`\`

## Step 1: Define Tools

\`\`\`python
# tools.py
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.tools import tool
import arxiv

web_search = TavilySearchResults(
    max_results=5,
    search_depth="advanced",
    include_answer=True,
)

@tool
def search_arxiv(query: str, max_results: int = 3) -> str:
    """Search arXiv for academic papers on a topic."""
    client = arxiv.Client()
    search = arxiv.Search(query=query, max_results=max_results, sort_by=arxiv.SortCriterion.Relevance)
    results = []
    for paper in client.results(search):
        results.append(
            f"Title: {paper.title}\n"
            f"Authors: {', '.join(a.name for a in paper.authors[:3])}\n"
            f"Published: {paper.published.date()}\n"
            f"Abstract: {paper.summary[:400]}...\n"
            f"URL: {paper.entry_id}\n"
        )
    return "\n---\n".join(results) if results else "No papers found."

@tool
def fetch_paper_content(arxiv_url: str) -> str:
    """Fetch the full abstract and metadata for an arXiv paper."""
    paper_id = arxiv_url.split("/")[-1]
    client = arxiv.Client()
    search = arxiv.Search(id_list=[paper_id])
    paper = next(client.results(search))
    return f"Title: {paper.title}\nAbstract: {paper.summary}\nCategories: {paper.categories}"
\`\`\`

## Step 2: Agent State

\`\`\`python
# state.py
from typing import Annotated
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict

class ResearchState(TypedDict):
    query: str
    plan: list[str]
    search_results: Annotated[list[str], lambda x, y: x + y]
    notes: Annotated[list[str], lambda x, y: x + y]
    report: str
    messages: Annotated[list, add_messages]
    iteration: int
\`\`\`

## Step 3: Agent Nodes

\`\`\`python
# agents.py
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from state import ResearchState

llm = ChatOpenAI(model="gpt-4o", temperature=0.3)
llm_tools = llm.bind_tools([web_search, search_arxiv, fetch_paper_content])

def planner_node(state: ResearchState) -> dict:
    response = llm.invoke([
        SystemMessage(content="""You are a research planner. Given a research question,
create a structured plan with 3-5 specific sub-questions to investigate.
Return as a numbered list."""),
        HumanMessage(content=f"Research question: {state['query']}")
    ])
    plan = [line.strip() for line in response.content.split("\n") if line.strip() and line[0].isdigit()]
    return {"plan": plan}

def web_researcher_node(state: ResearchState) -> dict:
    queries = state["plan"][:2]  # Research first 2 sub-questions via web
    results = []
    for q in queries:
        result = web_search.invoke(q)
        results.append(f"**Query:** {q}\n**Results:** {result}")
    return {"search_results": results}

def arxiv_researcher_node(state: ResearchState) -> dict:
    queries = state["plan"][2:]  # Research remaining via arXiv
    results = []
    for q in queries:
        result = search_arxiv.invoke(q)
        results.append(f"**Academic search for:** {q}\n{result}")
    return {"search_results": results}

def note_taker_node(state: ResearchState) -> dict:
    all_results = "\n\n".join(state["search_results"])
    response = llm.invoke([
        SystemMessage(content="""Extract key findings from the research results.
Create concise, factual bullet points. Deduplicate and organize by theme.
Each bullet should be a standalone, citable finding."""),
        HumanMessage(content=f"Research results:\n{all_results[:6000]}")
    ])
    notes = [line.strip() for line in response.content.split("\n") if line.strip().startswith("-")]
    return {"notes": notes}

def synthesizer_node(state: ResearchState) -> dict:
    notes_text = "\n".join(state["notes"])
    response = llm.invoke([
        SystemMessage(content="""You are a research writer. Write a comprehensive,
well-structured research report based on the provided notes.

Structure:
## Executive Summary
## Background
## Key Findings
## Analysis and Implications
## Conclusion
## References (cite the search queries used)

Be specific, cite evidence, and maintain academic tone."""),
        HumanMessage(content=f"Research question: {state['query']}\n\nNotes:\n{notes_text}")
    ])
    return {"report": response.content}
\`\`\`

## Step 4: Build the Graph

\`\`\`python
# graph.py
from langgraph.graph import StateGraph, END
from state import ResearchState
from agents import planner_node, web_researcher_node, arxiv_researcher_node, note_taker_node, synthesizer_node

def build_research_graph():
    graph = StateGraph(ResearchState)
    
    graph.add_node("planner", planner_node)
    graph.add_node("web_researcher", web_researcher_node)
    graph.add_node("arxiv_researcher", arxiv_researcher_node)
    graph.add_node("note_taker", note_taker_node)
    graph.add_node("synthesizer", synthesizer_node)
    
    graph.set_entry_point("planner")
    graph.add_edge("planner", "web_researcher")
    graph.add_edge("planner", "arxiv_researcher")
    graph.add_edge("web_researcher", "note_taker")
    graph.add_edge("arxiv_researcher", "note_taker")
    graph.add_edge("note_taker", "synthesizer")
    graph.add_edge("synthesizer", END)
    
    return graph.compile()

# Usage
if __name__ == "__main__":
    agent = build_research_graph()
    result = agent.invoke({
        "query": "What are the latest advances in test-time compute scaling for LLMs?",
        "plan": [],
        "search_results": [],
        "notes": [],
        "report": "",
        "messages": [],
        "iteration": 0,
    })
    print(result["report"])
\`\`\`

## Running and Visualizing

\`\`\`bash
# Run a research query
python graph.py

# Visualize the graph (requires graphviz)
pip install grandalf
python -c "from graph import build_research_graph; g = build_research_graph(); print(g.get_graph().draw_ascii())"
\`\`\`

## Key Design Patterns

- **Fan-out then fan-in** — web and arXiv researchers run conceptually in parallel, both feed the note taker
- **State accumulation** — \`Annotated[list, lambda x, y: x + y]\` lets multiple nodes append to shared lists
- **Bounded iteration** — always add a max iteration counter to prevent infinite loops in agentic systems
- **Deterministic LLM calls** — use \`temperature=0\` for planning and synthesis to get consistent structure

## Extensions

1. **Human-in-the-loop** — add a \`human_review\` node with \`interrupt_before\` to let users edit the plan
2. **PDF reading** — integrate \`pypdf\` to download and read full arXiv PDFs, not just abstracts
3. **Citation tracking** — have the note taker tag each finding with its source URL
4. **Streaming output** — use \`graph.stream()\` to show findings in real time as agents complete
`,
  },
}
