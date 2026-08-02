---
sidebar_position: 6
---

# Docker Compose 命令

[Docker Compose](https://docs.docker.com/compose/) 用一份 `docker-compose.yml` 定义并管理多容器应用。你的环境已在 [安装篇](/docs/docker/basics/install) 通过 `docker-compose-plugin` 装好，命令为 `docker compose`（注意中间是空格，不是旧版的连字符 `docker-compose`）。

## 启动服务

按 `docker-compose.yml` 创建并后台启动所有服务：

```bash title="Linux" showLineNumbers
docker compose up -d
```

首次调试时前台运行，便于直接看日志（退出即停止）：

```bash title="Linux" showLineNumbers
docker compose up
```

## 查看服务状态

```bash title="Linux" showLineNumbers
docker compose ps
```

## 查看日志

查看所有服务日志并实时跟踪：

```bash title="Linux" showLineNumbers
docker compose logs -f
```

只看某个服务（如 `ros-master`）：

```bash title="Linux" showLineNumbers
docker compose logs -f ros-master
```

## 停止与清理

停止并删除容器、网络（保留卷与镜像）：

```bash title="Linux" showLineNumbers
docker compose down
```

彻底清理，连同卷一起删除（**会丢数据**，谨慎）：

```bash title="Linux" showLineNumbers
docker compose down -v
```

## 在单服务内执行命令

```bash title="Linux" showLineNumbers
docker compose exec ros-node bash
```

## 示例 docker-compose.yml

一个典型的 ROS 2 多节点编排：

```yaml title="docker-compose.yml" showLineNumbers
services:
  talker:
    image: ros:humble
    command: ros2 run demo_nodes_cpp talker
    environment:
      - ROS_DOMAIN_ID=1
    restart: unless-stopped
  listener:
    image: ros:humble
    command: ros2 run demo_nodes_cpp listener
    environment:
      - ROS_DOMAIN_ID=1
    depends_on:
      - talker
    restart: unless-stopped
```

启动后两个节点会自动跨容器通信：

```bash title="Linux" showLineNumbers
docker compose up -d
docker compose logs -f
```
