---
sidebar_position: 2
---

# Environment Commands

The environment is Conda's core. This section covers creating, activating, deactivating and removing environments.

## Create an environment

Create `myenv` with Python 3.11:

```bash title="Linux / macOS" showLineNumbers
conda create -n myenv python=3.11
```

Create from a file (see [Export / Import](/docs/conda/hands-on/export-import)):

```bash title="Linux / macOS" showLineNumbers
conda env create -f environment.yml
```

## List environments

`*` marks the active environment:

```bash title="Linux / macOS" showLineNumbers
conda env list
# or
conda info --envs
```

## Activate / deactivate

```bash title="Linux / macOS" showLineNumbers
conda activate myenv     # enter env
conda deactivate         # leave current env, back to base
```

> 💡 If `conda activate` says `command not found`, run `source ~/miniconda3/etc/profile.d/conda.sh` first, or ensure `conda init` ran at install.

## Remove an environment

```bash title="Linux / macOS" showLineNumbers
conda env remove -n oldenv -y
```

## Clone an environment

```bash title="Linux / macOS" showLineNumbers
conda create -n myenv-copy --clone myenv
```

::::tip

**Daily triage three-liner**

```bash title="Linux / macOS" showLineNumbers
conda env list          # 1. which envs / which is active
conda list              # 2. what's installed in current env
conda info              # 3. Conda root path and channel config
```

::::
