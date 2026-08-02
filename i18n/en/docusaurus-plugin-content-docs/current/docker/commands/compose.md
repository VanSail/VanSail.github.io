---
sidebar_position: 6
---

# Docker Compose Commands

[Docker Compose](https://docs.docker.com/compose/) defines and manages multi-container apps with a single `docker-compose.yml`. Your environment already has it installed via `docker-compose-plugin` in the [install guide](/docs/docker/basics/install), so the command is `docker compose` (note the space — not the legacy hyphenated `docker-compose`).

## Start services

Create and start all services in the background as defined in `docker-compose.yml`:

```bash title="Linux" showLineNumbers
docker compose up -d
```

For first-time debugging, run in the foreground to watch logs directly (Ctrl-C stops it):

```bash title="Linux" showLineNumbers
docker compose up
```

## Check service status

```bash title="Linux" showLineNumbers
docker compose ps
```

## View logs

Follow logs from all services in real time:

```bash title="Linux" showLineNumbers
docker compose logs -f
```

A single service only (e.g. `ros-master`):

```bash title="Linux" showLineNumbers
docker compose logs -f ros-master
```

## Stop and clean up

Stop and remove containers and networks (volumes and images are kept):

```bash title="Linux" showLineNumbers
docker compose down
```

Full cleanup including volumes (**data loss**, use with care):

```bash title="Linux" showLineNumbers
docker compose down -v
```

## Run a command inside a service

```bash title="Linux" showLineNumbers
docker compose exec ros-node bash
```

## Example docker-compose.yml

A typical ROS 2 multi-node orchestration:

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

After starting, the two nodes communicate across containers automatically:

```bash title="Linux" showLineNumbers
docker compose up -d
docker compose logs -f
```
