---
sidebar_position: 2
---

# 镜像命令

镜像（Image）是容器的只读模板。本节覆盖拉取、构建、查看与清理镜像的常用命令。

## 拉取镜像

从仓库（默认 Docker Hub）下载镜像到本地：

```bash title="Linux" showLineNumbers
docker pull ubuntu:22.04
```

不指定标签时默认拉取 `latest`，建议始终带上具体标签以保证可复现：

```bash title="Linux" showLineNumbers
docker pull ros:humble
```

> 💡 若拉取报 `i/o timeout`，请先参考 [安装篇的镜像加速器配置](/docs/docker/basics/install#配置镜像加速器国内--受限网络必看)。

## 查看本地镜像

列出已下载的镜像，含仓库、标签、镜像 ID 与大小：

```bash title="Linux" showLineNumbers
docker images
```

仅显示镜像 ID（常用于脚本批量操作）：

```bash title="Linux" showLineNumbers
docker images -q
```

## 构建镜像

基于 `Dockerfile` 构建镜像。`-t` 指定 `名称:标签`，结尾的 `.` 表示以当前目录为构建上下文：

```bash title="Linux" showLineNumbers
docker build -t my-ros-app:1.0 .
```

多阶段或需要缓存控制时可加 `--no-cache`：

```bash title="Linux" showLineNumbers
docker build --no-cache -t my-ros-app:1.0 .
```

## 打标签

为重命名或推送到私有仓库，给已有镜像打新标签（不会复制数据，仅新增引用）：

```bash title="Linux" showLineNumbers
docker tag my-ros-app:1.0 registry.example.com/my-ros-app:1.0
```

## 导出与导入

离线环境迁移镜像时，先存为 tar 包再载入：

```bash title="Linux" showLineNumbers
docker save -o my-ros-app.tar my-ros-app:1.0
docker load -i my-ros-app.tar
```

## 删除镜像

按镜像 ID 或标签删除；`-f` 可强制删除被容器占用的镜像（不推荐，应先进容器）：

```bash title="Linux" showLineNumbers
docker rmi my-ros-app:1.0
```

清理所有未被容器使用的悬空镜像（`<none>` 标签）：

```bash title="Linux" showLineNumbers
docker image prune
```

:::::tip

**一条命令释放磁盘空间**

删除所有未被使用的镜像、容器、网络和构建缓存（谨慎使用）：

```bash title="Linux" showLineNumbers
docker system prune -a
```

:::::
