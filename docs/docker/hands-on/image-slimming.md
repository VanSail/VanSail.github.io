---
sidebar_position: 3
---

# 镜像瘦身

镜像越小，拉取越快、攻击面越小、部署越轻。下面三招从易到难。

## 1. 多阶段构建（最常用）

把「编译环境」和「运行环境」分开：编译阶段用大镜像装工具链，最终阶段只拷贝产物到精简镜像，丢弃编译依赖。

以 C++ ROS 2 包为例：

```dockerfile title="Dockerfile" showLineNumbers
# 阶段一：编译
FROM ros:humble AS builder
WORKDIR /workspace
COPY . /workspace
RUN colcon build --packages-select my_pkg

# 阶段二：运行（仅搬运产物）
FROM ros:humble
WORKDIR /app
COPY --from=builder /workspace/install /app/install
CMD ["ros2", "run", "my_pkg", "node"]
```

最终镜像不含编译期的源码与中间文件，体积可缩小数倍。

## 2. 选用精简基础镜像

优先用 `-slim` 或 `-alpine` 变体：

| 基础镜像 | 典型用途 |
| --- | --- |
| `python:3.12-slim` | 仅运行，无编译头文件 |
| `node:20-alpine` | 极小，适合纯运行 |
| `ros:humble` | ROS 必备，已含运行时 |

> ⚠️ Alpine 使用 `musl` libc，部分依赖 glibc 的闭源库（如某些 GPU 驱动）会不兼容，需实测。

## 3. 清理包管理器缓存

`apt`/`pip` 安装后务必清理缓存，否则留在镜像层里：

```dockerfile title="Dockerfile" showLineNumbers
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3-pip && \
    rm -rf /var/lib/apt/lists/*
```

`--no-install-recommends` 也能避免装进非必需的建议包。

## 查看与对比体积

构建后对比瘦身效果：

```bash title="Linux" showLineNumbers
docker images my-ros-app
docker history my-ros-app:1.0   # 看每层体积来源
```

:::::tip

**一键清理无用资源**

删除本次优化过程中产生的中间镜像与缓存：

```bash title="Linux" showLineNumbers
docker builder prune
```

:::::

## 小结

| 手段 | 收益 |
| --- | --- |
| 多阶段构建 | 剔除编译依赖，体积降数倍 |
| 精简基础镜像 | 减少系统层体积 |
| 清理包缓存 | 每层少几十 MB |

回到 [编写 Dockerfile](/docs/docker/hands-on/dockerfile) 复习指令细节。
