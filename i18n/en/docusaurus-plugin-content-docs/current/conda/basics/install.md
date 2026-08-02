---
sidebar_position: 4
---

# Install Conda

This guide covers installing **Miniconda** and **Anaconda** on Linux (Debian / Ubuntu) and macOS. Windows users can use the official graphical `.exe` installer with similar steps.

:::::tip

See the [Miniconda docs](https://docs.conda.io/en/latest/miniconda.html) and [Anaconda docs](https://docs.anaconda.com/anaconda/install/).

:::::

## Choose a version

- **Miniconda**: lightweight, only Conda + Python — recommended for most cases.
- **Anaconda**: full suite, out-of-the-box — good for beginners or teaching.
- **Miniforge** (recommended for ARM / China networks): maintained by conda-forge, bundles Conda + Mamba, better ARM support and uses conda-forge by default.

> 💡 Architecture note: official installers come in `x86_64` (Intel/AMD) and `arm64` (Apple Silicon). For **Linux ARM64** devices use the `-aarch64` script (see below), NOT `MacOSX-arm64`.

## Download the installer (Linux / macOS)

::::tip

> ⚠️ **ARM platforms**: recent official Miniconda installers ship a `constructor` binary that requires **ARMv8.1+** instructions. On ARMv8.0 devices (e.g. Raspberry Pi 3/4 early revs, some Rockchip/Radxa boards with Cortex-A53/A72) it crashes with `Illegal instruction`. On such hardware use the **Miniforge `aarch64`** installer instead (verified working on ARMv8.0).

::::

<Tabs groupId="installer">
  <TabItem value="miniconda" label="Miniconda (x86_64 / Apple Silicon)" default>

```bash title="Linux / macOS" showLineNumbers
# x86_64 (Intel / AMD)
curl -fsSL -o miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# Apple Silicon (macOS arm64)
curl -fsSL -o miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh

# Linux ARM64 (aarch64) — note: not MacOSX-arm64
curl -fsSL -o miniconda.sh https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh
```

  </TabItem>
  <TabItem value="miniforge" label="Miniforge (recommended for ARM / China)">

```bash title="Linux / macOS" showLineNumbers
# x86_64
curl -fsSL -o miniforge.sh https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh

# Linux ARM64 (aarch64)
curl -fsSL -o miniforge.sh https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-aarch64.sh

# macOS (Intel / Apple Silicon universal)
curl -fsSL -o miniforge.sh https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-MacOSX-$(uname -m).sh
```

If GitHub is slow, use the TUNA mirror:

```bash title="Linux / macOS" showLineNumbers
# Linux ARM64 (aarch64), TUNA mirror
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

## Run the installer

For Miniconda (replace `miniconda.sh` with `anaconda.sh` for Anaconda, or `miniforge.sh` for Miniforge):

```bash title="Linux / macOS" showLineNumbers
bash miniconda.sh
# or Miniforge
bash miniforge.sh
```

> 💡 To install non-interactively to the default `~/miniconda3`, add `-b`: `bash miniforge.sh -b`.

During install you will be prompted to:

1. Press enter to read the license, then type `yes` to accept.
2. Confirm the install path (default `~/miniconda3`).
3. Initialize Conda (`Do you wish the installer to initialize Miniconda3...`) — **type `yes`** so it injects into your shell.

Reload your shell:

```bash title="Linux / macOS" showLineNumbers
source ~/.bashrc        # Bash
# or
source ~/.zshrc         # Zsh
```

## Verify

```bash title="Linux / macOS" showLineNumbers
conda --version
# e.g. conda 24.11.3
```

Update Conda itself:

```bash title="Linux / macOS" showLineNumbers
conda update -n base -c defaults conda
```

## Configure a mirror (China / restricted networks)

The default Anaconda source (`repo.anaconda.com` / `conda.anaconda.org`) can be slow, time out, or be unreachable in some networks. Configure a local mirror.

::::tip

> ⚠️ Mirror URLs may change — follow each mirror site's latest guide. Common mirrors that work:
> - Beijing Foreign Studies Univ. (BFSU): `https://mirrors.bfsu.edu.cn/anaconda/` (the HTTP plaintext `http://...` is often more reliable than HTTPS on restricted networks)
> - Tsinghua TUNA: `https://mirrors.tuna.tsinghua.edu.cn/anaconda/`
> - USTC: `https://mirrors.ustc.edu.cn/anaconda/`

::::

### Configure Conda channels

<Tabs groupId="mirror">
  <TabItem value="bfsu" label="BFSU (recommended for restricted nets)" default>

```bash title="Linux / macOS" showLineNumbers
# Use HTTP plaintext to avoid HTTPS issues on some networks
conda config --remove-key channels 2>/dev/null
conda config --add channels http://mirrors.bfsu.edu.cn/anaconda/pkgs/main
conda config --set channel_alias http://mirrors.bfsu.edu.cn/anaconda
conda config --set show_channel_urls yes
conda config --set ssl_verify false
```

  </TabItem>
  <TabItem value="tuna" label="Tsinghua TUNA" >

```bash title="Linux / macOS" showLineNumbers
conda config --remove-key channels 2>/dev/null
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge
conda config --set show_channel_urls yes
```

  </TabItem>
</Tabs>

::::warning

> ⚠️ **Clean up Miniforge's default channels**: Miniforge writes a default `conda-forge` channel (pointing to official HTTPS `conda.anaconda.org` / `prefix.dev`) into `$HOME/miniconda3/.condarc` (or `$HOME/.condarc`). On restricted networks this slows down or blocks installs. Edit that file so `channels` only lists your chosen mirror, and delete the `mirrored_channels` block.

::::

### Raise download retries (large files fail easily)

On some networks, larger packages (> a few MB) intermittently fail with `CondaHTTPError: HTTP 000 CONNECTION FAILED`. Raising retries makes installs stable:

```bash title="Linux / macOS" showLineNumbers
conda config --set remote_max_retries 10
conda config --set remote_read_timeout_secs 60
conda config --set remote_connect_timeout_secs 30
```

Verify:

```bash title="Linux / macOS" showLineNumbers
conda config --show channels
```

### Configure a pip mirror

Inside a Conda env, `pip` from the official PyPI may also be unreachable. Configure a pip mirror too (BFSU example):

```bash title="Linux / macOS" showLineNumbers
pip config set global.index-url https://mirrors.bfsu.edu.cn/pypi/web/simple
```

## Uninstall Conda

To fully remove (default path):

```bash title="Linux / macOS" showLineNumbers
rm -rf ~/miniconda3
# also delete the conda init block in ~/.bashrc / ~/.zshrc (between # >>> conda initialize >>> and # <<< conda initialize <<<)
```

> ⚠️ Back up important envs first ([Export / Import](/docs/conda/hands-on/export-import)); `rm -rf` is irreversible.
