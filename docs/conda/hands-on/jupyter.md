---
sidebar_position: 2
---

# Jupyter 交互式开发

Jupyter Notebook 是最常用的交互式 Python 环境，Conda 让它的安装与隔离变得简单。

## 安装 Jupyter

在目标环境中安装（Miniconda 需手动装；Anaconda 已预装）：

```bash title="Linux / macOS" showLineNumbers
conda activate myenv
conda install jupyter
```

> 💡 推荐用 `jupyterlab`，功能更现代：`conda install jupyterlab`。

## 启动 Notebook

```bash title="Linux / macOS" showLineNumbers
conda activate myenv
jupyter notebook --no-browser --port 8888
```

在**远程服务器**上，加 `--no-browser` 并通过 SSH 端口转发到本地访问：

```bash title="Linux / macOS" showLineNumbers
# 本地终端执行端口转发
ssh -N -L 8888:localhost:8888 user@server
```

浏览器打开 `http://localhost:8888` 并粘贴终端输出的 token 即可。

## 隔离 Kernel

新环境默认不会自动出现在 Jupyter 的 kernel 列表中。手动注册：

```bash title="Linux / macOS" showLineNumbers
conda activate myenv
conda install ipykernel
python -m ipykernel install --user --name myenv --display-name "Python (myenv)"
```

之后在 Jupyter 的「Kernel → Change Kernel」中即可选到 `Python (myenv)`。

::::tip

**为什么用 Conda 管理 Jupyter**

直接在 `base` 环境装所有包会让 `base` 臃肿且易冲突。按项目建环境 + 注册 kernel，既能隔离依赖，又能在同一 Jupyter 里切换多个项目的解释器。

::::
