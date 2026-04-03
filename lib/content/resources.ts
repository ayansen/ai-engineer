import type { DocsContentMap } from './types'

export const resourcesContent: DocsContentMap = {
  'resources/books-and-courses': {
    slug: 'resources/books-and-courses',
    title: 'Books & Courses',
    description:
      'Curated books, online courses, and video channels to deepen your AI engineering knowledge — from ML fundamentals to production LLM systems.',
    content: `## Books & Courses for AI Engineers

Whether you are entering AI engineering for the first time or levelling up your production skills, the resources below are organised by topic and approximate level.

---

## 📚 Essential Books

### Production & Systems

| Book | Author(s) | Level | Focus |
|------|-----------|-------|-------|
| *Designing Machine Learning Systems* | Chip Huyen | Intermediate | End-to-end ML system design: data pipelines, training, deployment, monitoring |
| *LLM Engineer's Handbook* | Paul Iusztin & Maxime Labonne | Intermediate–Advanced | Building, fine-tuning, and deploying LLM-powered applications at scale |
| *Building LLMs for Production* | Louis-François Bouchard et al. | Intermediate | RAG, fine-tuning, evaluation, and cost management for LLM products |
| *Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow* | Aurélien Géron | Beginner–Intermediate | Foundational ML and deep learning with practical code; 3rd ed. covers transformers |

### Foundational Reading

- **"Attention Is All You Need"** — Vaswani et al. (2017) — The original transformer paper. Required reading. [arxiv.org/abs/1706.03762](https://arxiv.org/abs/1706.03762)
- **"The Illustrated Transformer"** — Jay Alammar — An indispensable visual walkthrough of attention mechanisms. [jalammar.github.io](https://jalammar.github.io/illustrated-transformer/)
- **"Natural Language Processing with Transformers"** — Lewis Tunstall et al. (O'Reilly) — Hands-on Hugging Face guide, excellent companion to the HF course.

---

## 🎓 Online Courses

### Fast.ai — [fast.ai](https://www.fast.ai)
- **Practical Deep Learning for Coders** (free) — Jeremy Howard's legendary top-down approach. You train real models in lesson 1. Covers CNNs, NLP, tabular data, and diffusion models.
- **Practical Deep Learning Part 2** — Goes deep into the internals: writing your own training loop, building transformers from scratch.

### DeepLearning.AI — [deeplearning.ai](https://www.deeplearning.ai)
Andrew Ng's platform hosts the most widely recognised short-course library for LLM engineers:

1. **Machine Learning Specialization** — Foundational ML in Python with modern practices (3-course series).
2. **Deep Learning Specialization** — Five courses covering backprop through sequence models and transformers.
3. **LangChain for LLM Application Development** — 1-hour practical intro to chains, agents, and memory.
4. **Building Systems with the ChatGPT API** — Chaining calls, moderation, and multi-step workflows.
5. **LLMOps** — CI/CD pipelines, fine-tuning, and deployment for LLM systems.
6. **Evaluating and Debugging Generative AI** — Weights & Biases integration, tracing, and evaluation.

### Hugging Face Courses — [huggingface.co/learn](https://huggingface.co/learn)
- **NLP Course** (free) — From tokenization to fine-tuning with the Transformers library.
- **Deep Reinforcement Learning Course** (free) — Modern RL including RLHF fundamentals.
- **Audio Course** & **Diffusion Models Course** — Domain-specific deep dives.

### LangChain Academy — [academy.langchain.com](https://academy.langchain.com)
- **Introduction to LangGraph** (free) — Stateful, multi-actor agent workflows. Essential for building production agents.

### Additional Structured Courses
- **Stanford CS224N** — NLP with Deep Learning. Full lecture videos on YouTube; used by researchers worldwide.
- **Full Stack LLM Bootcamp** (The Full Stack) — Covers prompt engineering through production deployment.
- **Weights & Biases Courses** — Free short courses on experiment tracking, model evaluation, and LLMOps.

---

## 📺 YouTube Channels

### Must-Subscribe

| Channel | Creator | Why Watch |
|---------|---------|-----------|
| [Andrej Karpathy](https://youtube.com/@AndrejKarpathy) | Andrej Karpathy | Deep, from-scratch implementations. "Let's build GPT" is essential. |
| [Yannic Kilcher](https://youtube.com/@YannicKilcher) | Yannic Kilcher | Detailed paper walkthroughs. Covers top arxiv papers weekly. |
| [AI Explained](https://youtube.com/@aiexplained-official) | Alan D. Thompson | Accessible breakdowns of frontier model releases and capabilities. |
| [Sentdex](https://youtube.com/@sentdex) | Harrison Kinsley | Practical Python ML tutorials; strong beginner-to-intermediate content. |
| [Aleksa Gordić](https://youtube.com/@TheAIEpiphany) | Aleksa Gordić | Research-quality paper explanations and PyTorch implementations. |

---

## 🗺️ Recommended Learning Paths

### Path 1 — Beginner to Production Engineer (6–9 months)
1. *Hands-On Machine Learning* (Géron) — foundations
2. fast.ai Practical Deep Learning Part 1
3. DeepLearning.AI LangChain short course
4. Hugging Face NLP Course
5. *Designing Machine Learning Systems* (Huyen)

### Path 2 — Research-Oriented Engineer (ongoing)
1. Stanford CS224N lectures
2. Andrej Karpathy's "Let's build GPT" and "makemore" series
3. *LLM Engineer's Handbook* (Iusztin & Labonne)
4. ArXiv paper reading with Yannic Kilcher's channel as companion

### Path 3 — Rapid Prototyper (1–2 months)
1. DeepLearning.AI short courses (LangChain, ChatGPT API)
2. LangChain Academy — LangGraph
3. Hugging Face NLP Course (first 4 chapters)
4. *Building LLMs for Production* (Bouchard et al.)
`,
  },

  'resources/communities': {
    slug: 'resources/communities',
    title: 'Communities',
    description:
      'Discord servers, subreddits, Twitter/X accounts, LinkedIn groups, and in-person events where AI engineers learn, share, and collaborate.',
    content: `## AI Engineering Communities

Connecting with peers accelerates learning faster than any solo resource. Below are the most active communities organised by platform.

---

## 💬 Discord Servers

### Hugging Face
- **Invite:** [discord.gg/huggingface](https://discord.com/invite/huggingface)
- 100k+ members. Channels for NLP, computer vision, audio, RL, and specific model families.
- Core team members are active. Great for bug reports and feature discussions on the Transformers library.

### LangChain
- **Invite:** [discord.gg/langchain](https://discord.com/invite/langchain) (via langchain.com)
- Active channels for LangGraph, LangSmith, RAG patterns, and agent design.
- Frequent office hours with maintainers.

### OpenAI Developer Forum / Discord
- **Forum:** [community.openai.com](https://community.openai.com) — Official forum for API questions, prompt engineering, and plugin/GPT builder discussions.
- **Unofficial Discord** — Search "OpenAI developers" on Discord for large community servers.

### AI Engineer World's Fair
- Community Discord linked from [ai.engineer](https://ai.engineer) — connects practitioners building AI products. Focused on applied engineering rather than research.

### Latent Space
- Community for the [Latent Space](https://www.latent.space) podcast. Deep technical conversations on AI infrastructure and developer tools.

### LocalAI / LocalLLaMA-adjacent
- **r/LocalLLaMA Discord** — Active server for running open models locally (llama.cpp, Ollama, LM Studio, etc.).

---

## 📰 Reddit Communities

| Subreddit | Subscribers | Focus |
|-----------|-------------|-------|
| [r/MachineLearning](https://reddit.com/r/MachineLearning) | 3M+ | Research papers, news, career discussion |
| [r/LocalLLaMA](https://reddit.com/r/LocalLLaMA) | 500k+ | Running open-source LLMs locally; hardware advice |
| [r/LanguageModelAPI](https://reddit.com/r/LanguageModelAPI) | Growing | API usage, cost optimisation, provider comparisons |
| [r/ChatGPT](https://reddit.com/r/ChatGPT) | 6M+ | Broader audience but useful for prompt technique sharing |
| [r/LangChain](https://reddit.com/r/LangChain) | 50k+ | Framework-specific Q&A and showcase |
| [r/artificial](https://reddit.com/r/artificial) | 1M+ | AI news and discussion for mixed audiences |

**Tips for Reddit:**
- Sort by "Top / Past Month" to surface quality posts.
- The weekly "Discussion" threads in r/MachineLearning are gold for career and research questions.

---

## 🐦 Twitter / X — Key Accounts to Follow

### Researchers & Engineers

| Handle | Who | Why Follow |
|--------|-----|-----------|
| [@karpathy](https://x.com/karpathy) | Andrej Karpathy | Deep technical threads; software 2.0 thinking |
| [@ylecun](https://x.com/ylecun) | Yann LeCun | Critical takes on LLMs; Meta AI research direction |
| [@GaryMarcus](https://x.com/GaryMarcus) | Gary Marcus | Sceptical counterpoint; good for balanced thinking |
| [@ClementDelangue](https://x.com/ClementDelangue) | Clément Delangue | Hugging Face CEO; open-source AI ecosystem |
| [@jeremyphoward](https://x.com/jeremyphoward) | Jeremy Howard | fast.ai; practical ML; health AI |
| [@ilyasut](https://x.com/ilyasut) | Ilya Sutskever | Rare but significant posts from OpenAI co-founder |
| [@sama](https://x.com/sama) | Sam Altman | OpenAI CEO; product direction and AI policy |

### Applied AI / Engineering

| Handle | Who | Why Follow |
|--------|-----|-----------|
| [@swyx](https://x.com/swyx) | swyx | AI engineer community builder; Latent Space podcast |
| [@eugeneyan](https://x.com/eugeneyan) | Eugene Yan | ML systems, recommenders, practical LLM patterns |
| [@chipro](https://x.com/chipro) | Chip Huyen | MLOps, ML systems design, career advice |
| [@llama_index](https://x.com/llama_index) | LlamaIndex | Framework updates and RAG patterns |
| [@LangChainAI](https://x.com/LangChainAI) | LangChain | Framework news, tutorials, agent patterns |

---

## 💼 LinkedIn

- **Artificial Intelligence & Machine Learning (group)** — 1M+ members; share research and job postings.
- **MLOps Community** — Practitioners sharing production ML content.
- Follow company pages: **OpenAI**, **Anthropic**, **Hugging Face**, **Google DeepMind**, **Meta AI**.
- Individual creators posting regularly: Chip Huyen, Sebastian Raschka, Elvis Saravia (DAIR.AI).

---

## 🌍 In-Person Events

### Major Conferences

| Conference | Focus | Typical Timing |
|------------|-------|----------------|
| [NeurIPS](https://neurips.cc) | Top ML research conference | December |
| [ICML](https://icml.cc) | Machine learning research | July |
| [ICLR](https://iclr.cc) | Learning representations | May |
| [MLOps World](https://mlopsworld.com) | Production ML and LLMOps | Spring / Fall |
| [AI Engineer World's Fair](https://ai.engineer) | Applied AI engineering | June (San Francisco) |
| [EMNLP / ACL](https://aclanthology.org) | NLP research | Varies |

### Meetups
- **[Meetup.com](https://meetup.com)** — Search "Machine Learning", "LLM", or "AI" in your city. Most major cities have active groups.
- **[MLOps Community meetups](https://mlops.community)** — In-person and virtual events globally.
- **Papers We Love** — Local chapters read and discuss research papers together. [paperswelove.org](https://paperswelove.org)

---

## 🤝 Slack & Other Platforms

- **MLOps Community Slack** — [mlops.community/slack](https://mlops.community) — Active channels on data quality, model monitoring, and LLMOps.
- **DataTalks.Club Slack** — Community around data engineering and ML; hosts free bootcamps.
- **DAIR.AI Discord** — Elvis Saravia's community; focus on NLP education and research accessibility.
`,
  },

  'resources/tools': {
    slug: 'resources/tools',
    title: 'Tools',
    description:
      'The essential toolkit for AI engineers: development environments, LLM APIs, orchestration frameworks, vector databases, observability platforms, and deployment infrastructure.',
    content: `## AI Engineering Tools

The table below gives a quick reference across all categories, followed by detailed notes on each group.

| Name | Category | Description | Free Tier |
|------|----------|-------------|-----------|
| VS Code + GitHub Copilot | Development | Leading IDE with AI-assisted coding | Copilot free tier available |
| Jupyter / JupyterLab | Development | Interactive notebooks for exploration | ✅ Open source |
| Google Colab | Development | Hosted Jupyter with free GPU access | ✅ Free GPU (T4) |
| OpenAI API | LLM API | GPT-4o, o1, text/vision/audio models | ❌ Pay-per-token |
| Anthropic API | LLM API | Claude 3.5 Sonnet, Haiku, Opus | ❌ Pay-per-token |
| Google Gemini API | LLM API | Gemini 1.5 Flash/Pro, multimodal | ✅ Free tier |
| Cohere API | LLM API | Command R+, Embed, Rerank | ✅ Trial credits |
| Together.ai | LLM API | Open-source model hosting (Llama, Mistral) | ✅ Free credits |
| LangChain | Framework | LLM orchestration chains and agents | ✅ Open source |
| LlamaIndex | Framework | Data framework for RAG and agentic apps | ✅ Open source |
| Haystack | Framework | Production NLP pipelines (deepset) | ✅ Open source |
| DSPy | Framework | Programming LM pipelines with optimisers | ✅ Open source |
| Chroma | Vector DB | Lightweight embedded vector store | ✅ Open source |
| Pinecone | Vector DB | Managed vector DB, production scale | ✅ Free tier (1 index) |
| Weaviate | Vector DB | Open-source with hybrid search | ✅ Open source / Cloud |
| Qdrant | Vector DB | High-performance Rust-based vector DB | ✅ Open source / Cloud |
| Milvus | Vector DB | Cloud-native, billion-scale vectors | ✅ Open source |
| LangSmith | Observability | Tracing, evaluation, dataset management | ✅ Free tier |
| Weights & Biases | Observability | Experiment tracking, model registry | ✅ Free for individuals |
| Arize AI | Observability | LLM monitoring and explainability | ✅ Community tier |
| Arize Phoenix | Observability | Open-source LLM tracing (OpenTelemetry) | ✅ Open source |
| Modal | Deployment | Serverless GPU compute, Python-native | ✅ Free credits |
| Replicate | Deployment | Run open models via API | ✅ Pay-per-run |
| Hugging Face Spaces | Deployment | Host Gradio/Streamlit demos | ✅ Free CPU tier |
| Ollama | Local inference | Run LLMs locally on Mac/Linux/Windows | ✅ Free |

---

## 🛠️ Development Environment

### VS Code + GitHub Copilot
The de-facto IDE for AI engineers. Install the **Python**, **Jupyter**, and **GitHub Copilot** extensions. Copilot Chat now supports multi-file context and inline edits — invaluable for boilerplate-heavy LLM code.

### Jupyter / JupyterLab
- [jupyter.org](https://jupyter.org) — Install via \`pip install jupyterlab\`
- Use **.ipynb notebooks** for data exploration, prompt experimentation, and reproducible analysis.
- **JupyterLab** offers a full IDE-like experience in the browser.

### Google Colab — [colab.research.google.com](https://colab.research.google.com)
- Free NVIDIA T4 GPU (with usage limits); upgrade to Colab Pro for A100 access.
- Ideal for fine-tuning small models, running open-source benchmarks, and sharing reproducible experiments.
- Integrates directly with Google Drive and Hugging Face.

---

## 🤖 LLM APIs

### OpenAI — [platform.openai.com](https://platform.openai.com)
- **Models:** GPT-4o, GPT-4o mini, o1, o1-mini, GPT-4 Turbo
- **Strengths:** Broadest ecosystem, function calling, vision, Assistants API, Batch API (50% discount)
- **Best for:** General-purpose applications, tool use, structured outputs

### Anthropic — [docs.anthropic.com](https://docs.anthropic.com)
- **Models:** Claude 3.5 Sonnet (top performer), Claude 3 Haiku (fast/cheap), Claude 3 Opus
- **Strengths:** Long context (200k tokens), strong instruction following, safer outputs
- **Best for:** Document analysis, coding, enterprise applications

### Google Gemini — [ai.google.dev](https://ai.google.dev)
- **Models:** Gemini 1.5 Flash (fast), Gemini 1.5 Pro (1M context window)
- **Strengths:** Massive context, multimodal (video, audio, images), generous free tier
- **Best for:** Long-document processing, multimedia applications

### Cohere — [cohere.com](https://cohere.com)
- **Models:** Command R+ (RAG-optimised), Embed v3 (best-in-class embeddings), Rerank
- **Best for:** Enterprise RAG pipelines where retrieval quality is critical

### Together.ai — [together.ai](https://together.ai)
- Hosts Llama 3, Mistral, Qwen, Falcon, and dozens of open-source models via a unified API
- **Best for:** Cost-sensitive applications, open-source model experimentation

---

## 🔗 Orchestration Frameworks

### LangChain — [langchain.com](https://langchain.com)
The most widely adopted LLM framework. Key components:
- **LCEL** (LangChain Expression Language) — declarative chain composition
- **LangGraph** — stateful, cyclical agent workflows (recommended for production agents)
- **Integrations** — 600+ tool and model integrations

### LlamaIndex — [llamaindex.ai](https://llamaindex.ai)
Specialised for data-centric LLM applications:
- Best-in-class RAG primitives: chunking strategies, metadata filtering, hybrid search
- **Workflows** — event-driven agentic pipelines
- Strong integration with every major vector DB

### Haystack — [haystack.deepset.ai](https://haystack.deepset.ai)
- Pipeline-based architecture from deepset
- Production-proven in enterprise NLP search systems
- Strong document processing and custom component support

### DSPy — [dspy.ai](https://dspy.ai)
- Stanford framework for **programming** (not prompting) language models
- Automatically optimises prompts and few-shot examples using labelled data
- Best for: applications where you have evaluation data and want systematic prompt improvement

---

## 🗄️ Vector Databases

### Chroma — [trychroma.com](https://trychroma.com)
Lightweight, embedded-first. Zero infrastructure for prototyping. \`pip install chromadb\`

### Pinecone — [pinecone.io](https://pinecone.io)
Managed cloud service. Handles billion-scale vectors with sub-10ms latency. Best for teams that want zero ops overhead.

### Weaviate — [weaviate.io](https://weaviate.io)
Open-source with hybrid search (BM25 + vector). GraphQL API. Strong for complex filtering.

### Qdrant — [qdrant.tech](https://qdrant.tech)
Rust-based, extremely fast. Supports named vectors (store multiple embeddings per object). Great self-hosted option.

### Milvus — [milvus.io](https://milvus.io)
Cloud-native, designed for billion-scale. Used in production at Salesforce, Shopee, and others.

---

## 📊 Observability & Evaluation

### LangSmith — [smith.langchain.com](https://smith.langchain.com)
- Trace every LLM call automatically when using LangChain
- Create datasets from production traces for regression testing
- Run automated evaluations with LLM-as-judge

### Weights & Biases — [wandb.ai](https://wandb.ai)
- Experiment tracking, hyperparameter sweeps, model registry
- **Weave** — new LLM tracing and evaluation product
- Free for individuals; essential for fine-tuning projects

### Arize Phoenix — [phoenix.arize.com](https://phoenix.arize.com)
- Open-source, OpenTelemetry-compatible LLM tracing
- Run locally: \`pip install arize-phoenix\`
- Best for teams that want self-hosted observability

---

## 🚀 Deployment

### Modal — [modal.com](https://modal.com)
Python-native serverless GPU compute. Deploy a fine-tuned model with ~20 lines of code. \`@app.function(gpu="A10G")\` — it's that simple.

### Replicate — [replicate.com](https://replicate.com)
Run thousands of open-source models via API without managing infrastructure. Supports custom model deployment via Cog.

### Hugging Face Spaces — [huggingface.co/spaces](https://huggingface.co/spaces)
Host Gradio or Streamlit demos for free. Upgrade to GPU Spaces for inference. Great for sharing prototypes and demos.

### Ollama — [ollama.com](https://ollama.com)
Run Llama 3, Mistral, Phi-3, Gemma, and others locally. \`ollama run llama3\` — downloads and serves a model in one command. Supports OpenAI-compatible API endpoint.
`,
  },

  'resources/newsletters': {
    slug: 'resources/newsletters',
    title: 'Newsletters & Blogs',
    description:
      'The best newsletters, blogs, and research feeds to stay current with AI developments without drowning in noise.',
    content: `## Newsletters, Blogs & Research Feeds

Staying current in AI requires a curated information diet. Below are the highest signal-to-noise sources, organised by format and cadence.

---

## 📧 Newsletters

### General AI / Research

| Newsletter | Author / Publisher | Cadence | Focus |
|------------|-------------------|---------|-------|
| [The Batch](https://www.deeplearning.ai/the-batch/) | Andrew Ng / DeepLearning.AI | Weekly | Balanced research + industry news with Andrew's editorial commentary |
| [Import AI](https://importai.substack.com) | Jack Clark | Weekly | Deep technical analysis of AI research; one of the oldest and most respected |
| [Ahead of AI](https://magazine.sebastianraschka.com) | Sebastian Raschka | Bi-weekly | In-depth technical articles on LLMs, training, and research trends |
| [NLP News](http://newsletter.ruder.io) | Sebastian Ruder | Monthly | Research-focused; thorough summaries of NLP/ML papers and trends |

### Applied / Engineering

| Newsletter | Author / Publisher | Cadence | Focus |
|------------|-------------------|---------|-------|
| [TLDR AI](https://tldr.tech/ai) | TLDR Media | Daily | Quick-scan digest of AI news, papers, and product launches |
| [AI Breakfast](https://aibreakfast.beehiiv.com) | Various | Daily | Business + technical AI news in a 5-minute read |
| [The Rundown AI](https://www.therundown.ai) | Rowan Cheung | Daily | Practical AI tool coverage; strong on product releases |
| [Latent Space](https://www.latent.space) | swyx & Alessio | Weekly | Long-form technical deep dives and podcast companion; for AI engineers |
| [Last Week in AI](https://lastweekin.ai) | Skynet Today | Weekly | Curated and fact-checked coverage of AI news without hype |

### Research & Papers

| Newsletter | Publisher | Focus |
|------------|-----------|-------|
| [Papers With Code Newsletter](https://paperswithcode.com) | Papers With Code | State-of-the-art results and new benchmarks |
| [Hugging Face Blog](https://huggingface.co/blog) | Hugging Face | Model releases, techniques, community projects |
| [Anthropic Research](https://www.anthropic.com/research) | Anthropic | Alignment, interpretability, and safety research |
| [Google DeepMind Blog](https://deepmind.google/research/publications/) | Google DeepMind | Frontier research publications |

---

## ✍️ High-Signal Blogs

### Individual Researchers & Engineers

#### Lilian Weng — [lilianweng.github.io](https://lilianweng.github.io)
OpenAI's Head of Safety (formerly). Her posts are the gold standard for clear, rigorous explanations of complex topics:
- *"The Attention Mechanism"* — definitive multi-head attention breakdown
- *"Prompt Engineering"* — comprehensive survey of techniques
- *"LLM Powered Autonomous Agents"* — essential reading for agent architecture
- *"Extrinsic Hallucinations in LLMs"* — critical survey for production systems

#### Sebastian Ruder — [ruder.io](https://ruder.io)
NLP researcher (Google DeepMind). Detailed survey posts on transfer learning, multilingual NLP, and prompt tuning. His PhD thesis on transfer learning is freely available and widely cited.

#### Eugene Yan — [eugeneyan.com](https://eugeneyan.com)
Applied scientist (Amazon). Practitioner-focused writing on:
- RAG patterns in production
- LLM evaluation strategies
- Recommender systems
- Writing clearly about technical work

#### Sebastian Raschka — [magazine.sebastianraschka.com](https://magazine.sebastianraschka.com)
Professor → independent researcher. Detailed technical breakdowns of LLM training, LoRA, quantisation, and new architectures. Code-heavy; always reproducible.

#### Jay Alammar — [jalammar.github.io](https://jalammar.github.io)
Visual explainer of ML concepts:
- *The Illustrated Transformer* — most-shared transformer explainer ever
- *The Illustrated BERT, ELMo* — embedding model visualisations
- *How GPT Works* — step-by-step token generation walkthrough

#### Andrej Karpathy — [karpathy.github.io](https://karpathy.github.io) / [karpathy.ai](https://karpathy.ai)
Former OpenAI / Tesla AI director. His blog posts (though infrequent) are landmark pieces:
- *"Software 2.0"* — the paradigm shift framing that defined the field
- *"The Unreasonable Effectiveness of Recurrent Neural Networks"* — classic

#### Simon Willison — [simonwillison.net](https://simonwillison.net)
Prolific practitioner. Daily notes on LLM tool usage, security concerns (prompt injection), and practical experiments. Maintains the \`llm\` CLI tool.

---

## 📄 Research Paper Sources

### Staying Up-to-Date with Papers

- **[Papers With Code](https://paperswithcode.com)** — New papers ranked by GitHub stars + code. Filter by task (e.g., "text generation", "RAG"). Invaluable for tracking SOTA.
- **[Arxiv Sanity](https://arxiv-sanity-lite.com)** — Andrej Karpathy's paper recommendation engine over arxiv. Subscribe to get personalised feeds.
- **[Semantic Scholar](https://semanticscholar.org)** — AI-powered research discovery. Set up alerts for specific topics.
- **[Connected Papers](https://connectedpapers.com)** — Visual graph of papers related to any given paper. Great for literature review.
- **[Arxiv CS.LG / CS.CL](https://arxiv.org/list/cs.LG/recent)** — Raw arxiv feeds for machine learning and computation + language.

---

## 🎙️ Podcasts

| Podcast | Focus | Cadence |
|---------|-------|---------|
| [Latent Space](https://www.latent.space/podcast) | AI engineering, infrastructure, developer tools | Weekly |
| [Lex Fridman Podcast](https://lexfridman.com/podcast/) | Long-form researcher interviews | Irregular |
| [TWIML AI Podcast](https://twimlai.com) | Research and applied ML interviews | Weekly |
| [Practical AI](https://changelog.com/practicalai) | Practical ML engineering | Weekly |
| [The MLOps Podcast](https://mlops.community/podcast/) | Production ML, MLOps, LLMOps | Weekly |
| [No Priors](https://www.sequoiacap.com/no-priors-podcast/) | AI founders and researchers (Sequoia) | Weekly |

---

## 📌 Tips for Managing Information Overload

1. **Pick 1–2 daily digests** (TLDR AI or The Rundown) and **1–2 deep-dive newsletters** (Ahead of AI, Latent Space). Don't subscribe to everything.
2. **Use an RSS reader** (Feedly, Reeder) to consolidate blogs — set up folders for "read now" vs "read later".
3. **Papers With Code alerts** — subscribe to your specific tasks rather than following everything.
4. **Save to Pocket / Readwise** — long Lilian Weng posts deserve focused reading time, not a quick scroll.
5. **Batch your reading** — many practitioners block 30 minutes on Friday mornings specifically for newsletters.
`,
  },
}
