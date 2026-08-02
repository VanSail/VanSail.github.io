---
sidebar_position: 3
---

# Export and Import Environments

Write an environment to a file, then **reproduce it in one command** on another machine or image — key for collaboration and deployment.

## Export to environment.yml

```bash title="Linux / macOS" showLineNumbers
conda activate myenv
conda env export > environment.yml
```

Resulting `environment.yml`:

```yaml title="environment.yml"
name: myenv
channels:
  - conda-forge
  - defaults
dependencies:
  - python=3.11
  - numpy=1.26
  - pandas=2.2
  - pip
  - pip:
      - requests==2.31.0
```

> 💡 The trailing `pip:` section records pip-installed packages so pure-Python deps are not lost.

## Minimal export (direct deps only)

`conda env export` includes all transitive deps, which can be too large to port. Maintain a **minimal** `environment.yml`:

```yaml title="environment.yml"
name: myenv
channels:
  - conda-forge
dependencies:
  - python=3.11
  - numpy
  - pandas
  - pip
  - pip:
      - requests
```

## Create from file

On another machine:

```bash title="Linux / macOS" showLineNumbers
conda env create -f environment.yml
```

> ⚠️ If `environment.yml` came from `conda env export` with build strings (e.g. `numpy=1.26.4=py311h...`), rebuilding on a different platform may fail to find that build. Use the minimal form (just `numpy`) to let Conda resolve.

## Clone locally

Without a file, copy an env on the same machine (see [Environment Commands](/docs/conda/commands/environment)):

```bash title="Linux / macOS" showLineNumbers
conda create -n myenv-copy --clone myenv
```
