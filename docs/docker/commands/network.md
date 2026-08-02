---
sidebar_position: 5
---

# 网络命令

多容器之间的通信靠**网络（Network）**。Docker 提供多种驱动：`bridge`（默认）、`host`、`none`，以及按项目隔离的自定义 bridge。

## 查看与创建

```bash title="Linux" showLineNumbers
docker network ls
docker network create ros-net
```

## 连接容器到网络

将容器接入自建网络，使其可通过**容器名**互相访问（DNS 自动解析）：

```bash title="Linux" showLineNumbers
docker run -d --name ros-node --network ros-net ros:humble
```

:::tip

**Compose 自动组网**

使用 `docker compose` 时，Compose 会为项目自动创建一个桥接网络，服务间直接用 `services` 下的名称通信，无需手动 `docker network create`。详见 [Compose 命令](/docs/docker/commands/compose)。

:::

## 检查网络详情

```bash title="Linux" showLineNumbers
docker network inspect ros-net
```
