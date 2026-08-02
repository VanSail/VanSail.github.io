---
sidebar_position: 2
---

# 命令速查表

一页汇总日常最高频的 Conda 命令，方便随时翻阅。完整用法见本栏目其他页面。

## 安装 / 配置

| 命令 | 说明 |
| --- | --- |
| `conda --version` | 查看 Conda 版本 |
| `conda update -n base -c defaults conda` | 更新 Conda 自身 |
| `conda config --add channels conda-forge` | 添加通道 |
| `conda config --set channel_priority strict` | 严格通道优先级 |
| `conda config --show channels` | 查看已配置通道 |

## 环境

| 命令 | 说明 |
| --- | --- |
| `conda create -n <name> python=3.11` | 新建环境 |
| `conda create -n <name> --clone <src>` | 克隆环境 |
| `conda env list` | 列出全部环境 |
| `conda activate <name>` | 激活环境 |
| `conda deactivate` | 退出当前环境 |
| `conda env remove -n <name>` | 删除环境 |
| `conda env create -f environment.yml` | 从文件创建环境 |

## 包

| 命令 | 说明 |
| --- | --- |
| `conda install <pkg>` | 安装 Conda 包 |
| `conda install -c <channel> <pkg>` | 指定通道安装 |
| `conda install -n <name> <pkg>` | 指定环境安装 |
| `pip install <pkg>` | 安装 PyPI 包（环境内） |
| `conda list` | 查看当前环境包 |
| `conda update <pkg>` / `conda update --all` | 更新包 / 全部 |
| `conda remove <pkg>` | 卸载 Conda 包 |
| `conda search "<pkg>>=1.0"` | 搜索可用包 |
| `conda clean -a -y` | 清理全部缓存 |

## 导出 / 导入

| 命令 | 说明 |
| --- | --- |
| `conda env export > environment.yml` | 导出当前环境 |
| `conda env create -f environment.yml` | 导入并创建环境 |

## Jupyter

| 命令 | 说明 |
| --- | --- |
| `conda install jupyterlab` | 安装 JupyterLab |
| `jupyter notebook --no-browser --port 8888` | 远程启动 |
| `python -m ipykernel install --user --name <name>` | 注册环境为 kernel |

> ⚠️ `conda clean -a` 会**永久删除**下载缓存，下次安装需重新下载；`conda env remove` 会**永久删除**环境及其中全部包。
