---
sidebar_position: 2
---

# 什么是 Conda

Conda 是一个开源的**跨平台包、依赖与环境管理器**。它最初为 Python 数据科学而生，但如今可以管理任意语言的二进制依赖（如 CUDA、MKL、编译器），这也是它与纯 Python 工具链最大的区别。

## 为什么需要 Conda

在 Python 开发中，「在我机器上能跑」同样恼人：不同项目需要不同版本的库，甚至不同版本的 Python 解释器；部分科学计算库（如 NumPy）底层依赖特定版本的 C/Fortran 运行时。Conda 通过**隔离的环境 + 二进制包**解决它：

- **隔离**：每个环境拥有独立的 Python 解释器与包目录，互不干扰。
- **二进制分发**：预编译好的二进制包避免本地编译，安装更快、成功率更高。

## Anaconda 与 Miniconda

两者都基于同一个 Conda 引擎，区别在于**预装内容**：

| 对比项 | Anaconda | Miniconda |
| --- | --- | --- |
| 体积 | 约 3~5 GB | 约 100 MB |
| 预装内容 | Conda + 1500+ 科学计算包（NumPy、Pandas、Jupyter 等） | 仅 Conda + Python |
| 适用场景 | 新手、希望开箱即用 | 需要轻量、按需安装、CI / 容器 |
| 启动速度 | 较慢（包多） | 快 |

> 💡 推荐：日常开发与服务器优先选 **Miniconda**，按需 `conda install`；教学或快速试用可选 Anaconda。

## 核心组件

Conda 采用本地仓库 + 通道（channel）架构：

- **Conda 客户端（CLI）**：你执行的 `conda` 命令。
- **环境（environment）**：相互隔离的工作区，含独立的解释器与包。
- **通道（channel）**：包的下载源，默认是 [Anaconda.org](https://anaconda.org) 的 `defaults`，社区常用 `conda-forge`。

::::tip

**典型工作流**

```text
安装 Miniconda → conda create 新建环境 → conda activate 进入环境
                                              ↓
                          conda install 装包 / pip install 装 PyPI 包
```

::::

接下来阅读 [核心概念](/docs/conda/basics/concepts) 了解 Conda 环境、通道与 pip 的关系。
