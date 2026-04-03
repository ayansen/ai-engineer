import type { DocsContentMap } from './types'

export const ragContent: DocsContentMap = {
  'rag/overview': {
    slug: 'rag/overview',
    title: 'RAG & Vector Databases Overview',
    description:
      'Learn what Retrieval-Augmented Generation (RAG) is, why it outperforms fine-tuning for knowledge-intensive tasks, and how its pipeline components fit together.',
    content: `## What Is Retrieval-Augmented Generation (RAG)?

Retrieval-Augmented Generation (RAG) is an AI architecture that enhances large language models (LLMs) by coupling them with an external knowledge retrieval step. Instead of relying solely on knowledge baked into model weights during training, RAG **retrieves relevant documents at inference time** and injects them into the prompt before generation.

The core idea is simple:

1. A user submits a question.
2. The system converts the question into an embedding and searches a vector store for the most relevant document chunks.
3. Those chunks are prepended to the LLM prompt as context.
4. The LLM generates an answer grounded in the retrieved evidence.

This architecture was introduced in the 2020 paper *"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"* by Lewis et al. (Facebook AI Research) and has since become one of the most widely adopted patterns in production AI systems.

---

## Why RAG? Comparing Alternatives

### RAG vs. Fine-Tuning

Fine-tuning updates model weights on a domain-specific dataset. This is expensive, slow, and requires retraining every time your knowledge base changes. RAG keeps the base model frozen and simply updates the vector store — making it **orders of magnitude cheaper to maintain**.

| Criterion | Fine-Tuning | RAG |
|---|---|---|
| Knowledge freshness | Requires retraining | Update vector store only |
| Cost | High (GPU compute) | Low (embedding + storage) |
| Hallucination control | Limited | Strong (grounded in sources) |
| Transparency | Black box | Can cite retrieved chunks |
| Setup complexity | High | Medium |

### RAG vs. Larger Context Windows

Models like GPT-4o now support 128k token context windows, tempting engineers to simply stuff all documents into the prompt. This approach has critical drawbacks:

- **Cost**: Pricing is per token — large contexts are expensive at scale.
- **Latency**: Time-to-first-token grows with context length.
- **Lost-in-the-middle problem**: LLMs perform worse on information buried in the middle of long contexts (Liu et al., 2023).
- **Context limits**: Most enterprise knowledge bases are millions of tokens — far beyond any current context window.

RAG selectively retrieves only the most relevant 3–10 chunks, keeping prompts lean and accurate.

---

## RAG Pipeline Components

A production RAG system consists of two phases:

### Indexing Pipeline (Offline)
\`\`\`
Raw Documents → Chunking → Embedding Model → Vector Store
\`\`\`

1. **Document Loader** — ingests PDFs, HTML, Markdown, databases, APIs.
2. **Text Splitter** — breaks documents into overlapping chunks (e.g., 512 tokens with 50-token overlap).
3. **Embedding Model** — converts each chunk into a dense vector (e.g., 1536-dim for OpenAI's \`text-embedding-3-small\`).
4. **Vector Store** — persists embeddings with metadata (Chroma, Pinecone, Qdrant, Weaviate).

### Query Pipeline (Online)
\`\`\`
User Query → Embed → Retrieve → Augment Prompt → Generate → Response
\`\`\`

1. **Query Embedding** — same model used at index time.
2. **Similarity Search** — ANN search returns top-k chunks.
3. **Prompt Augmentation** — chunks injected as context into the system prompt.
4. **LLM Generation** — model produces a grounded, cited answer.

---

## Common Use Cases

- **Document Q&A** — query internal PDFs, legal contracts, research papers.
- **Customer Support** — ground chatbot responses in product documentation and FAQs.
- **Knowledge Bases** — enterprise wikis, Confluence spaces, Notion databases.
- **Code Assistants** — retrieve relevant code snippets and API docs.
- **Medical / Legal** — provide answers with citations to authoritative sources.
- **Financial Analysis** — query earnings reports, SEC filings, analyst notes.

RAG is now the default architecture for any application that needs an LLM to reason over a **private, dynamic, or large-scale** corpus of information.
`,
  },

  'rag/embeddings': {
    slug: 'rag/embeddings',
    title: 'Embeddings & Semantic Search',
    description:
      'Understand what embeddings are, how they evolved from Word2Vec to modern sentence transformers, and how cosine similarity powers semantic search in RAG pipelines.',
    content: `## What Are Embeddings?

An **embedding** is a dense vector of floating-point numbers that represents a piece of text (a word, sentence, paragraph, or document) in a high-dimensional semantic space. The key property is that **semantically similar texts are geometrically close** in that space.

\`\`\`python
# Conceptual illustration
"dog"  → [0.21, -0.45, 0.88, ...]   # 1536 dimensions
"cat"  → [0.19, -0.41, 0.85, ...]   # close to "dog"
"car"  → [-0.72, 0.33, -0.12, ...]  # far from "dog"
\`\`\`

This geometric structure enables **semantic search**: finding documents that are *meaningfully related* to a query, even if they share no keywords.

---

## A Brief History

### Word2Vec (2013)
Mikolov et al. at Google introduced Word2Vec, which learned word-level embeddings via two architectures (CBOW and Skip-gram). It famously captured analogical reasoning:

\`\`\`
king - man + woman ≈ queen
\`\`\`

But Word2Vec produced a single static vector per word — "bank" had one vector regardless of whether it meant a river bank or a financial institution.

### GloVe & FastText
GloVe (Stanford, 2014) used global co-occurrence statistics. FastText (Facebook, 2017) added subword embeddings, handling morphological variations and out-of-vocabulary words.

### BERT & Contextual Embeddings (2018)
Google's BERT produced **contextual** word embeddings — the same word gets a different vector depending on its sentence context. However, BERT's \`[CLS]\` token embeddings performed poorly for semantic similarity out of the box.

### Sentence Transformers (2019–present)
Reimers & Gurevych fine-tuned BERT-style models with **siamese and triplet networks** on NLI and STS datasets, producing sentence-level embeddings optimized for semantic similarity. This is the foundation of modern RAG retrieval.

---

## Modern Embedding Models

| Model | Dimensions | Max Tokens | Notes |
|---|---|---|---|
| \`text-embedding-3-small\` (OpenAI) | 1536 | 8191 | Best price/performance |
| \`text-embedding-3-large\` (OpenAI) | 3072 | 8191 | Highest accuracy |
| \`all-MiniLM-L6-v2\` (SBERT) | 384 | 256 | Fast, local, free |
| \`all-mpnet-base-v2\` (SBERT) | 768 | 384 | Strong local model |
| \`bge-large-en-v1.5\` (BAAI) | 1024 | 512 | Top open-source on MTEB |
| \`e5-large-v2\` (Microsoft) | 1024 | 512 | Excellent retrieval |

---

## Generating Embeddings with Sentence Transformers

\`\`\`bash
pip install sentence-transformers
\`\`\`

\`\`\`python
from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

documents = [
    "RAG combines retrieval with generation for better AI responses.",
    "Vector databases store high-dimensional embeddings efficiently.",
    "Fine-tuning updates model weights on domain-specific data.",
    "Cosine similarity measures the angle between two vectors.",
]

# Encode documents → shape: (4, 384)
doc_embeddings = model.encode(documents, normalize_embeddings=True)

query = "How does retrieval-augmented generation work?"
query_embedding = model.encode([query], normalize_embeddings=True)

# Cosine similarity (dot product since vectors are normalized)
scores = np.dot(query_embedding, doc_embeddings.T)[0]

# Rank results
ranked = sorted(zip(scores, documents), reverse=True)
for score, doc in ranked:
    print(f"{score:.4f}  {doc}")
\`\`\`

**Output:**
\`\`\`
0.8231  RAG combines retrieval with generation for better AI responses.
0.5417  Vector databases store high-dimensional embeddings efficiently.
0.3102  Fine-tuning updates model weights on domain-specific data.
0.2891  Cosine similarity measures the angle between two vectors.
\`\`\`

---

## Cosine Similarity

Cosine similarity measures the **angle** between two vectors, making it scale-invariant (a long document and a short one expressing the same idea score similarly):

\`\`\`
cos(θ) = (A · B) / (|A| × |B|)
\`\`\`

- **1.0** → identical meaning
- **0.0** → orthogonal (unrelated)
- **-1.0** → opposite meaning

When embeddings are L2-normalized (unit vectors), cosine similarity equals the **dot product**, enabling fast matrix multiplication for batch scoring.

---

## Practical Tips

- **Normalize embeddings** at index and query time to use dot product instead of full cosine calculation.
- Use the **same model** for indexing and querying — mismatched models produce meaningless similarity scores.
- For long documents, embed **chunks** (256–512 tokens), not full documents.
- **Instruction-tuned embedding models** like \`e5\` or \`bge\` accept prefixes like \`"query: "\` and \`"passage: "\` to improve retrieval accuracy.

\`\`\`python
# Instruction-tuned embedding with BGE
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("BAAI/bge-large-en-v1.5")

query = "query: What is retrieval-augmented generation?"
passages = [
    "passage: RAG retrieves relevant documents before generating answers.",
    "passage: The Eiffel Tower is located in Paris, France.",
]

q_emb = model.encode(query, normalize_embeddings=True)
p_embs = model.encode(passages, normalize_embeddings=True)

import numpy as np
print(np.dot(q_emb, p_embs.T))  # [0.87, 0.12]
\`\`\`
`,
  },

  'rag/vector-databases': {
    slug: 'rag/vector-databases',
    title: 'Vector Databases',
    description:
      'Explore how vector databases store and index embeddings, compare FAISS, Pinecone, Weaviate, Chroma, and Qdrant, and learn when to use each.',
    content: `## What Is a Vector Database?

A **vector database** is a data store optimized for storing, indexing, and querying high-dimensional embedding vectors. Unlike relational databases that excel at exact keyword matches, vector databases perform **approximate nearest neighbor (ANN) search** — finding the k vectors most similar to a query vector in milliseconds, even across millions of entries.

---

## Approximate Nearest Neighbor (ANN) Search

Exact nearest neighbor search requires computing distance to every stored vector — O(n) — which is prohibitively slow at scale. ANN algorithms trade a small accuracy loss for dramatic speed gains using index structures:

### HNSW (Hierarchical Navigable Small World)
The dominant ANN algorithm in production. It builds a multi-layer graph where each node connects to its nearest neighbors. Search starts at the top (sparse) layer and navigates down to the dense layer.

- **Pros**: Excellent recall/speed tradeoff, supports incremental inserts.
- **Cons**: High memory usage (graph stored in RAM).

### IVF (Inverted File Index)
Partitions the space into Voronoi cells using k-means. At query time, only the nearest N cells are searched.

- **Pros**: Lower memory than HNSW.
- **Cons**: Slower inserts, requires training phase.

### Product Quantization (PQ)
Compresses vectors by splitting them into subvectors and quantizing each — reduces memory 4–32×.

---

## Comparing Vector Databases

| Feature | FAISS | Chroma | Qdrant | Pinecone | Weaviate |
|---|---|---|---|---|---|
| Type | Library | Embedded/Server | Server | Managed Cloud | Server/Cloud |
| ANN Algorithm | IVF, HNSW, PQ | HNSW | HNSW | Proprietary | HNSW |
| Persistence | Optional | Yes | Yes | Yes | Yes |
| Filtering | Basic | Yes | Rich | Yes | Rich |
| Managed Cloud | ❌ | ❌ | ✅ | ✅ | ✅ |
| Open Source | ✅ | ✅ | ✅ | ❌ | ✅ |
| Best For | Research/batch | Prototyping | Production OSS | Serverless | Multi-modal |

### FAISS (Facebook AI Similarity Search)
A C++ library (with Python bindings) from Meta. Ideal for offline batch processing and research — not a server, just a library.

\`\`\`python
import faiss
import numpy as np

d = 384  # embedding dimension
index = faiss.IndexHNSWFlat(d, 32)  # M=32 neighbors

vectors = np.random.rand(10000, d).astype("float32")
index.add(vectors)

query = np.random.rand(1, d).astype("float32")
distances, indices = index.search(query, k=5)
print(indices)  # top-5 nearest neighbor indices
\`\`\`

### Chroma
The go-to choice for **rapid prototyping and local development**. Zero infrastructure required — runs embedded in-process.

\`\`\`bash
pip install chromadb
\`\`\`

\`\`\`python
import chromadb
from chromadb.utils import embedding_functions

client = chromadb.PersistentClient(path="./chroma_db")

ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

collection = client.get_or_create_collection(
    name="my_docs",
    embedding_function=ef,
    metadata={"hnsw:space": "cosine"},
)

collection.add(
    documents=["RAG retrieves relevant context before generation.",
               "HNSW is an efficient approximate nearest neighbor algorithm."],
    ids=["doc1", "doc2"],
    metadatas=[{"source": "intro.md"}, {"source": "algorithms.md"}],
)

results = collection.query(
    query_texts=["How does retrieval work in RAG?"],
    n_results=2,
    include=["documents", "distances", "metadatas"],
)
print(results["documents"])
\`\`\`

### Qdrant
A Rust-based vector database with a rich **payload filtering** system. Ideal for production deployments where you need to combine vector similarity with structured filters (e.g., "find similar docs *where* category='finance' AND date > 2024-01-01").

\`\`\`python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

client = QdrantClient(":memory:")  # or url="http://localhost:6333"

client.create_collection(
    collection_name="docs",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

client.upsert(
    collection_name="docs",
    points=[
        PointStruct(id=1, vector=[0.1]*384, payload={"text": "RAG overview", "category": "ai"}),
    ],
)

hits = client.search(
    collection_name="docs",
    query_vector=[0.1]*384,
    limit=5,
    query_filter={"must": [{"key": "category", "match": {"value": "ai"}}]},
)
\`\`\`

### Pinecone
A fully managed, serverless vector database. Zero infrastructure to maintain — ideal for teams that want to ship fast without operating a database cluster.

### Weaviate
Supports **multi-modal search** (text, images), has built-in vectorizers, and offers a GraphQL API. Excellent for complex knowledge graph use cases.

---

## Choosing a Vector Database

- **Prototyping / local dev** → **Chroma** (zero setup)
- **Research / batch offline** → **FAISS** (maximum control)
- **Production OSS, rich filtering** → **Qdrant** (best-in-class filters, Rust performance)
- **Fully managed, no ops** → **Pinecone** (serverless, scales automatically)
- **Multi-modal / GraphQL** → **Weaviate**
`,
  },

  'rag/building-rag': {
    slug: 'rag/building-rag',
    title: 'Building a RAG Pipeline',
    description:
      'Step-by-step guide to implementing a production-ready RAG system: document loading, chunking, embedding, ingestion, retrieval, and generation with LangChain.',
    content: `## Building a RAG Pipeline from Scratch

This guide walks through every layer of a production RAG system, from raw documents to a working Q&A chain, using **LangChain** and **ChromaDB**.

\`\`\`bash
pip install langchain langchain-openai langchain-community chromadb tiktoken pypdf
\`\`\`

---

## Step 1: Document Loading

LangChain provides loaders for virtually every document format.

\`\`\`python
from langchain_community.document_loaders import (
    PyPDFLoader,
    DirectoryLoader,
    WebBaseLoader,
    TextLoader,
)

# Load a single PDF
loader = PyPDFLoader("docs/annual_report.pdf")
pages = loader.load()
print(f"Loaded {len(pages)} pages")

# Load all PDFs from a directory
dir_loader = DirectoryLoader("./docs", glob="**/*.pdf", loader_cls=PyPDFLoader)
documents = dir_loader.load()

# Load a webpage
web_loader = WebBaseLoader("https://en.wikipedia.org/wiki/Retrieval-augmented_generation")
web_docs = web_loader.load()
\`\`\`

Each document has a \`page_content\` string and a \`metadata\` dict (source, page number, etc.).

---

## Step 2: Chunking Strategies

Chunking is one of the most impactful decisions in a RAG system. The goal is to create chunks that are:
- **Small enough** to be relevant to a narrow query.
- **Large enough** to contain sufficient context for the LLM.

### Fixed-Size Chunking (Baseline)

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,        # characters (not tokens)
    chunk_overlap=50,      # overlap prevents cutting context at boundaries
    separators=["\n\n", "\n", ". ", " ", ""],
)
chunks = splitter.split_documents(documents)
print(f"Created {len(chunks)} chunks")
\`\`\`

The \`RecursiveCharacterTextSplitter\` tries to split on paragraph breaks first, then newlines, then sentences — preserving semantic boundaries.

### Token-Aware Chunking

\`\`\`python
from langchain.text_splitter import TokenTextSplitter

token_splitter = TokenTextSplitter(
    encoding_name="cl100k_base",  # GPT-4 tokenizer
    chunk_size=256,               # tokens
    chunk_overlap=20,
)
chunks = token_splitter.split_documents(documents)
\`\`\`

Use token-aware splitting when feeding chunks directly into an LLM with a token limit.

### Chunking Strategy Comparison

| Strategy | Pros | Cons |
|---|---|---|
| Fixed character | Simple, predictable | May split mid-sentence |
| Recursive character | Respects natural boundaries | Slightly more complex |
| Token-aware | Precise LLM budget control | Requires tokenizer |
| Semantic (sentence-level) | Best semantic coherence | Slower, variable sizes |
| Markdown/HTML-aware | Structure-preserving | Format-specific |

---

## Step 3: Embedding & Vector Store Ingestion

\`\`\`python
import os
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

os.environ["OPENAI_API_KEY"] = "sk-..."

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Create vector store and ingest all chunks in one call
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db",
    collection_name="my_rag_docs",
)

print(f"Ingested {vectorstore._collection.count()} chunks")
\`\`\`

For large corpora, batch ingestion to avoid rate limits:

\`\`\`python
from langchain_community.vectorstores import Chroma

BATCH_SIZE = 100
vectorstore = Chroma(
    embedding_function=embeddings,
    persist_directory="./chroma_db",
)

for i in range(0, len(chunks), BATCH_SIZE):
    batch = chunks[i : i + BATCH_SIZE]
    vectorstore.add_documents(batch)
    print(f"Ingested batch {i // BATCH_SIZE + 1}")
\`\`\`

---

## Step 4: Retrieval

\`\`\`python
# Load existing vector store
vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings,
    collection_name="my_rag_docs",
)

retriever = vectorstore.as_retriever(
    search_type="similarity",   # or "mmr" for diversity
    search_kwargs={"k": 4},     # return top-4 chunks
)

docs = retriever.invoke("What are the key risks mentioned in the annual report?")
for doc in docs:
    print(doc.metadata["source"], ":", doc.page_content[:200])
\`\`\`

**MMR (Maximal Marginal Relevance)** retrieval reduces redundancy by balancing similarity with diversity:

\`\`\`python
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 4, "fetch_k": 20, "lambda_mult": 0.5},
)
\`\`\`

---

## Step 5: Generation — Full RAG Chain

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = ChatPromptTemplate.from_template("""
You are a helpful assistant. Answer the question based ONLY on the following context.
If the context does not contain enough information, say "I don't know."

Context:
{context}

Question: {question}

Answer:
""")

def format_docs(docs):
    return "\n\n---\n\n".join(
        f"[Source: {doc.metadata.get('source', 'unknown')}]\n{doc.page_content}"
        for doc in docs
    )

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

answer = rag_chain.invoke("What are the key risks in the annual report?")
print(answer)
\`\`\`

---

## Complete End-to-End Script

\`\`\`python
# rag_pipeline.py
import os
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

os.environ["OPENAI_API_KEY"] = "sk-..."

# 1. Load
loader = DirectoryLoader("./docs", glob="**/*.pdf", loader_cls=PyPDFLoader)
docs = loader.load()

# 2. Chunk
splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50)
chunks = splitter.split_documents(docs)

# 3. Embed & Store
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(chunks, embeddings, persist_directory="./db")

# 4. Retrieve & Generate
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
llm = ChatOpenAI(model="gpt-4o-mini")
prompt = ChatPromptTemplate.from_template(
    "Answer based on context only.\n\nContext:\n{context}\n\nQuestion: {question}"
)
chain = (
    {"context": retriever | (lambda d: "\n\n".join(x.page_content for x in d)),
     "question": RunnablePassthrough()}
    | prompt | llm | StrOutputParser()
)

print(chain.invoke("Summarize the main findings."))
\`\`\`
`,
  },

  'rag/advanced-rag': {
    slug: 'rag/advanced-rag',
    title: 'Advanced RAG Techniques',
    description:
      'Go beyond basic RAG with hybrid search, reranking, HyDE, multi-query retrieval, parent document retrieval, RAPTOR, and evaluation with RAGAS.',
    content: `## Beyond Naive RAG

Naive RAG — embed query → retrieve top-k → generate — has well-known failure modes:

- **Semantic gap**: The query and answer use different vocabulary.
- **Redundant results**: Top-k chunks are near-duplicates of each other.
- **Missing context**: The relevant chunk is nearby but not the best semantic match.
- **No evaluation**: No systematic way to measure retrieval or generation quality.

Advanced RAG techniques address each of these failure modes.

---

## 1. Hybrid Search (Sparse + Dense)

Combine **BM25** (keyword/sparse retrieval) with **dense vector** retrieval, then fuse scores. This captures both exact keyword matches (critical for named entities, product codes) and semantic similarity.

\`\`\`python
from langchain_community.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

# Dense retriever
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma(persist_directory="./db", embedding_function=embeddings)
dense_retriever = vectorstore.as_retriever(search_kwargs={"k": 10})

# Sparse retriever (BM25)
bm25_retriever = BM25Retriever.from_documents(chunks)
bm25_retriever.k = 10

# Ensemble with Reciprocal Rank Fusion
hybrid_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, dense_retriever],
    weights=[0.4, 0.6],  # tune based on your domain
)

docs = hybrid_retriever.invoke("What is the revenue for Q3 2024?")
\`\`\`

**Reciprocal Rank Fusion (RRF)** score for a document *d* given ranked lists:
\`\`\`
RRF(d) = Σ 1 / (k + rank_i(d))    where k=60 is a smoothing constant
\`\`\`

---

## 2. Reranking with Cross-Encoders

Vector similarity is a **bi-encoder** approach — query and document are encoded independently. A **cross-encoder** processes the (query, document) pair jointly, producing a much more accurate relevance score — at the cost of being too slow to run over the entire corpus.

The solution: **retrieve 20–50 candidates with ANN, then rerank with a cross-encoder**.

\`\`\`python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

query = "What causes hallucinations in LLMs?"
candidate_docs = hybrid_retriever.invoke(query)  # 20 candidates

# Score each (query, document) pair
pairs = [(query, doc.page_content) for doc in candidate_docs]
scores = reranker.predict(pairs)

# Re-sort by cross-encoder score
reranked = sorted(zip(scores, candidate_docs), reverse=True)
top_docs = [doc for _, doc in reranked[:4]]  # keep top 4 for generation
\`\`\`

Alternatively, use Cohere's managed reranking API:

\`\`\`python
import cohere

co = cohere.Client("YOUR_COHERE_API_KEY")
results = co.rerank(
    query=query,
    documents=[doc.page_content for doc in candidate_docs],
    top_n=4,
    model="rerank-english-v3.0",
)
\`\`\`

---

## 3. HyDE — Hypothetical Document Embeddings

**Problem**: Query embeddings often differ stylistically from document embeddings (questions vs. declarative prose).

**Solution**: Ask the LLM to generate a *hypothetical* answer to the query, then embed that hypothetical answer. This hypothetical document lives in the same embedding space as real documents, closing the semantic gap.

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

hyde_prompt = ChatPromptTemplate.from_template("""
Write a concise, factual paragraph that would answer the following question.
Do not mention that this is a hypothetical answer.

Question: {question}
""")

hyde_chain = hyde_prompt | llm | StrOutputParser()

query = "How does HNSW indexing work?"
hypothetical_doc = hyde_chain.invoke({"question": query})

# Now retrieve using the hypothetical document embedding
docs = vectorstore.similarity_search(hypothetical_doc, k=4)
\`\`\`

---

## 4. Multi-Query Retrieval

Different phrasings of the same question retrieve different documents. Generate N query variants, retrieve for each, and deduplicate.

\`\`\`python
from langchain.retrievers.multi_query import MultiQueryRetriever

multi_retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(search_kwargs={"k": 4}),
    llm=llm,
)

# Internally generates ~3 query variants, retrieves for each, deduplicates
docs = multi_retriever.invoke("How do I reduce LLM hallucinations?")
print(f"Retrieved {len(docs)} unique documents")
\`\`\`

---

## 5. Parent Document Retrieval

**Problem**: Small chunks have high retrieval precision but lose surrounding context.

**Solution**: Store small child chunks for retrieval, but return their larger parent document to the LLM. This gives you the best of both worlds.

\`\`\`python
from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore
from langchain.text_splitter import RecursiveCharacterTextSplitter

parent_splitter = RecursiveCharacterTextSplitter(chunk_size=2000)
child_splitter = RecursiveCharacterTextSplitter(chunk_size=400)

store = InMemoryStore()  # swap for Redis/DynamoDB in production
retriever = ParentDocumentRetriever(
    vectorstore=vectorstore,
    docstore=store,
    child_splitter=child_splitter,
    parent_splitter=parent_splitter,
)

retriever.add_documents(docs)
results = retriever.invoke("Explain the retrieval process")
# Returns full parent chunks (~2000 chars) rather than child chunks (~400 chars)
\`\`\`

---

## 6. RAPTOR — Recursive Abstractive Processing

RAPTOR (Sarthi et al., 2024) builds a **tree of summaries** over your document corpus:
1. Cluster leaf-level chunks using Gaussian Mixture Models on their embeddings.
2. Summarize each cluster with an LLM.
3. Embed the summaries and cluster again.
4. Repeat until a single root summary.

At query time, retrieve from **all tree levels** — catching both fine-grained details and high-level concepts.

---

## 7. RAG Evaluation with RAGAS

\`\`\`bash
pip install ragas
\`\`\`

RAGAS measures four key metrics without needing human labels:

| Metric | Measures |
|---|---|
| **Faithfulness** | Is the answer grounded in the retrieved context? |
| **Answer Relevancy** | Does the answer address the question? |
| **Context Precision** | Are the retrieved chunks actually relevant? |
| **Context Recall** | Did retrieval capture all necessary information? |

\`\`\`python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall
from datasets import Dataset

data = {
    "question": ["What is RAG?", "How does HNSW work?"],
    "answer": ["RAG combines retrieval with generation...", "HNSW builds a hierarchical graph..."],
    "contexts": [
        ["RAG retrieves relevant documents...", "The retrieval step uses ANN search..."],
        ["HNSW is a graph-based ANN algorithm...", "Nodes are connected to their neighbors..."],
    ],
    "ground_truth": [
        "RAG is a technique that retrieves documents before generating an answer.",
        "HNSW builds a multi-layer graph for fast approximate nearest neighbor search.",
    ],
}

dataset = Dataset.from_dict(data)
results = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_precision, context_recall])
print(results)
# {'faithfulness': 0.92, 'answer_relevancy': 0.88, 'context_precision': 0.85, 'context_recall': 0.79}
\`\`\`

---

## Putting It All Together: Advanced RAG Architecture

\`\`\`
User Query
    │
    ├── Multi-Query Expansion (3 variants)
    │        │
    │   ┌────┴────┐
    │   │ BM25   │ Dense Vector  ←─ Hybrid Search per query variant
    │   └────┬────┘
    │        │
    │   RRF Fusion → 50 candidates
    │        │
    │   Cross-Encoder Reranking → top 5
    │        │
    │   Parent Document Expansion → full context chunks
    │        │
    └── LLM Generation with Citations
            │
         Response + Sources
\`\`\`

This architecture consistently achieves **15–30% higher answer quality** over naive RAG on standard benchmarks, making the added complexity worthwhile for production systems.
`,
  },
}
