---
sidebar_position: 3
---

# 导出与导入环境

把环境「写进文件」，就能在另一台机器或镜像中**一键复现**，是团队协作与部署的关键。

## 导出为 environment.yml

```bash title="Linux / macOS" showLineNumbers
conda activate myenv
conda env export > environment.yml
```

生成的 `environment.yml` 形如：

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

> 💡 末尾的 `pip:` 段会记录通过 `pip` 安装的包，保证纯 Python 依赖也不丢失。

## 精简导出（仅直接依赖）

`conda env export` 会包含全部间接依赖，跨平台移植时可能过大。若要更干净、可移植的文件，手动维护一份**最小化** `environment.yml`：

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

## 从文件创建环境

在另一台机器上：

```bash title="Linux / macOS" showLineNumbers
conda env create -f environment.yml
```

> ⚠️ 若 `environment.yml` 由 `conda env export` 生成且含具体构建号（如 `numpy=1.26.4=py311h...`），在非原平台重建可能找不到对应构建。此时用精简版（只写 `numpy`）让 Conda 自行解析更稳妥。

## 克隆到本机

不借助文件，直接在本机复制环境（见 [环境管理命令](/docs/conda/commands/environment)）：

```bash title="Linux / macOS" showLineNumbers
conda create -n myenv-copy --clone myenv
```
