---
sidebar_position: 2
---

# Command Cheatsheet

A one-page summary of the most frequent Docker commands for quick reference. See the other pages in this section for full usage.

## Images

| Command | Description |
| --- | --- |
| `docker pull <img>:<tag>` | Pull an image |
| `docker images` | List local images |
| `docker build -t <name>:<tag> .` | Build an image |
| `docker tag <src> <dst>` | Tag an image |
| `docker save -o <file>.tar <img>` | Export an image |
| `docker load -i <file>.tar` | Import an image |
| `docker rmi <img>` | Remove an image |
| `docker image prune` | Clean dangling images |

## Containers

| Command | Description |
| --- | --- |
| `docker run -d -p <h>:<c> --name <n> <img>` | Start a container in background |
| `docker ps` / `docker ps -a` | List running / all containers |
| `docker exec -it <n> bash` | Enter a container |
| `docker logs -f <n>` | Follow logs |
| `docker stop <n>` / `docker kill <n>` | Graceful / force stop |
| `docker rm <n>` | Remove a container |
| `docker stats` | Live resource usage |

## Volumes

| Command | Description |
| --- | --- |
| `docker volume create <name>` | Create a volume |
| `docker volume ls` | List volumes |
| `docker volume prune` | Clean unused volumes |

## Networks

| Command | Description |
| --- | --- |
| `docker network create <name>` | Create a network |
| `docker network ls` | List networks |
| `docker network inspect <name>` | Inspect network details |

## Compose

| Command | Description |
| --- | --- |
| `docker compose up -d` | Start all services in background |
| `docker compose ps` | Show service status |
| `docker compose logs -f [svc]` | View logs |
| `docker compose exec <svc> bash` | Enter a service container |
| `docker compose down` | Stop and remove containers/networks |
| `docker compose down -v` | Also remove volumes |

## System cleanup

| Command | Description |
| --- | --- |
| `docker system df` | Show disk usage |
| `docker system prune -a` | Clean all unused resources |

> ⚠️ `docker system prune -a` and `docker compose down -v` **permanently delete** data and images — run them only when you don't need to keep them.
