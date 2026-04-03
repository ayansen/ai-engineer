import type { DocsContentMap } from './types'

export const llmsContent: DocsContentMap = {
  'llms/overview': {
    slug: 'llms/overview',
    title: 'LLMs & Generative AI Overview',
    description:
      'An introduction to Large Language Models, the current AI landscape including GPT-4, Claude, and Gemini, and their real-world use cases, capabilities, and limitations.',
    content: `## What Are Large Language Models?

Large Language Models (LLMs) are deep learning models trained on massive text corpora to understand and generate human language. They belong to a class of **generative AI** systems — models that produce new content rather than simply classifying or ranking existing data.

LLMs are built on the **Transformer architecture** (introduced by Google in 2017) and are trained using a self-supervised objective: predict the next token given a sequence of prior tokens. After training on billions or trillions of tokens, these models develop emergent capabilities — the ability to reason, translate, summarize, write code, and much more — without being explicitly programmed for any of those tasks.

---

## The Current LLM Landscape

| Model | Creator | Context Window | Strengths |
|---|---|---|---|
| GPT-4o | OpenAI | 128K tokens | Coding, reasoning, multimodal |
| Claude 3.5 Sonnet | Anthropic | 200K tokens | Long documents, instruction-following, safety |
| Gemini 1.5 Pro | Google DeepMind | 1M tokens | Extremely long context, multimodal |
| Llama 3.1 405B | Meta | 128K tokens | Open weights, on-premise deployment |
| Mistral Large | Mistral AI | 128K tokens | Efficiency, European data residency |
| Command R+ | Cohere | 128K tokens | RAG, enterprise search |

### Closed vs Open Models

**Closed-source models** (GPT-4, Claude, Gemini) are accessible only via API. They are typically the most capable and are continually updated by their vendors.

**Open-weight models** (Llama, Mistral, Phi) allow you to download and run the model weights yourself, enabling fine-tuning, private deployment, and full control over data.

---

## Key Use Cases

### Text Generation & Summarization
- Summarize long documents, research papers, or meeting transcripts
- Draft emails, reports, blog posts, and marketing copy
- Translate between languages with nuance

### Code Generation & Assistance
- Generate boilerplate, unit tests, and documentation
- Explain complex code snippets
- Debug errors and suggest refactors

### Question Answering & RAG
- Answer questions grounded in proprietary documents (Retrieval-Augmented Generation)
- Build internal knowledge bases and customer support bots

### Reasoning & Analysis
- Extract structured data from unstructured text
- Classify sentiment, intent, or topic
- Perform multi-step reasoning over complex problems

### Agents & Tool Use
- Orchestrate sequences of actions (web search, code execution, API calls)
- Power autonomous workflows that plan and adapt

---

## Capabilities

- **In-context learning**: LLMs can learn new tasks from a handful of examples provided in the prompt — no retraining required.
- **Instruction following**: Modern models are fine-tuned with human feedback (RLHF/RLAIF) to follow natural language instructions reliably.
- **Multimodality**: Leading models accept text, images, audio, and video as input.
- **Long context**: Models with 100K–1M token windows can process entire codebases or books in a single call.

---

## Limitations

- **Hallucinations**: LLMs confidently generate false information. Always ground critical outputs in verified sources.
- **Knowledge cutoff**: Models have a training cutoff date and do not know about recent events unless given retrieval tools.
- **Context window constraints**: Even large windows have limits; very long inputs may cause the model to lose track of earlier content.
- **Cost and latency**: Large model APIs are expensive at scale; latency can be a barrier for real-time applications.
- **Bias and safety risks**: Models reflect biases present in training data and can produce harmful outputs without proper guardrails.
- **Lack of persistent memory**: Each API call is stateless; conversation history must be managed explicitly.

---

## Choosing the Right Model

When selecting an LLM for your application, consider:

1. **Task complexity** — simple classification vs. multi-step reasoning
2. **Context length** — how much text do you need to process at once?
3. **Latency requirements** — real-time vs. batch processing
4. **Data privacy** — can data leave your infrastructure?
5. **Cost** — token pricing varies by 10–100× across models
6. **Fine-tuning needs** — do you need to customize model behavior?

Start with the most capable hosted model for prototyping, then optimize for cost and latency once you understand your requirements.
`,
  },

  'llms/how-llms-work': {
    slug: 'llms/how-llms-work',
    title: 'How LLMs Work',
    description:
      'A technical deep dive into tokenization, the Transformer architecture, attention mechanisms, pre-training vs fine-tuning, context windows, and inference parameters like temperature and top-p.',
    content: `## From Text to Tokens

LLMs do not process raw characters — they operate on **tokens**, which are sub-word units produced by a tokenizer. The most common algorithm is **Byte Pair Encoding (BPE)**, which merges frequent character pairs iteratively to build a vocabulary of ~50,000–100,000 tokens.

\`\`\`python
import tiktoken  # OpenAI's tokenizer library

enc = tiktoken.encoding_for_model("gpt-4o")
tokens = enc.encode("Hello, world! How are you?")
print(tokens)        # [9906, 11, 1917, 0, 2650, 527, 499, 30]
print(len(tokens))   # 8 tokens for this sentence
\`\`\`

### Why Tokenization Matters
- **Cost**: API pricing is per-token. A page of English text is roughly 500–750 tokens.
- **Context limits**: The model's context window is measured in tokens, not words.
- **Arithmetic quirks**: Numbers and rare words may be split across multiple tokens, which is why LLMs sometimes struggle with character-level tasks.

---

## The Transformer Architecture

The Transformer (Vaswani et al., 2017) is the backbone of every modern LLM. A decoder-only Transformer (used by GPT, Claude, Llama) stacks many identical **blocks**, each containing:

1. **Multi-Head Self-Attention** — lets every token attend to every other token in the context
2. **Feed-Forward Network (FFN)** — a two-layer MLP applied independently to each position
3. **Layer Normalization** — stabilizes training
4. **Residual Connections** — allow gradients to flow through deep networks

### Scaled Dot-Product Attention

For a sequence of tokens, the attention mechanism computes:

\`\`\`
Attention(Q, K, V) = softmax(QKᵀ / √dₖ) · V
\`\`\`

Where:
- **Q** (Query) — what this token is looking for
- **K** (Key) — what each token offers
- **V** (Value) — the actual information to aggregate
- **√dₖ** — scaling factor to prevent vanishing gradients

**Multi-head attention** runs this operation in parallel across \`h\` heads, each learning different relationship patterns (syntactic, semantic, positional, etc.), then concatenates the results.

### Causal Masking

Decoder-only models use a **causal mask** — each token can only attend to tokens that come before it. This ensures the model cannot "see the future" during training and enables autoregressive generation.

---

## Pre-training

During pre-training, the model is trained on a **next-token prediction** objective across a massive dataset (Common Crawl, Wikipedia, books, code repositories, etc.).

- A typical frontier model trains on **1–15 trillion tokens**
- Training requires thousands of GPUs running for months
- The model learns grammar, facts, reasoning patterns, and world knowledge purely from predicting text

---

## Fine-tuning & Alignment

Raw pre-trained models output likely continuations — they don't follow instructions. **Fine-tuning** adapts the base model for practical use:

| Stage | Method | Purpose |
|---|---|---|
| Supervised Fine-Tuning (SFT) | Train on (prompt, response) pairs | Teach instruction-following |
| Reward Modeling | Train classifier on human preference rankings | Learn what humans prefer |
| RLHF / PPO | Optimize policy against reward model | Align outputs with human values |
| DPO | Direct preference optimization (simpler alternative to RLHF) | Alignment without RL |

---

## Context Windows

The **context window** is the maximum number of tokens the model can process in a single forward pass — it includes both the input (prompt) and the output (completion).

| Model | Context Window |
|---|---|
| GPT-3.5 Turbo | 16K |
| GPT-4o | 128K |
| Claude 3.5 Sonnet | 200K |
| Gemini 1.5 Pro | 1M |

> ⚠️ More context ≠ better retrieval. Models degrade in quality with very long contexts ("lost in the middle" problem). For high-stakes retrieval, use RAG rather than stuffing everything into the context.

---

## Inference Parameters

These parameters control the probability distribution over the vocabulary at each generation step:

### Temperature

Scales the logits before applying softmax. Lower = more deterministic; higher = more random.

\`\`\`python
# Deterministic (always picks the highest-probability token)
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "What is 2+2?"}],
    temperature=0.0,
)

# Creative (explores the distribution)
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Write a poem about the ocean."}],
    temperature=0.9,
)
\`\`\`

### Top-p (Nucleus Sampling)

Only samples from the smallest set of tokens whose cumulative probability exceeds \`p\`. \`top_p=0.9\` means the model only considers the top 90% of the probability mass.

### Top-k

Restricts sampling to the \`k\` most likely tokens at each step. Less commonly used than top-p.

### Recommended Settings

| Use Case | Temperature | Top-p |
|---|---|---|
| Factual Q&A / extraction | 0.0 – 0.2 | 1.0 |
| Code generation | 0.2 – 0.4 | 0.95 |
| Summarization | 0.3 – 0.5 | 1.0 |
| Creative writing | 0.7 – 1.0 | 0.95 |

---

## Autoregressive Generation

LLMs generate text **one token at a time**. At each step, the model:

1. Runs a forward pass over all tokens in the context
2. Produces a probability distribution over the vocabulary
3. Samples the next token according to temperature/top-p
4. Appends the token to the context and repeats

This is why generation latency scales linearly with output length, and why **streaming** is important for user-facing applications.
`,
  },

  'llms/prompt-engineering': {
    slug: 'llms/prompt-engineering',
    title: 'Prompt Engineering',
    description:
      'Master zero-shot and few-shot prompting, chain-of-thought reasoning, system prompts, prompt templates, advanced patterns like ReAct and Tree of Thoughts, and strategies to reduce hallucinations.',
    content: `## What Is Prompt Engineering?

Prompt engineering is the practice of crafting inputs to an LLM to reliably elicit high-quality outputs. Because LLMs are sensitive to phrasing, structure, and examples, small changes in a prompt can dramatically affect quality.

---

## Zero-Shot vs Few-Shot Prompting

### Zero-Shot
Ask the model to perform a task with no examples. Works well for tasks the model has seen extensively during training.

\`\`\`
Classify the sentiment of the following review as Positive, Negative, or Neutral.

Review: "The battery life is incredible but the camera is disappointing."
Sentiment:
\`\`\`

### Few-Shot
Provide 2–5 examples of the task before your actual query. Dramatically improves performance on specialized or ambiguous tasks.

\`\`\`
Classify the sentiment of each review.

Review: "Absolutely love this product!" → Positive
Review: "Stopped working after a week." → Negative
Review: "It's okay, nothing special." → Neutral

Review: "The battery life is incredible but the camera is disappointing."
→
\`\`\`

> **Tip**: Few-shot examples should be diverse and representative of the output format you want. Order matters — put the most representative examples last.

---

## Chain-of-Thought (CoT) Prompting

Ask the model to reason step by step before giving a final answer. This dramatically improves performance on math, logic, and multi-step reasoning tasks.

\`\`\`
Q: A train travels at 60 mph. How long does it take to travel 210 miles?

Let's think step by step:
1. Speed = 60 mph, Distance = 210 miles
2. Time = Distance / Speed = 210 / 60
3. Time = 3.5 hours

Answer: 3.5 hours
\`\`\`

### Zero-Shot CoT
Simply adding "Let's think step by step" to any prompt activates chain-of-thought reasoning without needing worked examples:

\`\`\`python
prompt = """
Q: If I have 3 apples and give away 1, then buy 4 more, how many do I have?

Let's think step by step.
"""
\`\`\`

---

## System Prompts

The **system prompt** sets the persona, constraints, and behavioral rules for the model. It is processed before the user's message and has strong influence on model behavior.

\`\`\`python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "system",
            "content": (
                "You are a senior Python engineer. "
                "Always provide production-ready code with type hints, "
                "docstrings, and error handling. "
                "Never use deprecated libraries. "
                "If you are unsure, say so explicitly."
            ),
        },
        {"role": "user", "content": "Write a function to parse a CSV file."},
    ],
)
\`\`\`

### System Prompt Best Practices
- Define the model's **role and expertise**
- Specify the **output format** (JSON, markdown, bullet points)
- List explicit **constraints** (length, tone, prohibited topics)
- Provide **context** the model needs (company name, product details)

---

## Prompt Templates

Use parameterized templates to keep prompts consistent and maintainable:

\`\`\`python
from string import Template

SUMMARIZE_TEMPLATE = Template("""
You are a document analyst. Summarize the following $doc_type in $max_words words or fewer.
Focus on: $focus_areas

Document:
$document

Summary:
""")

prompt = SUMMARIZE_TEMPLATE.substitute(
    doc_type="legal contract",
    max_words=150,
    focus_areas="payment terms, liability clauses, and termination conditions",
    document=contract_text,
)
\`\`\`

---

## Advanced Patterns

### ReAct (Reason + Act)
Interleave reasoning traces with tool calls. The model thinks, acts, observes, and repeats until it has an answer.

\`\`\`
Thought: I need to find the current population of Tokyo.
Action: search("Tokyo population 2024")
Observation: Tokyo's population is approximately 13.96 million.
Thought: I have the answer.
Final Answer: Tokyo's population is approximately 13.96 million people.
\`\`\`

### Tree of Thoughts (ToT)
Generate multiple reasoning branches, evaluate each, and continue from the most promising ones. Useful for complex planning tasks where the first reasoning path may not be optimal.

### Self-Consistency
Sample the same prompt multiple times with non-zero temperature, then take a majority vote over the answers. Significantly improves accuracy on reasoning tasks.

\`\`\`python
answers = []
for _ in range(5):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": cot_prompt}],
        temperature=0.7,
    )
    answers.append(extract_answer(response.choices[0].message.content))

final_answer = max(set(answers), key=answers.count)  # majority vote
\`\`\`

---

## Avoiding Hallucinations

| Strategy | Description |
|---|---|
| Ground in sources | Provide the relevant text; ask the model to cite it |
| Ask for confidence | "If you are not certain, say 'I don't know'" |
| Retrieval-Augmented Generation | Fetch relevant documents at runtime before prompting |
| Chain-of-thought | Step-by-step reasoning reduces confident errors |
| Self-critique | Ask the model to review its own answer for errors |
| Temperature = 0 | Reduces creativity but increases factual consistency |

\`\`\`python
# Grounding example
prompt = f"""
Answer the question using ONLY the context provided. 
If the answer is not in the context, say "I don't know."

Context:
{retrieved_document}

Question: {user_question}
Answer:
"""
\`\`\`

---

## Common Prompt Mistakes

1. **Vague instructions** — "Make it better" → "Rewrite this to be concise and use active voice"
2. **No output format** — Always specify format (JSON, table, numbered list)
3. **Overloaded prompts** — Break complex tasks into smaller chained prompts
4. **Ignoring the system prompt** — Use it to set persistent context and constraints
5. **Not iterating** — Treat prompt development like software development: test, measure, refine
`,
  },

  'llms/working-with-apis': {
    slug: 'llms/working-with-apis',
    title: 'Working with LLM APIs',
    description:
      'A practical guide to the OpenAI and Anthropic APIs: setup, authentication, making chat completion requests, streaming responses, error handling, and managing rate limits with Python.',
    content: `## Overview

The major LLM providers expose their models via REST APIs with official Python (and TypeScript) SDKs. This guide covers the OpenAI and Anthropic APIs — the most widely used in production systems.

---

## Setup & Authentication

### OpenAI

\`\`\`bash
pip install openai
export OPENAI_API_KEY="sk-..."
\`\`\`

\`\`\`python
from openai import OpenAI

client = OpenAI()  # reads OPENAI_API_KEY from environment
\`\`\`

### Anthropic

\`\`\`bash
pip install anthropic
export ANTHROPIC_API_KEY="sk-ant-..."
\`\`\`

\`\`\`python
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from environment
\`\`\`

> **Security**: Never hard-code API keys. Use environment variables or a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.).

---

## Making Chat Completion Requests

### OpenAI

\`\`\`python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain what a context window is in 2 sentences."},
    ],
    temperature=0.3,
    max_tokens=200,
)

print(response.choices[0].message.content)
print(f"Tokens used: {response.usage.total_tokens}")
\`\`\`

### Anthropic

\`\`\`python
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=200,
    system="You are a helpful assistant.",
    messages=[
        {"role": "user", "content": "Explain what a context window is in 2 sentences."}
    ],
)

print(message.content[0].text)
print(f"Input tokens: {message.usage.input_tokens}")
print(f"Output tokens: {message.usage.output_tokens}")
\`\`\`

---

## Multi-Turn Conversations

LLM APIs are stateless — you must send the full conversation history with every request:

\`\`\`python
from openai import OpenAI

client = OpenAI()

conversation = [
    {"role": "system", "content": "You are a Python tutor."},
]

def chat(user_message: str) -> str:
    conversation.append({"role": "user", "content": user_message})
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=conversation,
    )
    
    assistant_message = response.choices[0].message.content
    conversation.append({"role": "assistant", "content": assistant_message})
    return assistant_message

print(chat("What is a list comprehension?"))
print(chat("Can you show me an example?"))
\`\`\`

---

## Streaming Responses

Streaming returns tokens as they are generated, enabling real-time display in UIs:

\`\`\`python
from openai import OpenAI

client = OpenAI()

with client.chat.completions.stream(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Write a short poem about recursion."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

print()  # newline after completion
\`\`\`

### Anthropic Streaming

\`\`\`python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-3-5-sonnet-20241022",
    max_tokens=300,
    messages=[{"role": "user", "content": "Write a short poem about recursion."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
\`\`\`

---

## Structured Outputs (JSON Mode)

Force the model to return valid JSON — essential for downstream parsing:

\`\`\`python
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI()

class MovieReview(BaseModel):
    title: str
    sentiment: str
    score: float
    summary: str

response = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": "Review the movie Inception."}
    ],
    response_format=MovieReview,
)

review = response.choices[0].message.parsed
print(f"{review.title}: {review.score}/10 — {review.sentiment}")
\`\`\`

---

## Error Handling

\`\`\`python
from openai import OpenAI, RateLimitError, APITimeoutError, APIStatusError
import time

client = OpenAI()

def call_with_retry(messages: list, max_retries: int = 3) -> str:
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                timeout=30,
            )
            return response.choices[0].message.content

        except RateLimitError:
            wait = 2 ** attempt  # exponential backoff
            print(f"Rate limited. Retrying in {wait}s...")
            time.sleep(wait)

        except APITimeoutError:
            print(f"Timeout on attempt {attempt + 1}")
            if attempt == max_retries - 1:
                raise

        except APIStatusError as e:
            print(f"API error {e.status_code}: {e.message}")
            raise

    raise RuntimeError("Max retries exceeded")
\`\`\`

---

## Rate Limits & Cost Management

| Provider | Rate Limit Tiers | Pricing Model |
|---|---|---|
| OpenAI | RPM, TPM, RPD per model | Per input/output token |
| Anthropic | RPM, TPM per model | Per input/output token |

### Tips

\`\`\`python
# 1. Cache repeated prompts
import hashlib, json
from functools import lru_cache

@lru_cache(maxsize=1000)
def cached_completion(prompt_hash: str, prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content

# 2. Use smaller models for simple tasks
SIMPLE_MODEL = "gpt-4o-mini"   # ~15x cheaper than gpt-4o
COMPLEX_MODEL = "gpt-4o"

# 3. Limit max_tokens to avoid runaway costs
response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    max_tokens=500,  # hard cap on output length
)

# 4. Log token usage for monitoring
print(f"Cost estimate: \u0024{response.usage.total_tokens / 1000 * 0.005:.4f}")
\`\`\`

---

## Environment Variables Pattern

\`\`\`python
import os
from openai import OpenAI

# Production-safe client initialization
client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"],
    timeout=30.0,
    max_retries=2,
)
\`\`\`
`,
  },

  'llms/fine-tuning': {
    slug: 'llms/fine-tuning',
    title: 'Fine-Tuning LLMs',
    description:
      'Learn when to fine-tune vs rely on prompt engineering, how supervised fine-tuning (SFT) and RLHF work, parameter-efficient methods like LoRA and QLoRA, dataset preparation, and post-training evaluation.',
    content: `## Fine-Tuning vs Prompt Engineering

Before investing in fine-tuning, ask: **can prompt engineering solve the problem?**

| Factor | Prompt Engineering | Fine-Tuning |
|---|---|---|
| Setup time | Hours | Days–weeks |
| Cost | Low (inference only) | High (training + inference) |
| Data required | 0–50 examples | 100–100,000+ examples |
| Latency | Higher (long system prompts) | Lower (shorter prompts) |
| Consistency | Variable | High |
| Use case | Prototyping, general tasks | Specialized style/domain/format |

### Fine-tune when you need:
- A specific **output format** the model repeatedly gets wrong
- **Domain-specific knowledge** not well-represented in pre-training (legal, medical jargon)
- A consistent **tone or persona** that's expensive to repeat in every prompt
- **Reduced prompt length** for cost/latency savings at scale
- **Higher accuracy** on a narrow, well-defined task

---

## Supervised Fine-Tuning (SFT)

SFT trains the model on a dataset of **(prompt, ideal response)** pairs using the same next-token prediction loss as pre-training, but only on the response tokens.

### Dataset Format (OpenAI JSONL)

\`\`\`json
{"messages": [{"role": "system", "content": "You are a SQL expert."}, {"role": "user", "content": "List all customers who placed orders in 2023."}, {"role": "assistant", "content": "SELECT DISTINCT c.* FROM customers c JOIN orders o ON c.id = o.customer_id WHERE YEAR(o.created_at) = 2023;"}]}
{"messages": [{"role": "system", "content": "You are a SQL expert."}, {"role": "user", "content": "Find the top 5 products by revenue."}, {"role": "assistant", "content": "SELECT p.name, SUM(oi.quantity * oi.unit_price) AS revenue FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id, p.name ORDER BY revenue DESC LIMIT 5;"}]}
\`\`\`

### Fine-tuning via OpenAI API

\`\`\`python
from openai import OpenAI

client = OpenAI()

# 1. Upload training data
with open("training_data.jsonl", "rb") as f:
    training_file = client.files.create(file=f, purpose="fine-tune")

# 2. Start fine-tuning job
job = client.fine_tuning.jobs.create(
    training_file=training_file.id,
    model="gpt-4o-mini-2024-07-18",
    hyperparameters={"n_epochs": 3},
)
print(f"Fine-tune job started: {job.id}")

# 3. Monitor progress
import time
while True:
    job = client.fine_tuning.jobs.retrieve(job.id)
    print(f"Status: {job.status}")
    if job.status in ("succeeded", "failed", "cancelled"):
        break
    time.sleep(60)

# 4. Use the fine-tuned model
if job.status == "succeeded":
    response = client.chat.completions.create(
        model=job.fine_tuned_model,
        messages=[{"role": "user", "content": "Get all active users."}],
    )
    print(response.choices[0].message.content)
\`\`\`

---

## RLHF — Reinforcement Learning from Human Feedback

RLHF goes beyond SFT to align model outputs with nuanced human preferences:

1. **SFT** — Train a base policy on demonstration data
2. **Reward Model Training** — Collect human preference rankings between model outputs; train a classifier to predict which output is preferred
3. **RL Optimization (PPO)** — Fine-tune the policy to maximize the reward model score, with a KL penalty to prevent it from drifting too far from the SFT model

RLHF is computationally intensive and complex to implement. **Direct Preference Optimization (DPO)** is a simpler alternative that achieves similar results without an explicit reward model.

---

## Parameter-Efficient Fine-Tuning: LoRA & QLoRA

Fine-tuning all model weights is expensive. **LoRA (Low-Rank Adaptation)** freezes the original weights and injects small trainable rank-decomposition matrices:

\`\`\`
W' = W + BA
\`\`\`

Where \`B ∈ R^{d×r}\` and \`A ∈ R^{r×k}\` with rank \`r << min(d,k)\`. Only A and B are trained.

### Training with LoRA (Hugging Face + PEFT)

\`\`\`python
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model, TaskType
from trl import SFTTrainer
from datasets import load_dataset

model_id = "meta-llama/Meta-Llama-3.1-8B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, device_map="auto")

lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,               # rank — higher = more parameters, more expressive
    lora_alpha=32,      # scaling factor (typically 2x rank)
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"],  # which layers to adapt
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# trainable params: 4,194,304 || all params: 8,034,041,856 || trainable%: 0.052

dataset = load_dataset("json", data_files="training_data.jsonl", split="train")

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="text",
    args=TrainingArguments(
        output_dir="./lora-output",
        num_train_epochs=3,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        fp16=True,
        logging_steps=10,
    ),
)

trainer.train()
model.save_pretrained("./lora-adapter")
\`\`\`

### QLoRA

**QLoRA** combines LoRA with **4-bit quantization** (NF4 format) to reduce memory requirements by ~4×, enabling fine-tuning of 70B+ parameter models on consumer GPUs.

\`\`\`python
from transformers import BitsAndBytesConfig
import torch

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
)

model = AutoModelForCausalLM.from_pretrained(
    model_id,
    quantization_config=bnb_config,
    device_map="auto",
)
\`\`\`

---

## Dataset Preparation Best Practices

1. **Quantity**: Start with 100–500 high-quality examples; more data helps but quality > quantity
2. **Diversity**: Cover the full range of inputs you expect in production
3. **Consistency**: Ensure the target responses follow the exact style and format you want
4. **Train/validation split**: Reserve 10–20% for validation; monitor validation loss to detect overfitting
5. **Data cleaning**: Remove duplicates, fix formatting issues, filter low-quality examples
6. **Negative examples**: Include examples where the correct answer is "I don't know" to reduce hallucinations

---

## Evaluation After Fine-Tuning

Always compare your fine-tuned model against the base model on a held-out test set:

\`\`\`python
import json
from openai import OpenAI

client = OpenAI()

def evaluate_model(model_id: str, test_cases: list[dict]) -> dict:
    correct = 0
    for case in test_cases:
        response = client.chat.completions.create(
            model=model_id,
            messages=case["messages"][:-1],  # exclude the expected answer
        )
        predicted = response.choices[0].message.content.strip()
        expected = case["messages"][-1]["content"].strip()
        if predicted == expected:
            correct += 1
    return {"accuracy": correct / len(test_cases), "n": len(test_cases)}

base_results = evaluate_model("gpt-4o-mini", test_cases)
ft_results = evaluate_model(fine_tuned_model_id, test_cases)

print(f"Base model accuracy: {base_results['accuracy']:.1%}")
print(f"Fine-tuned accuracy: {ft_results['accuracy']:.1%}")
\`\`\`
`,
  },

  'llms/evaluation': {
    slug: 'llms/evaluation',
    title: 'Evaluating LLMs',
    description:
      'A comprehensive guide to LLM evaluation: automatic metrics (BLEU, ROUGE, BERTScore), LLM-as-judge, standard benchmarks (MMLU, HumanEval), building eval datasets, and balancing automated vs human evaluation.',
    content: `## Why LLM Evaluation Is Hard

Unlike traditional ML where you compare predictions to ground-truth labels, LLM evaluation is challenging because:

- **Open-ended outputs**: There are many valid ways to answer a question
- **Subjective quality**: "Good" writing is hard to quantify
- **Task diversity**: A single model is evaluated across hundreds of tasks
- **Brittleness**: Small prompt changes can dramatically shift scores
- **Benchmark contamination**: Training data may overlap with test sets

---

## Automatic Metrics

### BLEU (Bilingual Evaluation Understudy)

Measures n-gram overlap between generated text and reference text. Originally designed for machine translation.

\`\`\`python
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction

reference = [["the", "cat", "sat", "on", "the", "mat"]]
hypothesis = ["the", "cat", "is", "on", "the", "mat"]

score = sentence_bleu(
    reference,
    hypothesis,
    smoothing_function=SmoothingFunction().method1,
)
print(f"BLEU score: {score:.4f}")  # 0.0 – 1.0
\`\`\`

**Limitations**: BLEU penalizes valid paraphrases; it does not capture semantic similarity.

### ROUGE (Recall-Oriented Understudy for Gisting Evaluation)

Measures recall of n-grams from the reference in the generated text. Commonly used for summarization.

\`\`\`python
from rouge_score import rouge_scorer

scorer = rouge_scorer.RougeScorer(["rouge1", "rouge2", "rougeL"], use_stemmer=True)

reference = "The quick brown fox jumps over the lazy dog."
hypothesis = "A fast brown fox leaps over a sleepy dog."

scores = scorer.score(reference, hypothesis)
for key, value in scores.items():
    print(f"{key}: P={value.precision:.3f} R={value.recall:.3f} F={value.fmeasure:.3f}")
\`\`\`

| Metric | Measures | Common Use |
|---|---|---|
| ROUGE-1 | Unigram overlap | General text similarity |
| ROUGE-2 | Bigram overlap | Phrase-level similarity |
| ROUGE-L | Longest common subsequence | Fluency / coherence |

### BERTScore

Uses contextual embeddings from BERT to measure semantic similarity — much better than n-gram metrics at capturing paraphrases.

\`\`\`python
from bert_score import score as bert_score

references = ["The capital of France is Paris."]
hypotheses = ["Paris is the capital city of France."]

P, R, F1 = bert_score(hypotheses, references, lang="en")
print(f"BERTScore F1: {F1.mean():.4f}")
\`\`\`

---

## LLM-as-Judge

Use a powerful LLM (e.g., GPT-4o) to evaluate the outputs of another model. This is now one of the most practical and scalable evaluation approaches.

\`\`\`python
from openai import OpenAI

client = OpenAI()

JUDGE_PROMPT = """
You are an expert evaluator. Rate the following AI response on a scale of 1–5 for each criterion.

Criteria:
- Accuracy (1-5): Is the information factually correct?
- Completeness (1-5): Does the response fully answer the question?
- Clarity (1-5): Is the response clear and well-organized?

Question: {question}
Response: {response}

Respond with JSON only:
{{"accuracy": <1-5>, "completeness": <1-5>, "clarity": <1-5>, "reasoning": "<brief explanation>"}}
"""

def judge_response(question: str, response: str) -> dict:
    result = client.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "user",
            "content": JUDGE_PROMPT.format(question=question, response=response)
        }],
        response_format={"type": "json_object"},
        temperature=0,
    )
    import json
    return json.loads(result.choices[0].message.content)

scores = judge_response(
    question="What causes inflation?",
    response="Inflation is caused by increased money supply, demand-pull factors, and cost-push pressures.",
)
print(scores)
\`\`\`

### Pairwise Comparison

Instead of absolute scores, ask the judge to compare two responses head-to-head:

\`\`\`python
PAIRWISE_PROMPT = """
Given the question below, which response is better? Answer with "A", "B", or "Tie".

Question: {question}
Response A: {response_a}
Response B: {response_b}

Winner:
"""
\`\`\`

---

## Standard Benchmarks

| Benchmark | Task | Metric | What It Measures |
|---|---|---|---|
| MMLU | 57-subject QA | Accuracy | Breadth of knowledge |
| HumanEval | Python coding | pass@k | Code correctness |
| GSM8K | Grade school math | Accuracy | Arithmetic reasoning |
| HellaSwag | Sentence completion | Accuracy | Commonsense reasoning |
| TruthfulQA | Q&A | Truthfulness % | Resistance to falsehoods |
| GPQA | Graduate-level science | Accuracy | Expert-level reasoning |
| SWE-bench | GitHub issues | % resolved | Real-world software engineering |

\`\`\`python
# Running HumanEval with pass@k metric
# pass@k = probability that at least one of k samples passes all unit tests

import numpy as np

def pass_at_k(n: int, c: int, k: int) -> float:
    """
    n: total samples generated
    c: number that passed tests
    k: the k in pass@k
    """
    if n - c < k:
        return 1.0
    return 1.0 - np.prod(1.0 - k / np.arange(n - c + 1, n + 1))

# Example: generated 10 samples, 3 passed, evaluating pass@1 and pass@5
print(f"pass@1: {pass_at_k(10, 3, 1):.3f}")
print(f"pass@5: {pass_at_k(10, 3, 5):.3f}")
\`\`\`

---

## Building Your Own Eval Dataset

Generic benchmarks rarely capture your specific use case. Build a task-specific eval set:

### Steps

1. **Define success criteria** — what does a "good" output look like for your task?
2. **Collect representative inputs** — sample real user queries from production logs
3. **Label expected outputs** — human-annotated gold answers or programmatically verifiable outputs
4. **Stratify by difficulty** — include easy, medium, and hard examples
5. **Version your eval set** — treat it as code; never overwrite, append only

\`\`\`python
import json
from dataclasses import dataclass, asdict
from datetime import datetime

@dataclass
class EvalCase:
    id: str
    input: str
    expected_output: str
    category: str
    difficulty: str  # "easy" | "medium" | "hard"
    created_at: str = datetime.utcnow().isoformat()

eval_dataset = [
    EvalCase(
        id="sql-001",
        input="List all users who signed up in the last 30 days",
        expected_output="SELECT * FROM users WHERE created_at >= NOW() - INTERVAL 30 DAY",
        category="sql-generation",
        difficulty="easy",
    ),
]

with open("eval_dataset.jsonl", "w") as f:
    for case in eval_dataset:
        f.write(json.dumps(asdict(case)) + "\\n")
\`\`\`

---

## Automated vs Human Evaluation

| Dimension | Automated | Human |
|---|---|---|
| Speed | Fast (seconds) | Slow (days–weeks) |
| Cost | Low | High |
| Scale | Unlimited | Limited |
| Consistency | High | Variable (inter-annotator agreement) |
| Nuance | Low | High |
| Best for | Regression testing, benchmarks | Alignment, safety, creative quality |

### Recommended Evaluation Stack

1. **Unit tests** — for deterministic outputs (SQL, JSON, code)
2. **ROUGE/BERTScore** — for summarization tasks with reference answers
3. **LLM-as-judge** — for open-ended quality, helpfulness, and coherence
4. **Human evaluation** — for final model selection and safety assessments
5. **A/B testing in production** — measure downstream business metrics (task completion rate, user rating)

> **Key insight**: Correlation between automated metrics and human judgment is often weak. Always validate your automated eval scores against human ratings before trusting them as optimization targets.
`,
  },
}
