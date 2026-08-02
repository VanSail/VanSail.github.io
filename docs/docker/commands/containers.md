---
sidebar_position: 3
---

# 容器命令

容器（Container）是镜像的运行实例。本节覆盖启动、进入、查看日志与停止容器的高频操作，其中 `docker run` 是日常使用最多的命令。

## 启动容器（docker run）

`docker run` 是最核心的命令，下面是一组最常用参数对照：

| 参数 | 作用 | 示例 |
| --- | --- | --- |
| `-d` | 后台运行（detached） | `docker run -d nginx` |
| `-p` | 端口映射 `主机:容器` | `-p 8080:80` |
| `-v` | 挂载卷 `主机:容器` | `-v $PWD/data:/data` |
| `-e` | 注入环境变量 | `-e ROS_DOMAIN_ID=1` |
| `--name` | 指定容器名（便于管理） | `--name ros-node` |
| `--restart` | 退出后重启策略 | `--restart unless-stopped` |
| `--rm` | 退出后自动删除容器 | `docker run --rm ubuntu` |

以一个 ROS 2 节点为例，后台运行并映射端口、设置重启策略：

```bash title="Linux" showLineNumbers
docker run -d \
  --name ros-node \
  -p 11311:11311 \
  -e ROS_DOMAIN_ID=1 \
  --restart unless-stopped \
  ros:humble \
  ros2 run demo_nodes_cpp talker
```

> 💡 交互式调试镜像时，加上 `-it` 并覆盖默认命令进入 shell：`docker run -it --rm ubuntu bash`。

## 查看运行中的容器

仅看正在运行的容器：

```bash title="Linux" showLineNumbers
docker ps
```

查看所有容器（含已停止）：

```bash title="Linux" showLineNumbers
docker ps -a
```

## 进入运行中的容器

以交互终端进入容器（最常用排查方式）：

```bash title="Linux" showLineNumbers
docker exec -it ros-node bash
```

执行一次性命令（不进入交互）：

```bash title="Linux" showLineNumbers
docker exec ros-node ros2 node list
```

## 查看日志

实时跟踪容器日志（`-f` 类似 `tail -f`）：

```bash title="Linux" showLineNumbers
docker logs -f ros-node
```

## 停止与删除

优雅停止（发送 SIGTERM，默认等待 10s）：

```bash title="Linux" showLineNumbers
docker stop ros-node
```

强制停止（立即 SIGKILL）：

```bash title="Linux" showLineNumbers
docker kill ros-node
```

删除已停止的容器：

```bash title="Linux" showLineNumbers
docker rm ros-node
```

:::::tip

**日常排查三连**

遇到容器异常时，按此顺序快速定位：

```bash title="Linux" showLineNumbers
docker ps -a          # 1. 看容器状态与退出码
docker logs ros-node  # 2. 看启动日志
docker exec -it ros-node bash  # 3. 进入容器内部排查
```

:::::

## 资源占用

查看容器实时 CPU、内存、网络占用：

```bash title="Linux" showLineNumbers
docker stats
```
