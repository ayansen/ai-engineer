import type { DocsContentMap } from './types'

export const mlopsContent: DocsContentMap = {
  'mlops/overview': {
    slug: 'mlops/overview',
    title: 'MLOps & Deployment Overview',
    description:
      'An introduction to MLOps for LLMs, how LLMOps differs from traditional MLOps, key operational concerns, and MLOps maturity levels.',
    content: `## What is MLOps for LLMs?

MLOps (Machine Learning Operations) is the discipline of deploying, monitoring, and maintaining machine learning models in production. For Large Language Models (LLMs), this practice is often called **LLMOps** — a specialisation that accounts for the unique scale, cost, and behavioural characteristics of foundation models.

Traditional MLOps focuses on structured data pipelines, reproducible training runs, and predictable inference latency. LLMOps adds a new set of concerns around stochastic outputs, prompt engineering, token economics, and safety guardrails.

## LLMOps vs Traditional MLOps

| Concern | Traditional MLOps | LLMOps |
|---|---|---|
| Model size | MBs – GBs | GBs – hundreds of GBs |
| Training frequency | Periodic retraining | Fine-tuning or RAG updates |
| Input format | Tabular / image / audio | Natural language prompts |
| Output evaluation | Accuracy / F1 / AUC | Human preference, G-Eval, LLM-as-judge |
| Cost driver | Compute per prediction | Tokens in + tokens out |
| Safety risk | Data leakage, bias | Hallucination, jailbreaks, PII exposure |
| Latency target | < 10 ms (tabular) | 500 ms – 5 s (streaming) |

### What stays the same
- CI/CD pipelines for code and configuration
- Experiment tracking and model versioning
- Canary deployments and rollback strategies
- Observability: logs, metrics, traces

### What changes
- **Prompt management** becomes a first-class artifact alongside code
- **Evaluation harnesses** must handle non-deterministic outputs
- **Cost modelling** is central — a single GPT-4 call can cost 100× a tabular inference
- **Safety layers** (content filters, PII redaction, toxicity classifiers) sit on the critical path

## Key Operational Concerns

### Latency
Users expect near real-time responses. Strategies include:
- **Streaming** — surface tokens progressively with Server-Sent Events (SSE)
- **Speculative decoding** — draft model generates candidate tokens; large model verifies
- **KV-cache reuse** — cache attention keys/values for shared prompt prefixes
- **Request batching** — amortise GPU overhead across concurrent requests

### Cost
Token costs compound at scale. Track:
- Input tokens per request (system prompt + context + user message)
- Output tokens per request
- Cost per 1 000 tokens by model tier
- Total daily / monthly spend with budget alerts

### Reliability
- Target **99.9% uptime** for production APIs
- Implement retries with exponential back-off and jitter
- Use circuit breakers to shed load during provider outages
- Maintain fallback models (e.g., GPT-4o → GPT-4o-mini)

### Safety
- Apply input validation before forwarding to the model
- Use output classifiers to detect policy violations
- Log every request/response for audit trails
- Implement rate limiting per user / tenant

## MLOps Maturity Levels

### Level 0 — Manual
- Notebooks, ad-hoc API calls, no versioning
- Suitable for prototyping only

### Level 1 — Automated Pipeline
- Prompts stored in version control
- Basic CI (lint, unit tests) on pull requests
- Staging and production environments separated

### Level 2 — Continuous Delivery
- Automated evaluation on every deployment
- A/B testing framework in place
- Cost dashboards and alerting

### Level 3 — Full LLMOps
- Continuous monitoring of output quality
- Automated drift detection and retraining triggers
- Semantic caching and latency SLOs enforced
- Safety guardrails integrated into the delivery pipeline

Most teams should target **Level 2** before worrying about Level 3 optimisations.`,
  },

  'mlops/model-serving': {
    slug: 'mlops/model-serving',
    title: 'Model Serving & Infrastructure',
    description:
      'Inference servers (vLLM, TGI, Triton), containerisation, Kubernetes for AI workloads, API gateway patterns, and latency optimisation techniques.',
    content: `## Inference Servers

Selecting the right inference server determines throughput, latency, and GPU utilisation. The three dominant open-source options are:

### vLLM
[vLLM](https://github.com/vllm-project/vllm) uses **PagedAttention** — a memory management algorithm that stores KV-cache in non-contiguous pages, dramatically increasing effective batch sizes.

Key features:
- Continuous batching (new requests join in-flight batches)
- Tensor parallelism across multiple GPUs
- OpenAI-compatible REST API
- Supports LLaMA, Mistral, Qwen, Phi, and dozens more

\`\`\`bash
pip install vllm

python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3-8B-Instruct \\
  --tensor-parallel-size 2 \\
  --max-model-len 8192 \\
  --port 8000
\`\`\`

### Text Generation Inference (TGI)
Hugging Face's TGI provides production-ready serving with built-in Prometheus metrics.

\`\`\`bash
docker run --gpus all \\
  -p 8080:80 \\
  -v $HOME/.cache/huggingface:/data \\
  ghcr.io/huggingface/text-generation-inference:2.1 \\
  --model-id mistralai/Mistral-7B-Instruct-v0.3 \\
  --max-concurrent-requests 128
\`\`\`

### NVIDIA Triton Inference Server
Triton excels at multi-model deployments and heterogeneous hardware. Use it when you need to serve ensemble pipelines (e.g., embedding model + reranker + LLM in one graph).

## Containerisation with Docker

A production-ready Dockerfile for a FastAPI wrapper around vLLM:

\`\`\`dockerfile
FROM nvidia/cuda:12.4.1-runtime-ubuntu22.04

WORKDIR /app

RUN apt-get update && apt-get install -y python3-pip && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "-m", "vllm.entrypoints.openai.api_server", \\
     "--model", "/models/llama3", \\
     "--served-model-name", "llama3", \\
     "--port", "8000"]
\`\`\`

\`\`\`text
# requirements.txt
vllm==0.5.4
fastapi==0.111.0
uvicorn==0.30.1
\`\`\`

## Kubernetes for AI Workloads

Kubernetes GPU scheduling requires the **NVIDIA device plugin** and, optionally, the **GPU Operator** for driver management.

\`\`\`yaml
# vllm-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-llama3
  namespace: inference
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vllm-llama3
  template:
    metadata:
      labels:
        app: vllm-llama3
    spec:
      containers:
        - name: vllm
          image: registry.example.com/vllm:0.5.4
          ports:
            - containerPort: 8000
          resources:
            limits:
              nvidia.com/gpu: "1"
              memory: "40Gi"
            requests:
              nvidia.com/gpu: "1"
              memory: "40Gi"
          env:
            - name: HUGGING_FACE_HUB_TOKEN
              valueFrom:
                secretKeyRef:
                  name: hf-token
                  key: token
          volumeMounts:
            - mountPath: /models
              name: model-storage
      volumes:
        - name: model-storage
          persistentVolumeClaim:
            claimName: model-pvc
      nodeSelector:
        cloud.google.com/gke-accelerator: nvidia-l4
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-llama3-svc
  namespace: inference
spec:
  selector:
    app: vllm-llama3
  ports:
    - port: 80
      targetPort: 8000
\`\`\`

### Horizontal Pod Autoscaler for GPU workloads
Scale on custom metrics (queue depth, GPU utilisation) using KEDA:

\`\`\`yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: vllm-scaledobject
  namespace: inference
spec:
  scaleTargetRef:
    name: vllm-llama3
  minReplicaCount: 1
  maxReplicaCount: 10
  triggers:
    - type: prometheus
      metadata:
        serverAddress: http://prometheus:9090
        metricName: vllm_pending_requests
        threshold: "20"
        query: avg(vllm_num_requests_waiting)
\`\`\`

## API Gateway Patterns

Place an API gateway in front of your inference fleet to handle:

| Concern | Approach |
|---|---|
| Authentication | API keys / JWT validation |
| Rate limiting | Token-bucket per API key |
| Load balancing | Least-connections to inference pods |
| Cost tracking | Middleware that records token counts |
| Fallback routing | Route to cheaper model when primary is overloaded |

## Latency Optimisation

### Request Batching
vLLM's continuous batching automatically groups concurrent requests. Tune \`--max-num-seqs\` (maximum sequences in a batch) to balance latency and throughput.

### Semantic Caching
Cache embeddings of frequent prompts; return cached completions for cosine-similar inputs:

\`\`\`python
from sentence_transformers import SentenceTransformer
import numpy as np

encoder = SentenceTransformer("all-MiniLM-L6-v2")
cache: list[tuple[np.ndarray, str]] = []

def cached_completion(prompt: str, threshold: float = 0.95) -> str | None:
    emb = encoder.encode(prompt)
    for cached_emb, cached_response in cache:
        similarity = np.dot(emb, cached_emb) / (np.linalg.norm(emb) * np.linalg.norm(cached_emb))
        if similarity >= threshold:
            return cached_response
    return None
\`\`\`

### Quantisation
Reduce GPU memory footprint and increase throughput with INT4/INT8 quantisation:

\`\`\`bash
# AWQ 4-bit quantisation via vLLM
python -m vllm.entrypoints.openai.api_server \\
  --model TheBloke/Mistral-7B-Instruct-v0.2-AWQ \\
  --quantization awq
\`\`\`

Quantisation trade-offs:

| Method | Memory reduction | Quality loss | Throughput gain |
|---|---|---|---|
| FP16 (baseline) | — | — | — |
| GPTQ INT8 | ~50% | < 1% | 1.5× |
| AWQ INT4 | ~75% | 1–3% | 2–3× |
| GGUF Q3_K | ~80% | 3–5% | 3× |`,
  },

  'mlops/monitoring': {
    slug: 'mlops/monitoring',
    title: 'Monitoring LLM Applications',
    description:
      'What to monitor, LLM-specific metrics, observability tooling (LangSmith, W&B, Arize), alerting strategies, and drift detection for production AI systems.',
    content: `## Why LLM Monitoring is Different

Traditional software monitoring tracks latency, error rates, and resource utilisation. LLM monitoring adds a qualitative dimension: **did the model produce a correct, safe, and useful response?** This requires instrumenting both the infrastructure and the output quality.

## The Four Pillars of LLM Observability

### 1. Operational Metrics
Infrastructure-level signals you should collect on every request:

| Metric | Description | Alert threshold |
|---|---|---|
| \`request_latency_p50/p95/p99\` | End-to-end response time | p99 > 10 s |
| \`time_to_first_token\` | Streaming latency to first byte | > 2 s |
| \`tokens_per_second\` | Throughput per replica | < 20 tok/s |
| \`error_rate\` | 4xx / 5xx responses | > 1% over 5 min |
| \`gpu_utilisation\` | Percent GPU compute used | > 90% sustained |
| \`kv_cache_hit_rate\` | Proportion of prefix cache hits | < 30% (opportunity) |

### 2. Cost Metrics
Track spend at every level of granularity:

\`\`\`python
import tiktoken

def count_tokens(text: str, model: str = "gpt-4o") -> int:
    enc = tiktoken.encoding_for_model(model)
    return len(enc.encode(text))

def calculate_cost(input_tokens: int, output_tokens: int, model: str) -> float:
    pricing = {
        "gpt-4o":       {"input": 5.00,  "output": 15.00},  # per 1M tokens
        "gpt-4o-mini":  {"input": 0.15,  "output": 0.60},
        "claude-3-5-sonnet": {"input": 3.00, "output": 15.00},
    }
    p = pricing[model]
    return (input_tokens * p["input"] + output_tokens * p["output"]) / 1_000_000
\`\`\`

### 3. Quality Metrics (LLM-specific)
These require evaluation beyond simple pass/fail:

- **Hallucination rate** — detected via fact-checking pipeline or LLM-as-judge
- **Faithfulness** — for RAG: does the answer follow from retrieved context? (RAGAs score)
- **Answer relevancy** — does the response address the user's question?
- **Toxicity / safety violations** — automated classifier output
- **Prompt injection attempts** — pattern-matched or classifier-flagged inputs

### 4. Business Metrics
Tie model performance to outcomes:

- User satisfaction (thumbs up/down, CSAT)
- Task completion rate
- Escalation to human agent rate
- Session abandonment rate

## Instrumentation with OpenTelemetry

\`\`\`python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

provider = TracerProvider()
provider.add_span_processor(
    BatchSpanProcessor(OTLPSpanExporter(endpoint="http://otel-collector:4317"))
)
trace.set_tracer_provider(provider)
tracer = trace.get_tracer(__name__)

def chat_completion(messages: list[dict], model: str) -> str:
    with tracer.start_as_current_span("llm.chat_completion") as span:
        span.set_attribute("llm.model", model)
        span.set_attribute("llm.input_tokens", count_tokens(str(messages), model))

        response = client.chat.completions.create(model=model, messages=messages)

        span.set_attribute("llm.output_tokens", response.usage.completion_tokens)
        span.set_attribute("llm.cost_usd", calculate_cost(
            response.usage.prompt_tokens,
            response.usage.completion_tokens,
            model,
        ))
        return response.choices[0].message.content
\`\`\`

## Observability Tools

### LangSmith
Purpose-built for LLM tracing. Captures every chain step, retrieval call, and tool invocation:

\`\`\`python
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "lsv2_..."
os.environ["LANGCHAIN_PROJECT"] = "production-chatbot"

# All LangChain / LangGraph calls are automatically traced
\`\`\`

### Weights & Biases (W&B)
Ideal for experiment tracking and comparing evaluation runs:

\`\`\`python
import wandb

wandb.init(project="llm-evals", config={"model": "gpt-4o-mini", "eval_set": "v3"})

for example in eval_dataset:
    prediction = run_pipeline(example["input"])
    score = evaluate(prediction, example["expected"])
    wandb.log({"faithfulness": score.faithfulness, "relevancy": score.relevancy})

wandb.finish()
\`\`\`

### Arize Phoenix
Open-source alternative for LLM tracing and embedding drift detection:

\`\`\`python
import phoenix as px
from openinference.instrumentation.openai import OpenAIInstrumentor

px.launch_app()
OpenAIInstrumentor().instrument()  # auto-traces all OpenAI calls
\`\`\`

## Alerting Strategies

Use a tiered approach:

| Tier | Signal | Response | Channel |
|---|---|---|---|
| P0 — Critical | Error rate > 5% for 2 min | Page on-call | PagerDuty |
| P1 — High | p99 latency > 15 s for 5 min | Slack alert | #incidents |
| P2 — Medium | Daily cost > 110% of budget | Email | ops@company |
| P3 — Low | Hallucination rate trending up | Dashboard | Weekly review |

## Drift Detection

### Input drift
Embed incoming prompts and track the centroid distance from the training/baseline distribution. A large shift signals users are asking about topics the model wasn't evaluated on.

\`\`\`python
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def detect_input_drift(
    baseline_embeddings: np.ndarray,
    recent_embeddings: np.ndarray,
    threshold: float = 0.15,
) -> bool:
    baseline_centroid = baseline_embeddings.mean(axis=0)
    recent_centroid = recent_embeddings.mean(axis=0)
    similarity = cosine_similarity([baseline_centroid], [recent_centroid])[0][0]
    drift_score = 1 - similarity
    return drift_score > threshold
\`\`\`

### Output quality drift
Run a sliding-window evaluation every N hours over a sample of production traffic. Alert when the rolling average quality score drops below a threshold.`,
  },

  'mlops/cicd': {
    slug: 'mlops/cicd',
    title: 'CI/CD for AI Systems',
    description:
      'Continuous integration and delivery for LLM applications: testing strategies, GitHub Actions pipelines, model versioning with MLflow and DVC, and safe deployment patterns.',
    content: `## Why CI/CD for AI is Different

AI systems have non-deterministic outputs, making traditional pass/fail tests insufficient. A successful CI/CD pipeline for LLMs must combine:

1. **Code tests** — standard unit and integration tests for application logic
2. **Prompt tests** — regression tests for known inputs/outputs
3. **Evaluation runs** — automated quality scoring against a golden dataset
4. **Safety checks** — automated content policy validation

## Testing Strategies

### Unit Tests
Test application code in isolation: parsers, prompt formatters, post-processors.

\`\`\`python
# tests/unit/test_prompt_formatter.py
import pytest
from app.prompts import build_rag_prompt

def test_build_rag_prompt_includes_context():
    context = "The Eiffel Tower is in Paris."
    question = "Where is the Eiffel Tower?"
    result = build_rag_prompt(context=context, question=question)
    assert "The Eiffel Tower is in Paris." in result
    assert "Where is the Eiffel Tower?" in result

def test_build_rag_prompt_truncates_long_context():
    long_context = "x" * 100_000
    result = build_rag_prompt(context=long_context, question="Q?")
    assert len(result) < 50_000  # check truncation logic
\`\`\`

### Integration Tests
Test the full pipeline with a real (or stubbed) model call:

\`\`\`python
# tests/integration/test_pipeline.py
import pytest
from unittest.mock import patch, MagicMock
from app.pipeline import AnswerPipeline

@pytest.fixture
def mock_openai():
    with patch("app.pipeline.openai.chat.completions.create") as mock:
        mock.return_value = MagicMock(
            choices=[MagicMock(message=MagicMock(content="Paris"))],
            usage=MagicMock(prompt_tokens=100, completion_tokens=5),
        )
        yield mock

def test_pipeline_returns_answer(mock_openai):
    pipeline = AnswerPipeline(model="gpt-4o-mini")
    result = pipeline.run("Where is the Eiffel Tower?")
    assert result.answer == "Paris"
    assert result.cost_usd > 0
\`\`\`

### Evaluation Tests (LLM-as-Judge)
Run against a golden dataset; fail the build if quality drops below a threshold:

\`\`\`python
# tests/eval/test_quality.py
import json, pytest
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy

THRESHOLD = 0.80

def test_rag_quality_above_threshold():
    with open("tests/eval/golden_set.json") as f:
        dataset = json.load(f)

    result = evaluate(dataset, metrics=[faithfulness, answer_relevancy])
    assert result["faithfulness"] >= THRESHOLD, (
        f"Faithfulness {result['faithfulness']:.2f} < {THRESHOLD}"
    )
    assert result["answer_relevancy"] >= THRESHOLD
\`\`\`

## GitHub Actions Pipeline

\`\`\`yaml
# .github/workflows/ci.yml
name: AI System CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  PYTHON_VERSION: "3.11"

jobs:
  lint-and-unit:
    name: Lint & Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: \u0024{{ env.PYTHON_VERSION }}
          cache: pip

      - run: pip install -r requirements-dev.txt

      - name: Ruff lint
        run: ruff check .

      - name: Type check
        run: mypy app/

      - name: Unit tests
        run: pytest tests/unit/ -v --tb=short

  integration:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: lint-and-unit
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \u0024{{ env.PYTHON_VERSION }}
          cache: pip
      - run: pip install -r requirements.txt
      - name: Integration tests (mocked LLM)
        run: pytest tests/integration/ -v

  eval:
    name: LLM Evaluation
    runs-on: ubuntu-latest
    needs: integration
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \u0024{{ env.PYTHON_VERSION }}
          cache: pip
      - run: pip install -r requirements.txt
      - name: Run evaluation suite
        env:
          OPENAI_API_KEY: \u0024{{ secrets.OPENAI_API_KEY }}
        run: pytest tests/eval/ -v --tb=short
      - name: Upload eval results
        uses: actions/upload-artifact@v4
        with:
          name: eval-results
          path: eval_results.json

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: eval
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t app:\u0024{{ github.sha }} .
      - name: Push to registry
        run: |
          echo \u0024{{ secrets.REGISTRY_PASSWORD }} | docker login -u \u0024{{ secrets.REGISTRY_USER }} --password-stdin registry.example.com
          docker tag app:\u0024{{ github.sha }} registry.example.com/app:\u0024{{ github.sha }}
          docker push registry.example.com/app:\u0024{{ github.sha }}
      - name: Deploy to staging
        run: kubectl set image deployment/app app=registry.example.com/app:\u0024{{ github.sha }} -n staging
\`\`\`

## Model Versioning

### MLflow
Track experiments, parameters, metrics, and register promoted models:

\`\`\`python
import mlflow

with mlflow.start_run(run_name="rag-v2-eval"):
    mlflow.log_param("model", "gpt-4o-mini")
    mlflow.log_param("chunk_size", 512)
    mlflow.log_param("top_k", 5)
    mlflow.log_metric("faithfulness", 0.87)
    mlflow.log_metric("relevancy", 0.91)
    mlflow.log_artifact("prompts/system_prompt_v2.txt")

    # Register model if quality improved
    mlflow.register_model("runs:/<run_id>/model", "rag-pipeline")
\`\`\`

### DVC (Data Version Control)
Version large datasets and prompt files alongside code:

\`\`\`bash
dvc init
dvc add data/golden_eval_set.jsonl
dvc add prompts/system_prompt.txt
git add data/.gitignore prompts/.gitignore data/golden_eval_set.jsonl.dvc prompts/system_prompt.txt.dvc
git commit -m "Track eval dataset and prompts with DVC"
dvc push  # pushes to S3 / GCS remote
\`\`\`

## Safe Deployment Patterns

### Blue-Green Deployment
Maintain two identical environments; switch traffic atomically after validation:

\`\`\`yaml
# Switch traffic from blue to green
kubectl patch service app-svc -p '{"spec":{"selector":{"version":"green"}}}'
\`\`\`

### Canary Release
Gradually shift traffic to the new version using Argo Rollouts or Istio:

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: app-rollout
spec:
  strategy:
    canary:
      steps:
        - setWeight: 10   # 10% to new version
        - pause: {duration: 10m}
        - setWeight: 50
        - pause: {duration: 10m}
        - setWeight: 100
      analysis:
        templates:
          - templateName: llm-quality-check
        startingStep: 1
\`\`\`

Automated rollback triggers if quality metrics drop below threshold during the canary window.`,
  },

  'mlops/cost-optimization': {
    slug: 'mlops/cost-optimization',
    title: 'Cost Optimisation for LLM Applications',
    description:
      'Understanding cost drivers, prompt optimisation, model selection, caching strategies, batching, and quantisation to reduce LLM operational costs.',
    content: `## Understanding LLM Cost Drivers

LLM costs have three primary components:

| Component | What it covers | Typical share |
|---|---|---|
| **Input tokens** | System prompt + context + user message | 60–80% |
| **Output tokens** | Generated response | 20–40% |
| **Compute (self-hosted)** | GPU instance hours | 100% for open-source |

### Calculating costs

\`\`\`python
from dataclasses import dataclass

@dataclass
class ModelPricing:
    input_per_million: float   # USD per 1M input tokens
    output_per_million: float  # USD per 1M output tokens

PRICING: dict[str, ModelPricing] = {
    "gpt-4o":            ModelPricing(5.00,  15.00),
    "gpt-4o-mini":       ModelPricing(0.15,   0.60),
    "claude-3-5-sonnet": ModelPricing(3.00,  15.00),
    "claude-3-haiku":    ModelPricing(0.25,   1.25),
    "llama-3-8b-local":  ModelPricing(0.00,   0.00),  # GPU cost only
}

def monthly_cost_estimate(
    daily_requests: int,
    avg_input_tokens: int,
    avg_output_tokens: int,
    model: str,
) -> float:
    p = PRICING[model]
    cost_per_request = (
        avg_input_tokens  * p.input_per_million  / 1_000_000 +
        avg_output_tokens * p.output_per_million / 1_000_000
    )
    return cost_per_request * daily_requests * 30

# Example: 10k requests/day, 2k input + 500 output tokens
print(monthly_cost_estimate(10_000, 2_000, 500, "gpt-4o"))       # $39,000/mo
print(monthly_cost_estimate(10_000, 2_000, 500, "gpt-4o-mini"))  # $1,170/mo
\`\`\`

## Prompt Optimisation

System prompts are paid on every single request. Reducing them has a multiplicative effect.

### Strategies
1. **Remove redundant instructions** — merge duplicate rules, eliminate wordy preambles
2. **Use structured formats** — JSON schema instructions are often shorter than prose
3. **Dynamic context injection** — only include relevant context, not all available data
4. **Shared prefix caching** — keep stable parts of the prompt at the top; providers like Anthropic offer prompt caching for prefixes > 1 024 tokens (90% discount on cached tokens)

\`\`\`python
# Before: 800 tokens of verbose instructions
system_prompt_v1 = """
You are a helpful customer support assistant. Your job is to help customers
with their questions. Always be polite and professional. Never say anything
rude. If you don't know the answer, say so...
[500 more words of instructions]
"""

# After: 120 tokens, same behaviour
system_prompt_v2 = """You are a customer support assistant.
Rules: be concise, polite, factual. Say "I don't know" if uncertain.
Format responses as plain prose unless the user asks for lists."""
\`\`\`

## Model Selection

Choose the cheapest model that meets your quality bar.

| Use case | Recommended model | Rationale |
|---|---|---|
| Complex reasoning, code gen | GPT-4o / Claude 3.5 Sonnet | Highest quality |
| Customer Q&A, summarisation | GPT-4o-mini / Claude Haiku | 10–20× cheaper, ~90% quality |
| Classification, routing | Fine-tuned GPT-4o-mini or Llama 3 8B | Maximum efficiency |
| High-volume, low-latency | Self-hosted Mistral 7B / Llama 3 8B | Near-zero marginal cost |

### Cascading (model routing)

Route simple queries to cheap models; escalate complex ones:

\`\`\`python
def route_request(query: str) -> str:
    complexity = classify_complexity(query)  # fast, cheap classifier
    if complexity == "simple":
        return call_model(query, model="gpt-4o-mini")
    elif complexity == "moderate":
        return call_model(query, model="gpt-4o-mini", temperature=0)
    else:
        return call_model(query, model="gpt-4o")
\`\`\`

A well-tuned router can send 70–80% of traffic to the cheap model, cutting costs by 5–10×.

## Caching

### Exact-match caching
Cache responses for identical prompts (great for FAQ-style queries):

\`\`\`python
import hashlib, json
import redis

r = redis.Redis(host="cache", port=6379, decode_responses=True)

def cached_completion(messages: list[dict], model: str, ttl: int = 3600) -> str:
    cache_key = hashlib.sha256(
        json.dumps({"messages": messages, "model": model}, sort_keys=True).encode()
    ).hexdigest()

    if cached := r.get(cache_key):
        return cached

    response = client.chat.completions.create(model=model, messages=messages)
    result = response.choices[0].message.content
    r.setex(cache_key, ttl, result)
    return result
\`\`\`

### Semantic caching
Return cached responses for semantically similar (not identical) prompts:

\`\`\`python
from sentence_transformers import SentenceTransformer
import numpy as np

encoder = SentenceTransformer("all-MiniLM-L6-v2")

class SemanticCache:
    def __init__(self, threshold: float = 0.92):
        self.threshold = threshold
        self.store: list[tuple[np.ndarray, str, str]] = []  # (emb, prompt, response)

    def get(self, prompt: str) -> str | None:
        emb = encoder.encode(prompt, normalize_embeddings=True)
        for cached_emb, _, response in self.store:
            if float(np.dot(emb, cached_emb)) >= self.threshold:
                return response
        return None

    def set(self, prompt: str, response: str) -> None:
        emb = encoder.encode(prompt, normalize_embeddings=True)
        self.store.append((emb, prompt, response))
\`\`\`

A semantic cache with threshold 0.92 typically achieves a 20–40% cache hit rate on production traffic, yielding proportional cost savings.

## Batching

For asynchronous workloads (nightly reports, bulk embeddings), batch requests to maximise throughput and reduce per-token overhead:

\`\`\`python
import asyncio
from openai import AsyncOpenAI

aclient = AsyncOpenAI()

async def process_batch(prompts: list[str], model: str, batch_size: int = 20) -> list[str]:
    results = []
    for i in range(0, len(prompts), batch_size):
        batch = prompts[i : i + batch_size]
        tasks = [
            aclient.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": p}],
            )
            for p in batch
        ]
        responses = await asyncio.gather(*tasks)
        results.extend(r.choices[0].message.content for r in responses)
    return results
\`\`\`

OpenAI's Batch API also offers a **50% discount** for jobs that complete within 24 hours — ideal for offline workloads.

## Quantisation for Self-Hosted Models

Reduce GPU memory and increase throughput by using lower-precision weights:

\`\`\`bash
# Serve a 4-bit AWQ-quantised model — fits a 7B model on a single 12 GB GPU
python -m vllm.entrypoints.openai.api_server \\
  --model TheBloke/Mistral-7B-Instruct-v0.2-AWQ \\
  --quantization awq \\
  --gpu-memory-utilization 0.90
\`\`\`

| Model | Precision | VRAM required | Cost/hr (A10G) | Quality vs FP16 |
|---|---|---|---|---|
| Llama 3 8B | FP16 | 16 GB | $0.76 | Baseline |
| Llama 3 8B | INT8 | 8 GB | $0.38 | −0.5% |
| Llama 3 8B | INT4 AWQ | 5 GB | $0.24 | −1.5% |
| Llama 3 70B | INT4 AWQ | 40 GB | $1.20 | −2% vs 70B FP16 |

For most production use-cases, INT4 AWQ quantisation is the sweet spot: ~75% memory reduction with only 1–2% quality degradation.`,
  },
}
