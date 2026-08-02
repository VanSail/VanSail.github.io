---
sidebar_position: 3
---

# Container Commands

A container is a running instance of an image. This page covers the high-frequency operations for starting, entering, logging, and stopping containers. `docker run` is the single most-used command.

## Start a container (docker run)

`docker run` is the core command. Here is a table of the most common flags:

| Flag | Purpose | Example |
| --- | --- | --- |
| `-d` | Run detached (background) | `docker run -d nginx` |
| `-p` | Port mapping `host:container` | `-p 8080:80` |
| `-v` | Volume mount `host:container` | `-v $PWD/data:/data` |
| `-e` | Inject environment variable | `-e ROS_DOMAIN_ID=1` |
| `--name` | Name the container (easier to manage) | `--name ros-node` |
| `--restart` | Restart policy on exit | `--restart unless-stopped` |
| `--rm` | Auto-remove container on exit | `docker run --rm ubuntu` |

A ROS 2 node example, running in the background with port mapping and a restart policy:

```bash title="Linux" showLineNumbers
docker run -d \
  --name ros-node \
  -p 11311:11311 \
  -e ROS_DOMAIN_ID=1 \
  --restart unless-stopped \
  ros:humble \
  ros2 run demo_nodes_cpp talker
```

> 💡 For interactive image debugging, add `-it` and override the default command to drop into a shell: `docker run -it --rm ubuntu bash`.

## List running containers

Running containers only:

```bash title="Linux" showLineNumbers
docker ps
```

All containers, including stopped ones:

```bash title="Linux" showLineNumbers
docker ps -a
```

## Enter a running container

Open an interactive terminal (the most common troubleshooting step):

```bash title="Linux" showLineNumbers
docker exec -it ros-node bash
```

Run a one-off command without an interactive shell:

```bash title="Linux" showLineNumbers
docker exec ros-node ros2 node list
```

## View logs

Follow container logs in real time (`-f` behaves like `tail -f`):

```bash title="Linux" showLineNumbers
docker logs -f ros-node
```

## Stop and remove

Graceful stop (sends SIGTERM, waits up to 10s by default):

```bash title="Linux" showLineNumbers
docker stop ros-node
```

Force stop (immediate SIGKILL):

```bash title="Linux" showLineNumbers
docker kill ros-node
```

Remove a stopped container:

```bash title="Linux" showLineNumbers
docker rm ros-node
```

:::::tip

**The troubleshooting trio**

When a container misbehaves, locate the issue in this order:

```bash title="Linux" showLineNumbers
docker ps -a          # 1. check status and exit code
docker logs ros-node  # 2. check startup logs
docker exec -it ros-node bash  # 3. enter the container to investigate
```

:::::

## Resource usage

Live CPU, memory, and network usage per container:

```bash title="Linux" showLineNumbers
docker stats
```
