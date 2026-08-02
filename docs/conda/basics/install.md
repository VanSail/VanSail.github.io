---
sidebar_position: 4
---

# 安装 Conda

本篇介绍在 Linux（Debian / Ubuntu）与 macOS 上安装 **Miniconda** 与 **Anaconda**。Windows 用户可使用官方图形安装器（`.exe`），步骤类似。

::::tip
参考 [Miniconda 官方文档](https://docs.conda.io/en/latest/miniconda.html) 与 [Anaconda 官方文档](https://docs.anaconda.com/anaconda/install/)。

::::

## 选择版本

- **Miniconda**：轻量，仅含 Conda + Python，推荐大多数场景。
- **Anaconda**：完整套件，开箱即用，适合新手或教学。
- **Miniforge**（推荐用于 ARM / 国内网络）：由 conda-forge 维护，自带 Conda + Mamba，对 ARM 架构兼容性更好，默认使用 conda-forge 频道。

> 💡 架构提示：官方同时提供 `x86_64`（Intel / AMD）与 `arm64`（Apple Silicon、部分 ARM 服务器）安装脚本。Linux ARM64 设备请使用 `-aarch64` 后缀脚本（见下文），而不是 macOS 的 `MacOSX-arm64`。

## 下载安装脚本（Linux / macOS）

::::tip
> ⚠️ **ARM 平台特别注意**：较新版本的官方 Miniconda 安装器中自带的 `constructor` 二进制要求 **ARMv8.1+** 指令集。在 ARMv8.0 设备（如树莓派 3/4 早期型号、部分 Rockchip / Radxa 主板用的 Cortex-A53/A72）上运行会报 `Illegal instruction` 并安装失败。**此类设备请直接使用 Miniforge 的 `aarch64` 安装器**（已验证可在 ARMv8.0 上正常安装运行）。

::::
<Tabs groupId="installer">
  <TabItem value="miniconda" label="Miniconda（x86_64 / Apple Silicon）" default>

```bash title="Linux / macOS" showLineNumbers
# x86_64 (Intel / AMD)
curl -fsSL -o miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# Apple Silicon (macOS arm64)
curl -fsSL -o miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh

# Linux ARM64 (aarch64) —— 注意不是 MacOSX-arm64
curl -fsSL -o miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh
```

  </TabItem>
  <TabItem value="miniforge" label="Miniforge（推荐 ARM / 国内网络）">

```bash title="Linux / macOS" showLineNumbers
# x86_64
curl -fsSL -o miniforge.sh https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh

# Linux ARM64 (aarch64)
curl -fsSL -o miniforge.sh https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-aarch64.sh

# macOS (Intel / Apple Silicon 通用)
curl -fsSL -o miniforge.sh https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-MacOSX-$(uname -m).sh
```

若 GitHub 访问不畅，国内可使用 TUNA 镜像：

```bash title="Linux / macOS" showLineNumbers
# Linux ARM64 (aarch64)，TUNA 镜像
curl -fsSL -o miniforge.sh https://mirrors.tuna.tsinghua.edu.cn/github-release/conda-forge/miniforge/LatestRelease/Miniforge3-Linux-aarch64.sh
```

  </TabItem>
  <TabItem value="anaconda" label="Anaconda">

```bash title="Linux / macOS" showLineNumbers
# x86_64
curl -fsSL -o anaconda.sh https://repo.anaconda.com/archive/Anaconda3-latest-Linux-x86_64.sh
```

  </TabItem>
</Tabs>

## 运行安装器

以 Miniconda 为例（Anaconda 把 `miniconda.sh` 换成 `anaconda.sh`，Miniforge 换成 `miniforge.sh` 即可）：

```bash title="Linux / macOS" showLineNumbers
bash miniconda.sh
# 或 Miniforge
bash miniforge.sh
```

> 💡 想跳过交互直接安装到默认路径 `~/miniconda3`，可加 `-b` 参数：`bash miniforge.sh -b`。

安装过程中会提示：

1. 回车阅读许可协议，输入 `yes` 同意。
2. 确认安装路径（默认 `~/miniconda3`）。
3. 是否初始化 Conda（`Do you wish the installer to initialize Miniconda3 by running conda init?`），**输入 `yes`** 以便自动注入 shell。

完成后让当前 shell 生效：

```bash title="Linux / macOS" showLineNumbers
source ~/.bashrc        # Bash
# 或
source ~/.zshrc         # Zsh
```

## 验证安装

```bash title="Linux / macOS" showLineNumbers
conda --version
# 输出如：conda 24.11.3
```

更新 Conda 到最新版：

```bash title="Linux / macOS" showLineNumbers
conda update -n base -c defaults conda
```

## 配置镜像源（国内 / 受限网络必看）

默认从 Anaconda 官方源（`repo.anaconda.com` / `conda.anaconda.org`）拉包，在部分网络环境下可能很慢、超时甚至完全不可达。建议配置国内镜像。

::::tip

> ⚠️ 镜像源地址可能变动，请以各镜像站最新说明为准。常见可用镜像：
> - 北京外国语大学 BFSU：`https://mirrors.bfsu.edu.cn/anaconda/`（HTTP 明文 `http://...` 在部分受限网络下比 HTTPS 更稳）
> - 清华 TUNA：`https://mirrors.tuna.tsinghua.edu.cn/anaconda/`
> - 中科大 USTC：`https://mirrors.ustc.edu.cn/anaconda/`

::::

### 配置 Conda 频道

<Tabs groupId="mirror">
  <TabItem value="bfsu" label="BFSU（推荐受限网络）" default>

```bash title="Linux / macOS" showLineNumbers
# 使用 HTTP 明文源，规避部分网络下 HTTPS 不通的问题
conda config --remove-key channels 2>/dev/null
conda config --add channels http://mirrors.bfsu.edu.cn/anaconda/pkgs/main
conda config --set channel_alias http://mirrors.bfsu.edu.cn/anaconda
conda config --set show_channel_urls yes
conda config --set ssl_verify false
```

  </TabItem>
  <TabItem value="tuna" label="清华 TUNA">

```bash title="Linux / macOS" showLineNumbers
conda config --remove-key channels 2>/dev/null
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge
conda config --set show_channel_urls yes
```

  </TabItem>
</Tabs>

::::warning

> ⚠️ **清理 Miniforge 自带的默认频道**：Miniforge 安装时会在 `$HOME/miniconda3/.condarc`（或 `$HOME/.condarc`）写入默认 `conda-forge` 频道，指向官方 HTTPS 地址（`conda.anaconda.org` / `prefix.dev`）。在受限网络下它会拖慢甚至阻断安装。请编辑该文件，确保 `channels` 只保留你配置的国内镜像，并删除 `mirrored_channels` 段。

::::

### 提高下载重试次数（大文件易失败）

在部分网络下，单个较大的包（几 MB 以上）下载容易偶发中断并报 `CondaHTTPError: HTTP 000 CONNECTION FAILED`。调高重试次数即可稳定安装：

```bash title="Linux / macOS" showLineNumbers
conda config --set remote_max_retries 10
conda config --set remote_read_timeout_secs 60
conda config --set remote_connect_timeout_secs 30
```

验证配置：

```bash title="Linux / macOS" showLineNumbers
conda config --show channels
```

### 配置 pip 镜像

Conda 环境内使用 `pip` 安装 PyPI 包时，官方源同样可能不可达，建议一并配置 pip 国内镜像（以 BFSU 为例）：

```bash title="Linux / macOS" showLineNumbers
pip config set global.index-url https://mirrors.bfsu.edu.cn/pypi/web/simple
```

## 卸载 Conda

若需彻底移除（以默认路径为例）：

```bash title="Linux / macOS" showLineNumbers
rm -rf ~/miniconda3
# 并删除 ~/.bashrc / ~/.zshrc 中 conda init 注入的段落（介于 # >>> conda initialize >>> 与 # <<< conda initialize <<< 之间）
```

> ⚠️ 删除前请确认已导出/备份重要环境（[导出导入](/docs/conda/hands-on/export-import)），`rm -rf` 数据不可恢复。
