import type { DocsContentMap } from './types'

export const gettingStartedContent: DocsContentMap = {
  'getting-started/overview': {
    slug: 'getting-started/overview',
    title: 'Getting Started with AI Engineering',
    description:
      'Your comprehensive guide to becoming an AI engineer — covering the roadmap, prerequisites, tools, and hands-on skills you need to build production AI systems.',
    content: `## What You Will Learn

This guide is designed to take you from curious beginner to confident AI engineer. Whether you are a software developer looking to add AI to your skillset, a data scientist wanting to ship production systems, or a complete newcomer with a passion for building intelligent applications — this curriculum has a path for you.

### Core Themes

- **Foundations first**: Understand what AI engineering actually is, how it differs from research, and where it fits in modern software development.
- **Hands-on from day one**: Every section includes runnable code, real datasets, and practical exercises.
- **Production mindset**: We don't just train models — we deploy, monitor, and iterate on them in real systems.
- **LLM-era skills**: Large language models have reshaped the landscape. You will learn prompt engineering, retrieval-augmented generation (RAG), and how to build reliable LLM pipelines.

## Who This Guide Is For

| Background | What You'll Gain |
|---|---|
| Software Engineer | How to integrate ML/AI into products you already build |
| Data Analyst | How to move from dashboards to predictive and generative systems |
| CS Student | A practical complement to theory-heavy coursework |
| Career Changer | A structured, self-paced curriculum with clear milestones |

No prior AI or ML experience is required. A basic familiarity with Python is assumed; if you are new to Python, complete a short Python fundamentals course first.

## How to Use This Guide

### Recommended Path

1. Read **What is AI Engineering** to understand the role and industry context.
2. Follow the **Roadmap** to see the full 6–12 month learning plan.
3. Check the **Prerequisites** page and fill any gaps.
4. Complete the **Setup** page to configure your local environment.
5. Work through each module in order — each builds on the last.

### Self-Paced vs. Structured

You can treat this as a self-paced reference or work through it section by section. Estimated time commitments are included in the Roadmap so you can plan accordingly.

### Getting Help

- Each page links to recommended external resources (documentation, papers, courses).
- Code examples are complete and runnable — copy them into your editor and experiment freely.
- When stuck, re-read the relevant foundational section before moving on; most confusion resolves with stronger conceptual grounding.

## What You Will Build

By the end of this curriculum you will have completed several real projects:

- A **text classification pipeline** trained on real data and deployed as an API
- A **semantic search engine** using vector embeddings and a vector database
- A **RAG chatbot** that answers questions over a custom knowledge base
- A **fine-tuned language model** adapted to a specific domain
- A **monitoring dashboard** tracking model drift and performance in production

These projects form a portfolio that demonstrates practical, employer-relevant skills.`,
  },

  'getting-started/what-is-ai-engineering': {
    slug: 'getting-started/what-is-ai-engineering',
    title: 'What is AI Engineering?',
    description:
      'Understand the AI engineering role, how it differs from ML engineering and data science, what AI engineers do day-to-day, and why demand for this skill set is exploding.',
    content: `## Defining AI Engineering

AI Engineering is the discipline of **building, deploying, and operating AI-powered software systems**. An AI engineer bridges the gap between research-grade machine learning and production-grade software — turning models, embeddings, and APIs into reliable products that users depend on.

The term has gained particular prominence with the rise of large language models (LLMs). Where earlier ML workflows centered on training custom models from scratch, modern AI engineering often means:

- Integrating foundation models (GPT-4, Claude, Gemini, Llama) via APIs
- Engineering prompts and chains of reasoning
- Building retrieval and memory systems that augment model capabilities
- Ensuring safety, reliability, and cost efficiency in production

## AI Engineer vs. ML Engineer vs. Data Scientist

These roles overlap but have distinct focuses:

| Dimension | Data Scientist | ML Engineer | AI Engineer |
|---|---|---|---|
| **Primary goal** | Insight and analysis | Train and optimize models | Build AI-powered products |
| **Key outputs** | Reports, dashboards, notebooks | Trained model artifacts, pipelines | APIs, applications, agents |
| **Math depth** | High | High | Moderate |
| **Software depth** | Low–Medium | Medium–High | High |
| **LLM focus** | Low | Low–Medium | High |
| **Typical tools** | SQL, R, Python, Jupyter | PyTorch, TensorFlow, MLflow | LangChain, OpenAI API, vector DBs |

In practice, many teams use these titles interchangeably. What matters is understanding which slice of the work you are being hired to do.

## Typical Responsibilities

### Day-to-Day Work

- **Prompt engineering**: Crafting, testing, and versioning prompts that produce reliable outputs from LLMs.
- **RAG system design**: Building pipelines that retrieve relevant context and inject it into model calls.
- **API integration**: Connecting AI services (OpenAI, Anthropic, Cohere, Hugging Face) into backend systems.
- **Fine-tuning**: Adapting pre-trained models to specific domains using custom datasets.
- **Evaluation**: Defining metrics and building test suites to measure model quality systematically.
- **Deployment**: Containerizing models, managing inference infrastructure, and setting up CI/CD for AI pipelines.
- **Monitoring**: Tracking latency, cost, accuracy, and data drift in live systems.

### Collaboration

AI engineers work closely with product managers (defining what "good" looks like), data scientists (sourcing and validating training data), and backend engineers (integrating AI features into existing systems).

## The LLM Paradigm Shift

Before 2022, building an AI feature often meant:

\`\`\`
Collect data → Label data → Train model → Evaluate → Deploy → Monitor
(Months of work, ML expertise required)
\`\`\`

After the LLM revolution, a common pattern is:

\`\`\`
Define task → Engineer prompt → Call API → Evaluate output → Iterate
(Days of work, software engineering skills sufficient)
\`\`\`

This shift has dramatically lowered the barrier to shipping AI features, but raised the bar for **doing it reliably at scale** — which is exactly what AI engineers specialize in.

## Career Outlook

Demand for AI engineers has grown faster than almost any other software role:

- **Job postings** mentioning "LLM", "prompt engineering", or "AI engineer" grew over 400% between 2022 and 2024 (source: LinkedIn Workforce Report).
- **Median salary** for AI engineers in the US ranges from $150,000–$220,000+ depending on experience and company.
- **Remote opportunities** are abundant; AI tooling is cloud-native and globally accessible.
- **Career paths** lead to Staff AI Engineer, AI Platform Lead, Head of AI, or independent consulting.

The field is young enough that professionals transitioning from software engineering or data science can reach senior levels within 2–3 years with focused effort.

## Is AI Engineering Right for You?

You are likely a good fit if you:

- Enjoy building and shipping software, not just analyzing data
- Are comfortable with ambiguity — AI outputs are probabilistic, not deterministic
- Like working at the intersection of research and product
- Are curious about language, reasoning, and human–computer interaction
- Want a field where the technology is evolving fast enough to stay perpetually interesting`,
  },

  'getting-started/roadmap': {
    slug: 'getting-started/roadmap',
    title: 'AI Engineering Roadmap',
    description:
      'A structured 6–12 month learning plan organized into phases, with time estimates, key skills, and milestones for each stage of your AI engineering journey.',
    content: `## Overview

This roadmap is organized into **five phases**. Each phase builds on the previous one. You can move faster or slower depending on your existing background — the time estimates assume roughly 10–15 hours of study and practice per week.

| Phase | Name | Duration | Focus |
|---|---|---|---|
| 1 | Foundations | 4–6 weeks | Python, math essentials, ML concepts |
| 2 | Core ML | 6–8 weeks | Supervised learning, model evaluation, scikit-learn |
| 3 | Deep Learning & LLMs | 6–8 weeks | Neural networks, transformers, fine-tuning |
| 4 | AI Systems | 6–8 weeks | RAG, agents, vector databases, prompt engineering |
| 5 | Production & MLOps | 4–6 weeks | Deployment, monitoring, CI/CD for AI |

Total estimated time: **6–12 months** depending on pace and prior experience.

---

## Phase 1 — Foundations (Weeks 1–6)

### Goals
- Write fluent Python for data manipulation and automation
- Understand the mathematical intuition behind ML algorithms
- Set up a productive local development environment

### Key Skills

\`\`\`
Python:
  - Data structures, functions, classes, decorators
  - NumPy for numerical computing
  - Pandas for tabular data
  - Matplotlib / Seaborn for visualization

Math:
  - Linear algebra: vectors, matrices, dot products
  - Statistics: mean, variance, distributions, hypothesis testing
  - Calculus intuition: derivatives, gradients (conceptual level)

Tools:
  - Git and GitHub
  - Jupyter Notebooks
  - Virtual environments (venv / conda)
\`\`\`

### Milestone Project
Build a data analysis notebook that loads a real dataset (e.g., Titanic survival data), cleans it, performs exploratory analysis, and visualizes key findings.

---

## Phase 2 — Core Machine Learning (Weeks 7–14)

### Goals
- Train and evaluate classic ML models
- Understand the full model development lifecycle
- Handle real-world data quality issues

### Key Skills

\`\`\`
Algorithms:
  - Linear and logistic regression
  - Decision trees and random forests
  - Gradient boosting (XGBoost, LightGBM)
  - k-nearest neighbors, SVM (conceptual)

Workflow:
  - Train/validation/test splits
  - Cross-validation
  - Feature engineering and selection
  - Hyperparameter tuning (GridSearchCV, Optuna)
  - Evaluation metrics (accuracy, F1, ROC-AUC, RMSE)

Libraries:
  - scikit-learn
  - XGBoost / LightGBM
  - MLflow for experiment tracking
\`\`\`

### Milestone Project
Build an end-to-end classification pipeline: load raw data, engineer features, train multiple models, compare them with cross-validation, and expose the best model as a REST API using FastAPI.

---

## Phase 3 — Deep Learning & LLMs (Weeks 15–22)

### Goals
- Understand neural networks from first principles
- Work with transformer architectures
- Fine-tune pre-trained language models

### Key Skills

\`\`\`
Deep Learning:
  - Feedforward networks, backpropagation
  - Convolutional networks (CNNs) for image tasks
  - Recurrent networks, attention mechanism
  - PyTorch fundamentals

Transformers & LLMs:
  - Self-attention and positional encoding
  - BERT, GPT, T5 architecture families
  - Tokenization and embeddings
  - Hugging Face Transformers library
  - Fine-tuning with LoRA / QLoRA
  - Prompt engineering patterns (zero-shot, few-shot, chain-of-thought)
\`\`\`

### Milestone Project
Fine-tune a pre-trained BERT model for sentiment classification on a custom dataset. Evaluate it against GPT-4 zero-shot prompting and compare cost, latency, and accuracy.

---

## Phase 4 — AI Systems Engineering (Weeks 23–30)

### Goals
- Build multi-step AI pipelines
- Implement retrieval-augmented generation (RAG)
- Design and evaluate AI agents

### Key Skills

\`\`\`
RAG Systems:
  - Text chunking strategies
  - Embedding models (OpenAI, sentence-transformers)
  - Vector databases (Chroma, Pinecone, Weaviate, pgvector)
  - Retrieval evaluation (MRR, NDCG)
  - Reranking and hybrid search

LLM Application Frameworks:
  - LangChain and LangGraph
  - LlamaIndex
  - Structured outputs with Pydantic

Agents:
  - Tool use and function calling
  - Planning and reflection patterns
  - Multi-agent orchestration
  - Guardrails and safety filters
\`\`\`

### Milestone Project
Build a RAG chatbot over a technical documentation corpus. Implement hybrid search (keyword + semantic), add a reranker, and build an evaluation harness that scores answer faithfulness and relevance automatically.

---

## Phase 5 — Production & MLOps (Weeks 31–36)

### Goals
- Deploy AI systems reliably at scale
- Monitor model performance in production
- Build automated pipelines for retraining and evaluation

### Key Skills

\`\`\`
Deployment:
  - Docker and containerization
  - FastAPI / Flask for model serving
  - Cloud deployment (AWS, GCP, Azure)
  - Serverless inference (AWS Lambda, Modal, Replicate)

MLOps:
  - CI/CD pipelines for model updates
  - Feature stores
  - Model registries (MLflow, Weights & Biases)
  - Data and model versioning (DVC)

Monitoring:
  - Latency, throughput, error rate tracking
  - Data drift detection
  - LLM-specific evals in production (LangSmith, Arize)
  - Cost tracking and optimization
\`\`\`

### Milestone Project
Take your Phase 4 RAG chatbot and deploy it to a cloud provider with a CI/CD pipeline, automated evaluation on each deploy, and a monitoring dashboard.

---

## Recommended Resources by Phase

| Phase | Books | Courses | Tools |
|---|---|---|---|
| 1 | Python Crash Course | fast.ai Part 1 | Jupyter, NumPy docs |
| 2 | Hands-On ML (Géron) | Coursera ML Specialization | scikit-learn, MLflow |
| 3 | Deep Learning (Goodfellow) | fast.ai Part 2, Andrej Karpathy's makemore | PyTorch, HuggingFace |
| 4 | Building LLMs for Production | LangChain docs, DeepLearning.AI short courses | LangChain, Chroma |
| 5 | Designing ML Systems (Huyen) | Made With ML | Docker, GitHub Actions |`,
  },

  'getting-started/prerequisites': {
    slug: 'getting-started/prerequisites',
    title: 'Prerequisites',
    description:
      'Check what programming, math, and tooling background you need before diving into AI engineering — plus a self-assessment checklist to identify gaps.',
    content: `## Overview

You do not need a PhD or a decade of experience to become an AI engineer. You do need a solid foundation in a few key areas. This page clarifies exactly what is required, what is helpful but optional, and how to fill the most common gaps quickly.

---

## Programming

### Required: Python Proficiency

Python is the lingua franca of AI engineering. You should be comfortable with:

\`\`\`python
# 1. Core data structures
data = {"name": "Alice", "scores": [92, 88, 95]}
names = [entry["name"] for entry in records if entry["active"]]

# 2. Functions with type hints
def compute_accuracy(predictions: list[int], labels: list[int]) -> float:
    correct = sum(p == l for p, l in zip(predictions, labels))
    return correct / len(labels)

# 3. Classes and basic OOP
class TextClassifier:
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.model = None

    def fit(self, X: list[str], y: list[int]) -> None:
        # training logic
        pass

    def predict(self, X: list[str]) -> list[int]:
        # inference logic
        pass

# 4. File I/O and JSON handling
import json
with open("config.json") as f:
    config = json.load(f)

# 5. Error handling
try:
    response = call_api(prompt)
except TimeoutError:
    response = fallback_response()
\`\`\`

If any of these patterns look unfamiliar, spend 2–3 weeks on a Python fundamentals course before proceeding.

### Helpful: Other Languages

- **SQL** — You will query databases frequently. Basic SELECT, JOIN, GROUP BY is enough.
- **Bash/shell scripting** — Useful for automation, running pipelines, and working with cloud tools.
- **JavaScript/TypeScript** — Not required, but helpful if you want to build full-stack AI applications.

---

## Mathematics

### Required: Intuition, Not Mastery

You do not need to derive backpropagation from scratch. You do need enough math to interpret what models are doing and debug unexpected behavior.

| Topic | Required Level | Why It Matters |
|---|---|---|
| **Linear Algebra** | Vectors, matrices, dot products, matrix multiplication | Embeddings are vectors; attention is matrix multiplication |
| **Statistics** | Mean, variance, distributions, correlation | Evaluating models, understanding data |
| **Probability** | Conditional probability, Bayes' theorem (intuition) | Understanding model uncertainty, classification |
| **Calculus** | Derivatives and gradients (conceptual) | Understanding how models learn (gradient descent) |

### Quick Check

Can you answer these questions? If yes, your math foundation is sufficient:

1. What does a dot product between two vectors measure?
2. What does standard deviation tell you about a dataset?
3. If a model predicts class A with probability 0.7, what does that mean?
4. Why does a model with zero training loss but high test loss indicate a problem?

---

## Tools & Ecosystem

### Required Before Starting

\`\`\`bash
# Verify these are installed and accessible
python --version       # 3.10+ recommended
git --version
pip --version
\`\`\`

### Helpful to Know

- **Git**: cloning repos, committing changes, branching — you will use this constantly.
- **Command line**: navigating directories, running scripts, reading logs.
- **Jupyter Notebooks**: most AI tutorials and educational content uses notebooks.
- **A code editor**: VS Code is strongly recommended (see the Setup page).

---

## Self-Assessment Checklist

Go through this checklist honestly. Check everything you can confidently do today:

### Python
- [ ] Write a function that reads a CSV, filters rows, and returns a summary
- [ ] Use list comprehensions and dictionary comprehensions fluently
- [ ] Implement a simple class with \`__init__\`, instance methods, and properties
- [ ] Install packages with \`pip\` and manage virtual environments
- [ ] Read and write JSON, CSV, and plain text files
- [ ] Handle exceptions and write defensive code

### Math
- [ ] Multiply two matrices by hand (or explain what happens computationally)
- [ ] Calculate mean, median, and standard deviation for a small dataset
- [ ] Explain what a probability distribution is
- [ ] Explain what gradient descent is trying to achieve (no formulas needed)

### Tools
- [ ] Clone a GitHub repository and run code from it
- [ ] Use the command line to navigate, create files, and run scripts
- [ ] Open and run a Jupyter notebook

### Scoring

| Checked | Interpretation |
|---|---|
| 14–16 | You are fully ready — jump straight to the Setup page |
| 10–13 | Fill the specific gaps before starting; 1–2 weeks of targeted study |
| 6–9 | Spend 4–6 weeks on Python and math fundamentals first |
| < 6 | Start with a general programming foundations course |

---

## Filling Gaps Quickly

### Python (if needed)
- **"Automate the Boring Stuff with Python"** (free online) — Chapters 1–10 cover everything required
- **Python.org official tutorial** — Dense but authoritative

### Math (if needed)
- **3Blue1Brown "Essence of Linear Algebra"** (YouTube, free) — 15 videos, visually intuitive
- **Khan Academy Statistics & Probability** — Self-paced, free, covers exactly what you need
- **"Mathematics for Machine Learning"** (Deisenroth et al., free PDF) — More rigorous if you want depth

### Git (if needed)
\`\`\`bash
# The 10 Git commands you will use 95% of the time:
git clone <url>
git status
git add .
git commit -m "message"
git push
git pull
git checkout -b new-branch
git merge main
git log --oneline
git diff
\`\`\``,
  },

  'getting-started/setup': {
    slug: 'getting-started/setup',
    title: 'Environment Setup',
    description:
      'Step-by-step instructions for setting up your Python environment, installing key AI/ML libraries, configuring VS Code, and managing API keys for local AI engineering work.',
    content: `## Overview

A well-configured local environment removes friction from learning. This page walks you through everything you need: Python, virtual environments, core libraries, a great editor, and API key management.

Estimated time: **1–2 hours** for a clean setup.

---

## 1. Install Python

Use **Python 3.10 or later**. Many AI libraries require 3.10+ and some use syntax features only available in newer versions.

### macOS

\`\`\`bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python@3.11

# Verify
python3 --version
\`\`\`

### Windows

Download the installer from [python.org](https://python.org/downloads/). During installation, **check "Add Python to PATH"**.

\`\`\`powershell
# Verify in PowerShell
python --version
pip --version
\`\`\`

### Linux (Ubuntu/Debian)

\`\`\`bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip
python3.11 --version
\`\`\`

---

## 2. Set Up a Virtual Environment

Always use a virtual environment. It isolates your project dependencies and prevents version conflicts between projects.

\`\`\`bash
# Create a project directory
mkdir ai-engineering && cd ai-engineering

# Create a virtual environment
python3 -m venv .venv

# Activate it
# macOS / Linux:
source .venv/bin/activate
# Windows (PowerShell):
.venv\\Scripts\\Activate.ps1

# Your prompt now shows (.venv) — you are inside the environment
# Upgrade pip while you're at it
pip install --upgrade pip
\`\`\`

**Tip**: Use [pyenv](https://github.com/pyenv/pyenv) if you need to switch between Python versions across multiple projects.

---

## 3. Install Core Libraries

### Essential Data & ML Stack

\`\`\`bash
pip install numpy pandas matplotlib seaborn scikit-learn
\`\`\`

| Library | Purpose |
|---|---|
| \`numpy\` | Numerical computing, array operations |
| \`pandas\` | Tabular data manipulation (DataFrames) |
| \`matplotlib\` | Basic plotting and visualization |
| \`seaborn\` | Statistical visualizations (built on matplotlib) |
| \`scikit-learn\` | Classic ML algorithms, preprocessing, evaluation |

### Deep Learning

\`\`\`bash
# PyTorch (CPU version — add CUDA variant for GPU)
pip install torch torchvision torchaudio

# Hugging Face ecosystem
pip install transformers datasets tokenizers accelerate
\`\`\`

Verify PyTorch:

\`\`\`python
import torch
print(torch.__version__)          # e.g., 2.3.0
print(torch.cuda.is_available())  # True if GPU is available
\`\`\`

### LLM & AI Application Stack

\`\`\`bash
# OpenAI API client
pip install openai

# LangChain (AI application framework)
pip install langchain langchain-openai langchain-community

# LlamaIndex (alternative RAG framework)
pip install llama-index

# Vector database clients
pip install chromadb           # local, easy to start
pip install pinecone-client    # cloud-hosted

# Useful utilities
pip install python-dotenv      # manage API keys
pip install httpx              # async HTTP client
pip install pydantic           # data validation
pip install fastapi uvicorn    # build AI APIs
\`\`\`

### Experiment Tracking

\`\`\`bash
pip install mlflow
pip install wandb   # Weights & Biases (alternative)
\`\`\`

### Save Your Dependencies

\`\`\`bash
pip freeze > requirements.txt
\`\`\`

To recreate the environment elsewhere:

\`\`\`bash
pip install -r requirements.txt
\`\`\`

---

## 4. Configure VS Code

VS Code is the recommended editor. Install it from [code.visualstudio.com](https://code.visualstudio.com).

### Essential Extensions

Install these from the Extensions panel (\`Cmd+Shift+X\` / \`Ctrl+Shift+X\`):

| Extension | ID | Purpose |
|---|---|---|
| Python | \`ms-python.python\` | Core Python support |
| Pylance | \`ms-python.vscode-pylance\` | Fast type checking and intellisense |
| Ruff | \`charliermarsh.ruff\` | Fast Python linter and formatter |
| Jupyter | \`ms-toolsai.jupyter\` | Run notebooks inside VS Code |
| GitLens | \`eamodio.gitlens\` | Enhanced Git integration |
| GitHub Copilot | \`github.copilot\` | AI pair programmer |

### Select Your Virtual Environment

1. Open a Python file
2. Click the Python version in the bottom status bar
3. Select the interpreter from your \`.venv\` folder

Or via the command palette (\`Cmd+Shift+P\`): **Python: Select Interpreter** → choose \`.venv/bin/python\`

### Recommended \`settings.json\` Snippet

\`\`\`json
{
  "editor.formatOnSave": true,
  "python.defaultInterpreterPath": "\u0024{workspaceFolder}/.venv/bin/python",
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff"
  },
  "jupyter.notebookFileRoot": "\u0024{workspaceFolder}"
}
\`\`\`

---

## 5. Manage API Keys Securely

You will need API keys for services like OpenAI, Anthropic, and others. **Never hard-code keys in your source files.**

### Using \`.env\` Files

\`\`\`bash
# Create a .env file in your project root
touch .env

# Add to .gitignore immediately
echo ".env" >> .gitignore
\`\`\`

Inside \`.env\`:

\`\`\`bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
PINECONE_API_KEY=...
HUGGINGFACE_TOKEN=hf_...
\`\`\`

Load in Python:

\`\`\`python
from dotenv import load_dotenv
import os

load_dotenv()  # reads .env into environment variables

openai_key = os.environ["OPENAI_API_KEY"]
\`\`\`

### Verify OpenAI Setup

\`\`\`python
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello! Confirm this is working."}],
)
print(response.choices[0].message.content)
\`\`\`

---

## 6. Verify Your Full Environment

Run this checklist script to confirm everything is working:

\`\`\`python
import sys

checks = {}

# Python version
checks["Python 3.10+"] = sys.version_info >= (3, 10)

# Core libraries
for lib in ["numpy", "pandas", "sklearn", "torch", "transformers", "openai", "langchain"]:
    try:
        __import__(lib)
        checks[lib] = True
    except ImportError:
        checks[lib] = False

# Report
print("Environment Check")
print("-" * 30)
for name, ok in checks.items():
    status = "✅" if ok else "❌"
    print(f"  {status}  {name}")

all_ok = all(checks.values())
print("-" * 30)
print("All good! Ready to start." if all_ok else "Fix the ❌ items above.")
\`\`\`

---

## 7. Getting API Keys

| Service | Where to Get Key | Free Tier |
|---|---|---|
| OpenAI | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | $5 credit on signup |
| Anthropic | [console.anthropic.com](https://console.anthropic.com) | Limited free access |
| Hugging Face | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) | Free, required for gated models |
| Cohere | [dashboard.cohere.com/api-keys](https://dashboard.cohere.com/api-keys) | Free trial tier |
| Pinecone | [app.pinecone.io](https://app.pinecone.io) | Free starter plan |

You do not need all of these on day one. Start with **OpenAI** and **Hugging Face** — they cover the majority of examples in this curriculum.`,
  },
}
