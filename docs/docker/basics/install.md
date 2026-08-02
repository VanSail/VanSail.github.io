---
sidebar_position: 4
---

# 安装 Docker

本篇介绍如何在 Debian 与 Ubuntu 系统上安装 Docker Engine（社区版）。

::::tip

参考 [Docker 官方文档](https://docs.docker.com/)。

::::

## 版本支持

Docker 官方仓库为以下发行版提供预编译包：

<Tabs groupId="distro">
  <TabItem value="debian" label="Debian" default>
    - Debian 12 (bookworm)
    - Debian 11 (bullseye)
  </TabItem>
  <TabItem value="ubuntu" label="Ubuntu">
    - Ubuntu 24.04 (noble)
    - Ubuntu 22.04 (jammy)
    - Ubuntu 20.04 (focal)
  </TabItem>
</Tabs>

> 💡 **架构提示**：Docker 官方仓库同时提供 `amd64` 与 `arm64` 预编译包，安装命令完全一致，apt 会根据当前架构自动选择。

## 卸载旧版本

如果系统曾通过发行版仓库安装过 Docker（包名通常为 `docker.io`、`docker-compose` 等），建议先卸载，避免与官方版本冲突。该操作**不会**删除 `/var/lib/docker` 下的镜像与容器数据。

```bash title="Linux" showLineNumbers
sudo apt remove -y docker.io docker-compose docker-compose-v2 docker-doc podman-docker containerd runc
```

## 设置 Docker 的 apt 仓库

### 安装依赖工具

```bash title="Linux" showLineNumbers
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
```

### 添加 Docker 官方 GPG 密钥

```bash title="Linux" showLineNumbers
sudo curl -fsSL https://download.docker.com/linux/$(. /etc/os-release && echo "$ID")/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

### 添加 apt 源

根据发行版写入对应的仓库地址（Debian 与 Ubuntu 的仓库路径不同）。

<Tabs groupId="distro">
  <TabItem value="debian" label="Debian" default>

```bash title="Debian" showLineNumbers
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
```

  </TabItem>
  <TabItem value="ubuntu" label="Ubuntu">

```bash title="Ubuntu" showLineNumbers
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
```

  </TabItem>
</Tabs>

> ⚠️ **衍生发行版注意**：若使用 Debian testing 或 Kali 等衍生版，`/etc/os-release` 的 `VERSION_CODENAME` 可能无法对应稳定代号，请将上面命令中的 `$(. /etc/os-release && echo "$VERSION_CODENAME")` 替换为具体的稳定代号（如 `trixie`、`bookworm`）。

## 安装 Docker

安装最新版本的 Docker Engine 及其核心组件：

```bash title="Linux" showLineNumbers
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

安装完成后，Docker 守护进程通常以 `socket` 方式启动。确认其运行状态：

```bash title="Linux" showLineNumbers
sudo systemctl status docker --no-pager
```

若未自动运行，手动启动并设置开机自启：

```bash title="Linux" showLineNumbers
sudo systemctl enable --now docker
```

:::::tip

如需安装**特定版本**而非最新版，先列出可用版本：

```bash title="Linux" showLineNumbers
apt list -a docker-ce
```

然后指定版本号安装（将 `<VERSION_STRING>` 替换为类似 `5:27.1.1-1~debian.12~bookworm` 的串）：

```bash title="Linux" showLineNumbers
sudo apt install -y docker-ce=<VERSION_STRING> docker-ce-cli=<VERSION_STRING> containerd.io docker-buildx-plugin docker-compose-plugin
```

:::::

## 配置镜像加速器（国内 / 受限网络必看）

Docker 默认从 Docker Hub（`registry-1.docker.io`）拉取镜像。在部分网络环境（如国内、内网、仅 IPv6 出口受限的主机）下，该地址可能**无法直连**，表现为 `docker run` 长时间卡住并最终报 `i/o timeout`。

> ⚠️ 本教程实测：`registry-1.docker.io` 在部分网络下 DNS 仅返回 IPv6 地址且出站不通，直连拉取 `hello-world` 会失败。配置下方镜像加速器后即可正常拉取。

为稳定拉取镜像，建议配置国内镜像加速器。以 DaoCloud 公共镜像为例：

```bash title="Linux" showLineNumbers
sudo mkdir -p /etc/docker
echo '{"registry-mirrors":["https://docker.m.daocloud.io"]}' | sudo tee /etc/docker/daemon.json >/dev/null
sudo chmod 644 /etc/docker/daemon.json
sudo systemctl restart docker
```

验证加速器已生效：

```bash title="Linux" showLineNumbers
sudo docker info | grep -A1 "Registry Mirrors"
```

输出中出现 `https://docker.m.daocloud.io/` 即表示配置成功。你也可以替换为其他可用镜像源（如阿里云容器镜像服务，需登录账号获取专属加速地址）。

## 验证安装

运行官方 `hello-world` 镜像，验证 Docker 能正常拉取并启动容器：

```bash title="Linux" showLineNumbers
sudo docker run hello-world
```

看到 `Hello from Docker!` 及一段说明文字，即表示安装成功。

## 以非 root 用户运行（推荐）

默认情况下，只有 `root` 和 `docker` 用户组的成员可以执行 `docker` 命令。为避免每次都加 `sudo`，将当前用户加入 `docker` 组：

```bash title="Linux" showLineNumbers
sudo usermod -aG docker $USER
```

加入组后，需要**重新加载用户组**才能生效。最稳妥是注销并重新登录（或重启）；若通过 SSH 操作，直接**重开一个 SSH 会话**即可（新会话会自动带上 `docker` 组），无需重启系统。之后即可免 `sudo` 运行：

```bash title="Linux" showLineNumbers
docker run hello-world
```

> ⚠️ 将用户加入 `docker` 组相当于赋予其 `root` 等价权限（可借助 Docker 挂载逃逸），请仅在可信主机上操作。

## 常见问题与注意事项

:::::tip

**安装会附带额外依赖**

`apt install docker-ce` 会一并安装 `containerd.io`、`docker-buildx-plugin`、`docker-compose-plugin`，并可能拉入 `apparmor`、`nftables`、`pigz`、`docker-ce-rootless-extras` 等依赖，属正常现象，无需手动干预。

:::::

:::::warning

**镜像拉取超时**

若 `docker run` 报 `failed to resolve reference ... i/o timeout`，通常是网络无法直连 Docker Hub。请先确认已按上文配置[镜像加速器](#配置镜像加速器国内--受限网络必看)；若仍失败，检查主机是否能访问外网（`curl -4 https://registry-1.docker.io/v2/`）。

:::::

## 卸载 Docker Engine

如需彻底移除 Docker：

```bash title="Linux" showLineNumbers
sudo apt purge -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
sudo rm -rf /var/lib/docker /var/lib/containerd
sudo rm /etc/apt/sources.list.d/docker.list
```

> ⚠️ `rm -rf /var/lib/docker` 会**永久删除**所有镜像、容器与卷数据，操作前请确认已备份。
