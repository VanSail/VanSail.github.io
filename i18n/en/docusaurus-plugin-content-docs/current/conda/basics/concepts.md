---
sidebar_position: 3
---

# Core Concepts

Understand three core objects and you know Conda's skeleton: **environment, channel, package**.

## Environment

An environment is an **isolated workspace** with its own Python interpreter and `site-packages`. Switching environments switches the whole dependency set — the root of how Conda resolves "version conflicts".

- Location: default `~/miniconda3/envs/<name>`.
- Analogy: like "a separate Python room" — NumPy 1.x in room A, NumPy 2.x in room B, no interference.

## Channel

A channel is the **download source** for Conda packages, searched from highest to lowest priority. Common channels:

| Channel | Notes |
| --- | --- |
| `defaults` | Anaconda-maintained packages (default) |
| `conda-forge` | Community-driven, most complete and fastest-updating (recommended) |
| `pytorch` | Official PyTorch channel |

Enable a channel:

```bash title="Linux / macOS" showLineNumbers
conda config --add channels conda-forge
conda config --set channel_priority strict
```

> 💡 `channel_priority strict` makes Conda prefer resolving all deps from one channel, greatly reducing conflicts from mixing channels.

## Package

A package is Conda's smallest managed unit, from two sources:

- **Conda package**: binary built by Conda, may include non-Python deps (e.g. CUDA).
- **PyPI package**: pure-Python installed via `pip`, also usable inside Conda envs.

> ⚠️ Inside a Conda env, prefer `conda install`; fall back to `pip install` only when a package is absent. **Do not mix `pip` and `conda` to uninstall the same package** — it breaks the env.

## How they relate

```text
   Channel (defaults / conda-forge)
            │ conda install
            ▼
   Package ──create / install──▶ Environment
                                     │ activate
                                     ▼
                            isolated Python interpreter + deps
```

Install steps: [Install Anaconda / Miniconda](/docs/conda/basics/install); env & package commands: [Commands](/docs/conda/commands).
