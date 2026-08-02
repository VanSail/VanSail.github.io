---
sidebar_position: 3
---

# Package Commands

Package management has two paths: **Conda packages** and **PyPI packages**. Prefer `conda install`; fall back to `pip install` when absent.

## Install packages

Via Conda (searches configured channels):

```bash title="Linux / macOS" showLineNumbers
conda install numpy
conda install -n myenv pandas=2.2   # specific env, specific version
conda install -c conda-forge pytorch  # specific channel
```

Via pip inside a Conda env (after `conda activate`):

```bash title="Linux / macOS" showLineNumbers
pip install requests
```

> ⚠️ Mixing rule: use `conda install` for packages with binary deps (e.g. `numpy`, `pytorch`, `opencv`), then `pip` for pure-Python ones. Avoid `conda` and `pip` cross-uninstalling the same package.

## List installed packages

```bash title="Linux / macOS" showLineNumbers
conda list                 # current env
conda list -n myenv        # specific env
```

## Update / remove

```bash title="Linux / macOS" showLineNumbers
conda update numpy         # update one
conda update --all         # update all in current env
conda remove numpy         # remove (conda-installed)
pip uninstall requests     # remove (pip-installed)
```

## Search

```bash title="Linux / macOS" showLineNumbers
conda search "numpy>=1.26"
```

## Clean cache

Conda caches downloaded packages. Clean periodically:

```bash title="Linux / macOS" showLineNumbers
conda clean -a -y          # clean all caches
```

> ⚠️ `conda clean -a` deletes all download caches; next install re-downloads.
