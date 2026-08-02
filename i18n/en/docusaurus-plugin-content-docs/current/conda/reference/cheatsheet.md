---
sidebar_position: 2
---

# Command Cheatsheet

A one-page summary of the most frequent Conda commands. Full usage in other pages of this section.

## Install / config

| Command | Notes |
| --- | --- |
| `conda --version` | Show Conda version |
| `conda update -n base -c defaults conda` | Update Conda itself |
| `conda config --add channels conda-forge` | Add a channel |
| `conda config --set channel_priority strict` | Strict channel priority |
| `conda config --show channels` | Show configured channels |

## Environment

| Command | Notes |
| --- | --- |
| `conda create -n <name> python=3.11` | New env |
| `conda create -n <name> --clone <src>` | Clone env |
| `conda env list` | List all envs |
| `conda activate <name>` | Activate env |
| `conda deactivate` | Deactivate current env |
| `conda env remove -n <name>` | Remove env |
| `conda env create -f environment.yml` | Create from file |

## Package

| Command | Notes |
| --- | --- |
| `conda install <pkg>` | Install Conda pkg |
| `conda install -c <channel> <pkg>` | Install from channel |
| `conda install -n <name> <pkg>` | Install into env |
| `pip install <pkg>` | Install PyPI pkg (in env) |
| `conda list` | List current env packages |
| `conda update <pkg>` / `conda update --all` | Update pkg / all |
| `conda remove <pkg>` | Remove Conda pkg |
| `conda search "<pkg>>=1.0"` | Search available |
| `conda clean -a -y` | Clean all caches |

## Export / import

| Command | Notes |
| --- | --- |
| `conda env export > environment.yml` | Export current env |
| `conda env create -f environment.yml` | Import and create env |

## Jupyter

| Command | Notes |
| --- | --- |
| `conda install jupyterlab` | Install JupyterLab |
| `jupyter notebook --no-browser --port 8888` | Launch remotely |
| `python -m ipykernel install --user --name <name>` | Register env as kernel |

> ⚠️ `conda clean -a` **permanently** deletes download caches (re-download next time); `conda env remove` **permanently** deletes the env and all its packages.
