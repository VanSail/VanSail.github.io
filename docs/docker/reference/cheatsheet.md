---
sidebar_position: 2
---

# 命令速查表

一页汇总日常最高频的 Docker 命令，方便随时翻阅。完整用法见本栏目其他页面。

## 镜像

| 命令 | 说明 |
| --- | --- |
| `docker pull <img>:<tag>` | 拉取镜像 |
| `docker images` | 列出本地镜像 |
| `docker build -t <name>:<tag> .` | 构建镜像 |
| `docker tag <src> <dst>` | 打标签 |
| `docker save -o <file>.tar <img>` | 导出镜像 |
| `docker load -i <file>.tar` | 导入镜像 |
| `docker rmi <img>` | 删除镜像 |
| `docker image prune` | 清理悬空镜像 |

## 容器

| 命令 | 说明 |
| --- | --- |
| `docker run -d -p <h>:<c> --name <n> <img>` | 后台启动容器 |
| `docker ps` / `docker ps -a` | 查看运行 / 所有容器 |
| `docker exec -it <n> bash` | 进入容器 |
| `docker logs -f <n>` | 跟踪日志 |
| `docker stop <n>` / `docker kill <n>` | 优雅 / 强制停止 |
| `docker rm <n>` | 删除容器 |
| `docker stats` | 实时资源占用 |

## 数据卷

| 命令 | 说明 |
| --- | --- |
| `docker volume create <name>` | 创建数据卷 |
| `docker volume ls` | 列出数据卷 |
| `docker volume prune` | 清理未用卷 |

## 网络

| 命令 | 说明 |
| --- | --- |
| `docker network create <name>` | 创建网络 |
| `docker network ls` | 列出网络 |
| `docker network inspect <name>` | 查看网络详情 |

## Compose

| 命令 | 说明 |
| --- | --- |
| `docker compose up -d` | 后台启动全部服务 |
| `docker compose ps` | 查看服务状态 |
| `docker compose logs -f [svc]` | 查看日志 |
| `docker compose exec <svc> bash` | 进入服务容器 |
| `docker compose down` | 停止并删容器/网络 |
| `docker compose down -v` | 连同卷一起清理 |

## 系统清理

| 命令 | 说明 |
| --- | --- |
| `docker system df` | 查看磁盘占用 |
| `docker system prune -a` | 清理全部未用资源 |

> ⚠️ `docker system prune -a` 与 `docker compose down -v` 会**永久删除**数据与镜像，仅在不需保留时执行。
