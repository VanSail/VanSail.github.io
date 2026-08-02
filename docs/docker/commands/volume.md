---
sidebar_position: 4
---

# 数据卷命令

容器本身是临时的，重启后内部写入的数据会丢失。**数据卷（Volume）** 是 Docker 管理的持久化存储，独立于容器生命周期，即使容器被删除，卷中数据仍在。

## 创建与查看

```bash title="Linux" showLineNumbers
docker volume create ros-data
docker volume ls
```

## 挂载到容器

使用 `-v 卷名:容器路径`（卷不存在时会自动创建）：

```bash title="Linux" showLineNumbers
docker run -d --name ros-node -v ros-data:/root/.ros ros:humble
```

也可挂载主机目录（bind mount），适合开发时热更新代码：

```bash title="Linux" showLineNumbers
docker run -d --name ros-node -v $PWD/src:/workspace/src ros:humble
```

## 清理卷

删除指定卷（容器正在使用时会报错）：

```bash title="Linux" showLineNumbers
docker volume rm ros-data
```

删除所有未被使用的卷：

```bash title="Linux" showLineNumbers
docker volume prune
```

> ⚠️ 卷删除后数据不可恢复，操作前请确认。相关数据卷与网络的区别见 [网络命令](/docs/docker/commands/network)。
