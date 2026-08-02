---
sidebar_position: 2
---

# 环境管理命令

环境（environment）是 Conda 的核心。本节覆盖创建、激活、退出、删除环境的日常操作。

## 创建环境

创建名为 `myenv`、Python 版本为 3.11 的环境：

```bash title="Linux / macOS" showLineNumbers
conda create -n myenv python=3.11
```

从文件一键创建（见 [导出导入](/docs/conda/hands-on/export-import)）：

```bash title="Linux / macOS" showLineNumbers
conda env create -f environment.yml
```

## 查看环境

列出本机全部环境，`*` 表示当前激活环境：

```bash title="Linux / macOS" showLineNumbers
conda env list
# 或
conda info --envs
```

## 激活与退出

```bash title="Linux / macOS" showLineNumbers
conda activate myenv     # 进入环境
conda deactivate         # 退出当前环境，回到 base
```

> 💡 若 `conda activate` 报 `command not found`，先执行 `source ~/miniconda3/etc/profile.d/conda.sh` 加载初始化，或确认安装时已选 `conda init`。

## 删除环境

删除名为 `oldenv` 的环境（`-y` 跳过确认）：

```bash title="Linux / macOS" showLineNumbers
conda env remove -n oldenv -y
```

## 克隆环境

基于已有环境复制一份（常用于试错前备份）：

```bash title="Linux / macOS" showLineNumbers
conda create -n myenv-copy --clone myenv
```

::::tip

**日常排查三连**

```bash title="Linux / macOS" showLineNumbers
conda env list          # 1. 看有哪些环境 / 当前处于哪个
conda list              # 2. 看当前环境装了哪些包
conda info              # 3. 看 Conda 根路径与通道配置
```

::::
