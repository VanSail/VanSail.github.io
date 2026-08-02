---
sidebar_position: 2
---

# What is Conda

Conda is an open-source **cross-platform package, dependency and environment manager**. Born for Python data science, it now manages binary dependencies of any language (e.g. CUDA, MKL, compilers) — the key difference from pure-Python toolchains.

## Why Conda

In Python development, "works on my machine" is equally painful: different projects need different library versions, even different Python interpreters; some scientific libraries (e.g. NumPy) depend on specific C/Fortran runtimes. Conda solves this with **isolated environments + binary packages**:

- **Isolation**: each environment has its own Python interpreter and package directory,互不干扰.
- **Binary distribution**: prebuilt binaries avoid local compilation — faster and more reliable installs.

## Anaconda vs Miniconda

Both run the same Conda engine; they differ in **preinstalled content**:

| Item | Anaconda | Miniconda |
| --- | --- | --- |
| Size | ~3–5 GB | ~100 MB |
| Preinstalled | Conda + 1500+ scientific packages (NumPy, Pandas, Jupyter…) | Only Conda + Python |
| Best for | Beginners, out-of-the-box use | Lightweight, on-demand, CI / containers |
| Startup | Slower (many packages) | Fast |

> 💡 Recommendation: prefer **Miniconda** for daily dev and servers, installing on demand via `conda install`; choose Anaconda for teaching or a quick trial.

## Core components

Conda uses a local-repo + channel architecture:

- **Conda CLI**: the `conda` commands you run.
- **Environment**: isolated workspaces, each with its own interpreter and packages.
- **Channel**: the download source for packages, defaulting to `defaults` on [Anaconda.org](https://anaconda.org); the community favours `conda-forge`.

::::tip

**Typical workflow**

```text
Install Miniconda → conda create new env → conda activate
                                          ↓
                       conda install pkg / pip install PyPI pkg
```

::::

Next, read [Core Concepts](/docs/conda/basics/concepts) to understand environments, channels and the relation with pip.
