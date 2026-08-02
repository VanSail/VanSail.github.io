---
sidebar_position: 3
---

# 包管理命令

包管理分 **Conda 包** 与 **PyPI 包** 两条路径。优先用 `conda install`，缺失时再用 `pip install`。

## 安装包

用 Conda 安装（默认从已配置通道搜索）：

```bash title="Linux / macOS" showLineNumbers
conda install numpy
conda install -n myenv pandas=2.2   # 指定环境、指定版本
conda install -c conda-forge pytorch  # 指定通道
```

在 Conda 环境中安装 PyPI 包（需先 `conda activate`）：

```bash title="Linux / macOS" showLineNumbers
pip install requests
```

> ⚠️ 混用建议：先用 `conda install` 装带二进制依赖的包（如 `numpy`、`pytorch`、`opencv`），再用 `pip` 补装纯 Python 包。避免用 `conda` 与 `pip` 交叉卸载同一包。

## 查看已装包

```bash title="Linux / macOS" showLineNumbers
conda list                 # 当前环境全部包
conda list -n myenv        # 指定环境
```

## 更新与卸载

```bash title="Linux / macOS" showLineNumbers
conda update numpy         # 更新单个包
conda update --all         # 更新当前环境全部包
conda remove numpy         # 卸载（Conda 安装的）
pip uninstall requests     # 卸载（pip 安装的）
```

## 搜索可用包

```bash title="Linux / macOS" showLineNumbers
conda search "numpy>=1.26"
```

## 清理缓存

Conda 会缓存下载的包压缩文件，占用磁盘。定期清理：

```bash title="Linux / macOS" showLineNumbers
conda clean -a -y          # 清理全部缓存（tarball、未用包索引等）
```

> ⚠️ `conda clean -a` 会删除所有下载缓存，下次安装需重新下载，仅在不需保留缓存时执行。
