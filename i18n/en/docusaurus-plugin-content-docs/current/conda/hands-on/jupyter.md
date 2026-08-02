---
sidebar_position: 2
---

# Jupyter Interactive Development

Jupyter Notebook is the most common interactive Python environment; Conda makes its install and isolation trivial.

## Install Jupyter

In the target env (Miniconda needs this manually; Anaconda ships it):

```bash title="Linux / macOS" showLineNumbers
conda activate myenv
conda install jupyter
```

> 💡 Prefer `jupyterlab` for a modern UI: `conda install jupyterlab`.

## Launch Notebook

```bash title="Linux / macOS" showLineNumbers
conda activate myenv
jupyter notebook --no-browser --port 8888
```

On a **remote server**, use `--no-browser` and forward the port over SSH:

```bash title="Linux / macOS" showLineNumbers
# run on your local terminal
ssh -N -L 8888:localhost:8888 user@server
```

Open `http://localhost:8888` in your browser and paste the token printed in the terminal.

## Isolate kernels

A new env is not auto-listed in Jupyter's kernels. Register it manually:

```bash title="Linux / macOS" showLineNumbers
conda activate myenv
conda install ipykernel
python -m ipykernel install --user --name myenv --display-name "Python (myenv)"
```

Then pick `Python (myenv)` under "Kernel → Change Kernel".

::::tip

**Why manage Jupyter with Conda**

Installing everything into `base` bloats and conflicts easily. Build per-project envs + register kernels to isolate deps while switching interpreters in one Jupyter.

::::
