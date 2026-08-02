---
sidebar_position: 2
---

# 编写 Dockerfile

`Dockerfile` 是构建镜像的「配方」，每一条指令生成镜像的一层。一个清晰、可缓存的 Dockerfile 能显著提升构建速度与可维护性。

## 最小可用示例

以 ROS 2 工作区为例，一个典型 Dockerfile：

```dockerfile title="Dockerfile" showLineNumbers
# 1. 基础镜像：固定标签，保证可复现
FROM ros:humble

# 2. 设置环境变量（避免交互式配置卡住）
ENV DEBIAN_FRONTEND=noninteractive
ENV ROS_DOMAIN_ID=1

# 3. 安装依赖
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3-pip && \
    rm -rf /var/lib/apt/lists/*

# 4. 拷贝代码
WORKDIR /workspace
COPY . /workspace

# 5. 容器启动命令
CMD ["ros2", "run", "demo_nodes_cpp", "talker"]
```

构建并运行：

```bash title="Linux" showLineNumbers
docker build -t my-ros-app:1.0 .
docker run -d --name ros-node my-ros-app:1.0
```

## 常用指令对照

| 指令 | 作用 |
| --- | --- |
| `FROM <img>` | 指定基础镜像（必须第一条） |
| `WORKDIR <path>` | 设置工作目录（不存在则创建） |
| `COPY <src> <dst>` | 拷贝文件到镜像 |
| `RUN <cmd>` | 在构建期执行命令（生成新层） |
| `ENV <k>=<v>` | 设置环境变量 |
| `EXPOSE <port>` | 声明暴露端口（仅文档作用） |
| `CMD [...]` | 容器启动时默认命令（可被 `run` 覆盖） |
| `ENTRYPOINT [...]` | 容器入口（与 `CMD` 配合） |

> 💡 `CMD` 与 `docker run` 末尾的命令二选一：后者会覆盖前者。`ENTRYPOINT` 适合把镜像固定成「一个可执行程序」。

## 构建缓存与层顺序

Docker 按指令**从上到下**构建，命中缓存则跳过。`COPY` 之前的指令只要不变就全程复用缓存，因此**把易变的内容（代码）放在后面**：

```dockerfile title="Dockerfile" showLineNumbers
# ✅ 先装依赖（少变），后拷代码（多变）
RUN apt-get update && apt-get install -y python3-pip
COPY . /workspace
```

若把 `COPY` 放在 `RUN apt-get` 之前，每次改代码都会使后续所有层缓存失效，构建变慢。

## .dockerignore

类似 `.gitignore`，避免把本地无关文件（如 `build/`、`node_modules`、`.git`）打进构建上下文：

```text title=".dockerignore"
build/
.git
*.log
```

:::tip

**为什么重要**

构建上下文会被整体发送给 Docker 守护进程。不带 `.dockerignore` 时，大型 `node_modules` 会显著拖慢 `docker build`。

:::

镜像体积优化见 [镜像瘦身](/docs/docker/hands-on/image-slimming)。
