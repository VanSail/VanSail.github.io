---
sidebar_position: 5
---

# Network Commands

Multi-container communication relies on **networks**. Docker offers several drivers: `bridge` (default), `host`, `none`, and a custom bridge scoped per project.

## List and create

```bash title="Linux" showLineNumbers
docker network ls
docker network create ros-net
```

## Attach containers to a network

Connect a container to a custom network so it can reach others by **container name** (automatic DNS resolution):

```bash title="Linux" showLineNumbers
docker run -d --name ros-node --network ros-net ros:humble
```

:::tip

**Compose networks automatically**

With `docker compose`, Compose creates a bridge network per project, and services talk to each other by their `services` name — no manual `docker network create` needed. See [Compose Commands](/docs/docker/commands/compose).

:::

## Inspect network details

```bash title="Linux" showLineNumbers
docker network inspect ros-net
```
