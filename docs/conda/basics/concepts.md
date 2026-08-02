---
sidebar_position: 3
---

# 核心概念

理解三个核心对象，就掌握了 Conda 的骨架：**环境、通道、包**。

## 环境（Environment）

环境是**相互隔离的工作区**，每个环境拥有独立的 Python 解释器与 `site-packages` 目录。切换环境即可切换整套依赖，是 Conda 解决「版本冲突」的根本手段。

- 位置：默认位于 `~/miniconda3/envs/<name>`（或 Anaconda 的对应路径）。
- 类比：像「独立的 Python 小房间」——在房间 A 装 NumPy 1.x，房间 B 装 NumPy 2.x，互不影响。

## 通道（Channel）

通道是 Conda 包的**下载源**，按优先级从高到低搜索。常见通道：

| 通道 | 说明 |
| --- | --- |
| `defaults` | Anaconda 官方维护的包（默认启用） |
| `conda-forge` | 社区驱动，包最全、更新最快（推荐优先） |
| `pytorch` | PyTorch 官方专用通道 |

激活某个通道的方式：

```bash title="Linux / macOS" showLineNumbers
conda config --add channels conda-forge
conda config --set channel_priority strict
```

> 💡 `channel_priority strict` 让 Conda 优先从同一通道取齐依赖，能显著减少「混合通道导致的依赖冲突」。

## 包（Package）

包是 Conda 管理的最小单元，分两类来源：

- **Conda 包**：由 Conda 构建的二进制包，可含非 Python 依赖（如 CUDA）。
- **PyPI 包**：通过 `pip` 安装的纯 Python 包，Conda 环境内也可用。

> ⚠️ 在 Conda 环境中，尽量先用 `conda install`；若仓库没有再用 `pip install`。**不要混用 `pip` 与 `conda` 卸载同一包**，否则易破坏环境。

## 三者关系一图流

```text
   Channel (通道: defaults / conda-forge)
            │ conda install
            ▼
   Package (包) ──create / install──▶ Environment (环境)
                                         │ activate
                                         ▼
                                  独立 Python 解释器 + 依赖
```

安装环境见 [安装 Anaconda / Miniconda](/docs/conda/basics/install)；环境与包命令见 [命令](/docs/conda/commands)。
