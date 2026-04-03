import type { DocsContentMap } from './types'

export const foundationsContent: DocsContentMap = {
  'foundations/overview': {
    slug: 'foundations/overview',
    title: 'Foundations Overview',
    description: 'Why strong fundamentals matter in AI/ML, what this section covers, and what prerequisite knowledge you need to get started.',
    content: `## Why Foundations Matter

Artificial intelligence and machine learning are built on layers of well-established disciplines. Skipping the fundamentals might let you run a model today, but it will limit your ability to debug failures, choose the right approach, tune hyperparameters, and push the state of the art tomorrow.

The best practitioners treat theory and practice as inseparable: mathematics tells you *why* an algorithm works, code tells you *how* to make it work, and engineering tells you *how to keep it working at scale*.

## What This Section Covers

| Topic | What You'll Learn |
|---|---|
| **Python for AI** | NumPy, Pandas, Matplotlib, Pythonic patterns |
| **Mathematics** | Linear algebra, calculus, probability & statistics |
| **ML Basics** | Supervised/unsupervised/RL, model evaluation, core algorithms |
| **Deep Learning** | Neural networks, backprop, CNNs, RNNs, Transformers |
| **Data Engineering** | Pipelines, ETL, data formats, feature engineering |

## Prerequisite Knowledge

Before diving in you should be comfortable with:

- **Programming basics** — variables, loops, functions, classes in any language
- **High-school mathematics** — algebra, basic trigonometry, function notation
- **Command-line basics** — navigating directories, running scripts, using pip/conda

You do *not* need a PhD in mathematics. The goal is enough intuition to use these tools confidently and know when something is going wrong.

## Learning Path

A recommended sequence:

1. **Python for AI** — get your toolbox ready
2. **Mathematics** — build intuition for what the algorithms are doing
3. **ML Basics** — understand the landscape before specialising
4. **Deep Learning** — go deeper once classical ML is comfortable
5. **Data Engineering** — the glue that holds production systems together

Each section contains explanations, code examples you can run immediately, and pointers to further reading. Work through them in order, or jump to the area most relevant to your current project.

## Setting Up Your Environment

\`\`\`bash
# Create an isolated environment
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\\Scripts\\activate

# Core scientific stack
pip install numpy pandas matplotlib scikit-learn

# Deep learning (choose one or both)
pip install torch torchvision          # PyTorch
pip install tensorflow                 # TensorFlow / Keras

# Notebooks
pip install jupyterlab
jupyter lab
\`\`\`

> **Tip:** Pin your dependency versions in a \`requirements.txt\` from day one. Reproducibility is not optional in ML work.
`,
  },

  'foundations/python': {
    slug: 'foundations/python',
    title: 'Python for AI',
    description: 'Master the Python libraries and language features you will use every day as an AI/ML practitioner — NumPy, Pandas, Matplotlib, and Pythonic coding patterns.',
    content: `## Why Python?

Python has become the *lingua franca* of AI research and production. Its readable syntax lowers the barrier to experimentation, while libraries like NumPy push numerical computation down to optimised C/Fortran code, giving you near-native speed with high-level convenience.

---

## NumPy — Numerical Computing

NumPy introduces the **ndarray**, a fixed-type, multi-dimensional array that is far more efficient than a Python list for numerical work.

\`\`\`python
import numpy as np

# Creating arrays
a = np.array([1, 2, 3, 4, 5])
b = np.zeros((3, 4))          # 3×4 matrix of zeros
c = np.random.randn(100, 10)  # 100 samples, 10 features — Gaussian noise

# Vectorised operations (no Python loop needed)
doubled = a * 2
dot_product = a @ a            # 55

# Broadcasting — shapes are aligned automatically
weights = np.array([0.1, 0.2, 0.3, 0.4, 0.5])
scaled = c[:, :5] * weights    # each column scaled independently

# Useful aggregations
print(c.mean(axis=0))   # column means
print(c.std(axis=1))    # row standard deviations
print(np.linalg.norm(a))  # Euclidean norm ≈ 7.416
\`\`\`

### Indexing & Slicing

\`\`\`python
matrix = np.arange(16).reshape(4, 4)
print(matrix[1:3, ::2])   # rows 1-2, every other column
mask = matrix > 8
print(matrix[mask])        # fancy boolean indexing → [9 10 11 12 13 14 15]
\`\`\`

---

## Pandas — Tabular Data

Pandas wraps NumPy arrays in labelled **Series** and **DataFrame** objects, making data wrangling expressive and auditable.

\`\`\`python
import pandas as pd

df = pd.read_csv('data/titanic.csv')

# Inspection
print(df.shape)           # (891, 12)
print(df.dtypes)
print(df.describe())      # summary statistics

# Selection
ages = df['Age']                          # Series
subset = df[['Age', 'Fare', 'Survived']]  # DataFrame slice
adults = df[df['Age'] >= 18]              # boolean filter

# Aggregation
survival_by_class = df.groupby('Pclass')['Survived'].mean()

# Cleaning
df['Age'] = df['Age'].fillna(df['Age'].median())
df.dropna(subset=['Embarked'], inplace=True)

# Feature engineering
df['FamilySize'] = df['SibSp'] + df['Parch'] + 1
df['IsAlone'] = (df['FamilySize'] == 1).astype(int)
\`\`\`

---

## Matplotlib — Visualisation

\`\`\`python
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Histogram
axes[0].hist(df['Age'].dropna(), bins=30, color='steelblue', edgecolor='white')
axes[0].set_title('Age Distribution')
axes[0].set_xlabel('Age')

# Scatter plot
axes[1].scatter(df['Fare'], df['Age'], c=df['Survived'],
                cmap='coolwarm', alpha=0.5)
axes[1].set_title('Fare vs Age (colour = survived)')

plt.tight_layout()
plt.savefig('eda.png', dpi=150)
\`\`\`

---

## Pythonic Patterns for ML Code

### List Comprehensions & Generators

\`\`\`python
# List comprehension — all squared evens
squared_evens = [x**2 for x in range(20) if x % 2 == 0]

# Generator — memory-efficient data streaming
def batch_generator(data, batch_size=32):
    for i in range(0, len(data), batch_size):
        yield data[i : i + batch_size]

for batch in batch_generator(df):
    pass  # process one batch at a time
\`\`\`

### Decorators

\`\`\`python
import time, functools

def timer(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        result = fn(*args, **kwargs)
        print(f"{fn.__name__} took {time.perf_counter()-t0:.3f}s")
        return result
    return wrapper

@timer
def train_model(X, y):
    ...  # expensive training loop
\`\`\`

### Type Hints

\`\`\`python
import numpy as np
from numpy.typing import NDArray

def normalise(X: NDArray[np.float64]) -> NDArray[np.float64]:
    """Return zero-mean, unit-variance version of X along axis 0."""
    return (X - X.mean(axis=0)) / (X.std(axis=0) + 1e-8)
\`\`\`

Type hints are not enforced at runtime but enable IDE autocomplete, catch bugs with tools like **mypy**, and serve as living documentation.
`,
  },

  'foundations/mathematics': {
    slug: 'foundations/mathematics',
    title: 'Mathematics for Machine Learning',
    description: 'Linear algebra, calculus, and probability & statistics — the three mathematical pillars every ML practitioner needs to understand what algorithms are actually doing.',
    content: `## Overview

Three branches of mathematics underpin virtually all of machine learning:

| Branch | Core Concept | ML Application |
|---|---|---|
| Linear Algebra | Vectors & matrices | Representing data, weights, transformations |
| Calculus | Derivatives & gradients | Training via gradient descent |
| Probability & Statistics | Uncertainty & inference | Probabilistic models, evaluation |

---

## Linear Algebra

### Vectors

A vector is an ordered list of numbers. In ML, a *feature vector* represents one data sample.

\`\`\`python
import numpy as np

# A data point with 3 features
x = np.array([2.0, -1.0, 4.0])

# L2 norm (Euclidean length)
norm = np.linalg.norm(x)   # √(4 + 1 + 16) ≈ 4.58

# Unit vector (direction without magnitude)
x_hat = x / norm
\`\`\`

### Matrices

A matrix of shape *(m × n)* stores *m* samples with *n* features, or represents a linear transformation.

\`\`\`python
# Matrix multiplication: (3×4) @ (4×2) → (3×2)
A = np.random.randn(3, 4)
B = np.random.randn(4, 2)
C = A @ B

# Transpose
A_T = A.T   # shape (4×3)

# Inverse (square matrices)
M = np.array([[2., 1.], [5., 3.]])
M_inv = np.linalg.inv(M)
print(M @ M_inv)  # ≈ identity matrix
\`\`\`

### Dot Product & Cosine Similarity

\`\`\`python
a = np.array([1., 0., 1.])
b = np.array([0., 1., 1.])

dot = a @ b                          # 1.0
cos_sim = dot / (np.linalg.norm(a) * np.linalg.norm(b))  # ≈ 0.5
\`\`\`

Cosine similarity measures the *angle* between vectors — the backbone of recommendation systems and embedding search.

### Eigenvalues & PCA

Principal Component Analysis (PCA) finds the eigenvectors of the covariance matrix, giving directions of maximum variance:

\`\`\`python
from sklearn.decomposition import PCA

pca = PCA(n_components=2)
X_2d = pca.fit_transform(X_high_dim)
print(pca.explained_variance_ratio_)   # e.g. [0.45, 0.22]
\`\`\`

---

## Calculus

### Derivatives & the Chain Rule

The derivative of *f(x)* measures how much *f* changes as *x* changes — i.e. the slope.

For a composition *f(g(x))*, the **chain rule** says: *d/dx f(g(x)) = f′(g(x)) · g′(x)*

This is exactly what **backpropagation** does across layers of a neural network.

### Gradients

The **gradient** generalises the derivative to multivariate functions. For a loss function *L(w₁, w₂, …, wₙ)*, the gradient ∇L is the vector of partial derivatives — it points in the direction of *steepest ascent*.

### Gradient Descent

\`\`\`python
# Minimise f(x) = x^2 with gradient descent
x = 10.0
learning_rate = 0.1

for step in range(50):
    gradient = 2 * x      # df/dx = 2x
    x = x - learning_rate * gradient
    if step % 10 == 0:
        print(f"step {step}: x={x:.4f}, f(x)={x**2:.6f}")
# Converges to x ≈ 0
\`\`\`

---

## Probability & Statistics

### Key Distributions

| Distribution | Use Case |
|---|---|
| Bernoulli | Binary outcome (coin flip, spam/not-spam) |
| Gaussian (Normal) | Continuous measurements, noise models |
| Categorical | Multi-class labels |
| Uniform | Random sampling, weight initialisation |

\`\`\`python
from scipy import stats

# Gaussian PDF
x = np.linspace(-4, 4, 200)
pdf = stats.norm.pdf(x, loc=0, scale=1)

# Sampling
samples = np.random.normal(loc=0, scale=1, size=1000)
\`\`\`

### Bayes' Theorem

$$P(H | E) = \\frac{P(E | H) \\cdot P(H)}{P(E)}$$

- **Prior** *P(H)* — your belief before seeing data
- **Likelihood** *P(E | H)* — how probable is the evidence given the hypothesis
- **Posterior** *P(H | E)* — updated belief after seeing data

Naive Bayes classifiers apply this directly; Bayesian neural networks use it for uncertainty-aware deep learning.

### Expectation & Variance

\`\`\`python
data = np.array([2, 4, 4, 4, 5, 5, 7, 9])
print(f"Mean: {data.mean():.2f}")    # E[X] = 5.0
print(f"Var:  {data.var():.2f}")     # Var(X) = 4.0
print(f"Std:  {data.std():.2f}")     # σ = 2.0
\`\`\`

### Correlation vs Causation

Pearson correlation measures *linear* association between two variables. A high correlation does **not** imply causation — a crucial distinction when drawing conclusions from data.

\`\`\`python
r = np.corrcoef(df['Age'], df['Fare'])[0, 1]
print(f"Pearson r = {r:.3f}")
\`\`\`
`,
  },

  'foundations/ml-basics': {
    slug: 'foundations/ml-basics',
    title: 'Machine Learning Basics',
    description: 'Supervised, unsupervised, and reinforcement learning paradigms, model evaluation fundamentals, overfitting and underfitting, and core algorithms with scikit-learn examples.',
    content: `## The Three Learning Paradigms

### Supervised Learning

The model learns a mapping from inputs **X** to labels **y** using labelled training examples.

- **Regression** — predicting a continuous value (house price, temperature)
- **Classification** — predicting a discrete category (spam/not-spam, digit 0–9)

\`\`\`python
from sklearn.linear_model import LinearRegression
from sklearn.datasets import fetch_california_housing

X, y = fetch_california_housing(return_X_y=True)
model = LinearRegression()
model.fit(X[:16000], y[:16000])
print(model.score(X[16000:], y[16000:]))   # R² on test set
\`\`\`

### Unsupervised Learning

No labels — the model discovers structure in the data.

- **Clustering** — group similar samples (K-Means, DBSCAN)
- **Dimensionality reduction** — compress data while preserving structure (PCA, UMAP)
- **Density estimation** — model the data distribution (GMM)

### Reinforcement Learning

An **agent** takes actions in an **environment** to maximise cumulative **reward**. Used in robotics, game playing (AlphaGo), and recommendation systems.

---

## Data Splits

Never evaluate a model on data it was trained on. The standard split:

| Split | Typical Size | Purpose |
|---|---|---|
| Training | 60–80 % | Fit model parameters |
| Validation | 10–20 % | Tune hyperparameters |
| Test | 10–20 % | Final unbiased evaluation |

\`\`\`python
from sklearn.model_selection import train_test_split

X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)
print(X_train.shape, X_val.shape, X_test.shape)
\`\`\`

For small datasets, use **k-fold cross-validation**:

\`\`\`python
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5, scoring='r2')
print(f"CV R²: {scores.mean():.3f} ± {scores.std():.3f}")
\`\`\`

---

## Overfitting & Underfitting

| Condition | Training Error | Validation Error | Fix |
|---|---|---|---|
| Underfitting (high bias) | High | High | More complex model, more features |
| Overfitting (high variance) | Low | High | Regularisation, more data, simpler model |
| Good fit | Low | Low | — |

### Regularisation

\`\`\`python
from sklearn.linear_model import Ridge, Lasso

# L2 regularisation (Ridge) — shrinks all weights
ridge = Ridge(alpha=1.0)

# L1 regularisation (Lasso) — drives some weights to zero (feature selection)
lasso = Lasso(alpha=0.1)
\`\`\`

---

## Core Algorithms

### Linear Regression

Fits a hyperplane by minimising mean squared error. Fast, interpretable, great baseline.

### Logistic Regression

Despite the name, it's a classifier. Uses the sigmoid function to output probabilities.

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris
from sklearn.metrics import classification_report

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

clf = LogisticRegression(max_iter=200)
clf.fit(X_train, y_train)
print(classification_report(y_test, clf.predict(X_test)))
\`\`\`

### Decision Trees & Random Forests

Decision trees split data on feature thresholds to create interpretable rules. **Random Forests** average many trees trained on random subsets, reducing variance.

\`\`\`python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
rf.fit(X_train, y_train)
importances = rf.feature_importances_
\`\`\`

### Support Vector Machines (SVM)

Finds the maximum-margin hyperplane separating classes. The **kernel trick** allows non-linear boundaries without explicit feature maps.

\`\`\`python
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

svm_pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('svm', SVC(kernel='rbf', C=1.0, gamma='scale'))
])
svm_pipe.fit(X_train, y_train)
\`\`\`

### K-Means Clustering

\`\`\`python
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=3, random_state=42, n_init='auto')
labels = kmeans.fit_predict(X)
print(kmeans.inertia_)   # within-cluster sum of squares
\`\`\`

---

## Evaluation Metrics

\`\`\`python
from sklearn.metrics import accuracy_score, roc_auc_score, mean_squared_error
import numpy as np

# Classification
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print(f"ROC-AUC:  {roc_auc_score(y_test, y_prob, multi_class='ovr'):.3f}")

# Regression
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"RMSE: {rmse:.3f}")
\`\`\`

Choose metrics aligned with the **business objective**, not just what's easy to maximise.
`,
  },

  'foundations/deep-learning': {
    slug: 'foundations/deep-learning',
    title: 'Deep Learning Fundamentals',
    description: 'Neural networks from first principles — activation functions, backpropagation, CNNs, RNNs/LSTMs, and an introduction to the Transformer architecture, with PyTorch examples throughout.',
    content: `## What Is a Neural Network?

A neural network is a function approximator composed of **layers** of **neurons**. Each neuron computes a weighted sum of its inputs and passes the result through a non-linear **activation function**.

\`\`\`
Input → [Linear → Activation] → [Linear → Activation] → ... → Output
\`\`\`

In matrix form, one layer computes: **h** = σ(**Wx** + **b**)

---

## Activation Functions

| Function | Formula | Use Case |
|---|---|---|
| ReLU | max(0, x) | Hidden layers (default) |
| Sigmoid | 1 / (1 + e⁻ˣ) | Binary output |
| Softmax | eˣᵢ / Σeˣⱼ | Multi-class output |
| Tanh | (eˣ − e⁻ˣ) / (eˣ + e⁻ˣ) | RNN hidden states |
| GELU | x · Φ(x) | Transformers |

---

## Building a Network in PyTorch

\`\`\`python
import torch
import torch.nn as nn
import torch.optim as optim

class MLP(nn.Module):
    def __init__(self, input_dim: int, hidden_dim: int, output_dim: int):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, output_dim),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)

model = MLP(input_dim=20, hidden_dim=128, output_dim=10)
criterion = nn.CrossEntropyLoss()
optimiser = optim.Adam(model.parameters(), lr=1e-3)
\`\`\`

### Training Loop

\`\`\`python
for epoch in range(20):
    model.train()
    for X_batch, y_batch in train_loader:
        optimiser.zero_grad()
        logits = model(X_batch)
        loss = criterion(logits, y_batch)
        loss.backward()           # compute gradients via backprop
        optimiser.step()          # update weights

    model.eval()
    with torch.no_grad():
        val_loss = criterion(model(X_val), y_val).item()
    print(f"Epoch {epoch+1:02d} | val_loss: {val_loss:.4f}")
\`\`\`

---

## Backpropagation

Backprop applies the **chain rule** from the loss backwards through every layer to compute each parameter's gradient. PyTorch's autograd engine does this automatically — every tensor operation is recorded in a computation graph, and \`.backward()\` traverses it in reverse.

Key insight: **the gradient of the loss w.r.t. a parameter tells us how to change that parameter to reduce the loss**.

---

## Convolutional Neural Networks (CNNs)

CNNs exploit the spatial structure of images by sharing weights across positions (convolution), drastically reducing parameters.

\`\`\`python
cnn = nn.Sequential(
    nn.Conv2d(in_channels=1, out_channels=32, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),                         # halve spatial dims
    nn.Conv2d(32, 64, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),
    nn.Flatten(),
    nn.Linear(64 * 7 * 7, 128),
    nn.ReLU(),
    nn.Linear(128, 10),
)
\`\`\`

Well-known CNN architectures: **LeNet**, **AlexNet**, **VGG**, **ResNet** (skip connections), **EfficientNet**.

---

## Recurrent Networks (RNNs & LSTMs)

RNNs process sequences by maintaining a hidden state **h** that is updated at each timestep:

**hₜ** = tanh(**W** · [**hₜ₋₁**, **xₜ**] + **b**)

**LSTMs** add three gates (forget, input, output) and a cell state, resolving the vanishing gradient problem for long sequences.

\`\`\`python
lstm = nn.LSTM(input_size=128, hidden_size=256, num_layers=2,
               batch_first=True, dropout=0.3)

x = torch.randn(32, 50, 128)  # (batch, seq_len, features)
output, (h_n, c_n) = lstm(x)
print(output.shape)   # (32, 50, 256)
\`\`\`

---

## Transformers — Attention Is All You Need

Transformers replaced RNNs as the dominant sequence architecture. The key innovation is **scaled dot-product attention**:

\`\`\`
Attention(Q, K, V) = softmax(QKᵀ / √dₖ) · V
\`\`\`

Multi-head attention runs several attention operations in parallel, each learning different relationship patterns.

\`\`\`python
attn = nn.MultiheadAttention(embed_dim=512, num_heads=8, batch_first=True)
x = torch.randn(32, 100, 512)   # (batch, seq_len, embed_dim)
out, weights = attn(x, x, x)    # self-attention
\`\`\`

### Why Transformers Dominate

- **Parallelisable** — no sequential dependency (unlike RNNs)
- **Long-range dependencies** — attention is *O(n²)* in sequence length but captures any pair
- **Scalable** — performance improves predictably with data and compute (scaling laws)

Modern LLMs (GPT, LLaMA, Gemini) are decoder-only Transformer stacks trained on next-token prediction.

---

## Regularisation Techniques

\`\`\`python
# Dropout — randomly zero activations during training
nn.Dropout(p=0.5)

# Batch Normalization — normalise activations within a mini-batch
nn.BatchNorm1d(num_features=128)

# Layer Normalization — preferred in Transformers
nn.LayerNorm(normalized_shape=512)

# Weight decay via optimiser
optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
\`\`\`
`,
  },

  'foundations/data-engineering': {
    slug: 'foundations/data-engineering',
    title: 'Data Engineering for AI',
    description: 'Data pipelines, ETL patterns, data formats, SQL essentials, Pandas-based data manipulation, data quality, and feature engineering — the practical infrastructure behind every ML system.',
    content: `## Why Data Engineering Matters

> "Data scientists spend 80% of their time cleaning data."

Clean, well-structured, reproducible data pipelines are the foundation of every successful ML system. A great model trained on bad data will fail in production. Data engineering is what prevents that.

---

## Data Formats

| Format | Type | Pros | Cons |
|---|---|---|---|
| CSV | Text | Universal, human-readable | Slow, no types, large |
| JSON | Text | Flexible, nested | Verbose, slow |
| Parquet | Binary columnar | Fast, compressed, typed | Not human-readable |
| HDF5 | Binary | Supports arrays natively | Complex API |
| Avro | Binary row | Schema evolution | Less tooling |

**For ML workloads, prefer Parquet** — it reads only the columns you need and compresses 5–10× better than CSV.

\`\`\`python
import pandas as pd

# Writing
df.to_parquet('data/features.parquet', index=False, compression='snappy')

# Reading (read only needed columns)
df = pd.read_parquet('data/features.parquet', columns=['age', 'income', 'label'])
\`\`\`

---

## ETL Pipelines

**Extract → Transform → Load** is the canonical pattern for moving and reshaping data.

\`\`\`python
import pandas as pd
from pathlib import Path

def extract(path: str) -> pd.DataFrame:
    return pd.read_csv(path, parse_dates=['timestamp'])

def transform(df: pd.DataFrame) -> pd.DataFrame:
    df = df.dropna(subset=['user_id', 'event'])
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df = df[df['amount'] > 0]                      # business rule
    df['log_amount'] = df['amount'].apply(lambda x: x ** 0.5)
    return df

def load(df: pd.DataFrame, output_path: str) -> None:
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(output_path, index=False)

if __name__ == '__main__':
    raw = extract('data/raw/events.csv')
    processed = transform(raw)
    load(processed, 'data/processed/events.parquet')
\`\`\`

---

## SQL Essentials

SQL is unavoidable — most production data lives in databases or data warehouses (BigQuery, Snowflake, Redshift).

\`\`\`sql
-- Aggregation
SELECT
    user_id,
    COUNT(*)                          AS event_count,
    SUM(amount)                       AS total_spend,
    AVG(amount)                       AS avg_spend,
    MAX(timestamp)                    AS last_seen
FROM events
WHERE timestamp >= '2024-01-01'
GROUP BY user_id
HAVING COUNT(*) >= 5
ORDER BY total_spend DESC
LIMIT 100;

-- Join
SELECT u.user_id, u.segment, e.total_spend
FROM users u
LEFT JOIN (
    SELECT user_id, SUM(amount) AS total_spend
    FROM events
    GROUP BY user_id
) e ON u.user_id = e.user_id;

-- Window function
SELECT
    user_id,
    timestamp,
    amount,
    SUM(amount) OVER (PARTITION BY user_id ORDER BY timestamp) AS running_total
FROM events;
\`\`\`

\`\`\`python
# Run SQL from Python with DuckDB (fast in-process analytics)
import duckdb

result = duckdb.query("""
    SELECT user_id, COUNT(*) as n
    FROM 'data/processed/events.parquet'
    GROUP BY user_id
""").df()
\`\`\`

---

## Data Quality

Poor data quality silently degrades model performance. Always check:

\`\`\`python
def data_quality_report(df: pd.DataFrame) -> None:
    print("=== Data Quality Report ===")
    print(f"Shape: {df.shape}")
    print("\\nMissing values:")
    missing = df.isnull().sum()
    print(missing[missing > 0])
    print("\\nDuplicates:", df.duplicated().sum())
    print("\\nData types:")
    print(df.dtypes)
    print("\\nNumeric summary:")
    print(df.describe())

data_quality_report(df)
\`\`\`

### Common Issues & Fixes

| Issue | Detection | Fix |
|---|---|---|
| Missing values | \`df.isnull().sum()\` | Impute (median/mean/mode) or drop |
| Duplicates | \`df.duplicated()\` | \`df.drop_duplicates()\` |
| Outliers | Box plots, z-score | Cap, log-transform, or remove |
| Label leakage | Domain knowledge | Remove future-knowing features |
| Distribution shift | Compare train vs prod stats | Retrain, add monitoring |

---

## Feature Engineering

Transforming raw data into informative signals is where domain knowledge creates the most value.

\`\`\`python
# Numerical features
df['age_squared'] = df['age'] ** 2
df['log_income'] = np.log1p(df['income'])                     # log1p handles 0s
df['age_income_ratio'] = df['age'] / (df['income'] + 1)

# Categorical encoding
df = pd.get_dummies(df, columns=['city'], drop_first=True)    # one-hot
df['city_code'] = df['city'].astype('category').cat.codes     # ordinal

# Date/time features
df['hour'] = df['timestamp'].dt.hour
df['is_weekend'] = df['timestamp'].dt.dayofweek >= 5
df['days_since_signup'] = (df['timestamp'] - df['signup_date']).dt.days

# Scaling (always fit on train, transform both)
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)      # NOT fit_transform!
\`\`\`

> **Golden rule:** The scaler (and any other preprocessing) must be fitted **only on training data**, then applied to validation/test data. Fitting on all data leaks test distribution information into your model.
`,
  },
}
